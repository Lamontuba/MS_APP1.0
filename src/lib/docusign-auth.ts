import jwt from 'jsonwebtoken';

let cachedToken: {
  access_token: string;
  expires_at: number;
} | null = null;

export interface DocuSignAuthError extends Error {
  details?: {
    error?: string;
    consentUrl?: string;
    [key: string]: any;
  };
}

export function getJWTConsentUrl(): string {
  const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
  if (!integrationKey) {
    throw new Error('DOCUSIGN_INTEGRATION_KEY environment variable is not set');
  }

  const scopes = encodeURIComponent('signature impersonation');
  const redirectUri = encodeURIComponent('http://localhost:3000/api/docusign/callback');
  
  return `https://account-d.docusign.com/oauth/auth?response_type=code&scope=${scopes}&client_id=${integrationKey}&redirect_uri=${redirectUri}`;
}

export async function getDocuSignAccessToken(): Promise<string> {
  // Check if we have a valid cached token
  if (cachedToken && cachedToken.expires_at > Date.now()) {
    console.log('Using cached DocuSign access token');
    return cachedToken.access_token;
  }

  console.log('Generating new DocuSign access token...');

  const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
  const userId = process.env.DOCUSIGN_USER_ID;
  const privateKey = process.env.DOCUSIGN_PRIVATE_KEY?.replace(/\\n/g, '\n');

  if (!integrationKey || !userId || !privateKey) {
    throw new Error('Missing DocuSign authentication configuration');
  }

  try {
    // Generate JWT
    const now = Math.floor(Date.now() / 1000);
    const jwtPayload = {
      iss: integrationKey,
      sub: userId,
      aud: 'account-d.docusign.com',
      iat: now,
      exp: now + 3600,
      scope: 'signature'
    };

    const assertion = jwt.sign(jwtPayload, privateKey, {
      algorithm: 'RS256'
    });

    // Exchange JWT for access token with increased timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

    try {
      const response = await fetch('https://account-d.docusign.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: assertion
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        console.error('DocuSign token error response:', error);
        throw new Error(`Failed to get DocuSign access token: ${error.error_description || error.error || response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the token with expiration
      cachedToken = {
        access_token: data.access_token,
        expires_at: Date.now() + (data.expires_in * 1000) - 300000 // Expire 5 minutes early
      };

      console.log('Successfully generated new DocuSign access token');
      return data.access_token;
    } catch (fetchError: any) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        console.error('DocuSign token request timed out');
        // Clear any existing cached token on timeout
        cachedToken = null;
        throw new Error('DocuSign API request timed out. Please try again.');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('Error getting DocuSign access token:', error);
    // Clear cached token on any error
    cachedToken = null;
    throw error;
  }
}
