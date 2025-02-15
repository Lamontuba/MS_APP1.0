import jwt from 'jsonwebtoken';

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
  try {
    let privateKey = process.env.DOCUSIGN_PRIVATE_KEY;
    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
    const userId = process.env.DOCUSIGN_USER_ID;

    if (!privateKey || !integrationKey || !userId) {
      throw new Error('Missing required DocuSign configuration');
    }

    // Format private key - handle both Windows and Unix line endings
    privateKey = privateKey
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '')
      .replace(/["']/g, '')
      .split('\\n').join('\n');

    // Ensure proper line breaks around header and footer
    if (!privateKey.includes('-----BEGIN RSA PRIVATE KEY-----\n')) {
      privateKey = privateKey.replace('-----BEGIN RSA PRIVATE KEY-----', '-----BEGIN RSA PRIVATE KEY-----\n');
    }
    if (!privateKey.includes('\n-----END RSA PRIVATE KEY-----')) {
      privateKey = privateKey.replace('-----END RSA PRIVATE KEY-----', '\n-----END RSA PRIVATE KEY-----');
    }

    const payload = {
      iss: integrationKey,
      sub: userId,
      aud: 'account-d.docusign.com',
      scope: 'signature impersonation',
      exp: Math.floor(Date.now() / 1000) + 3600
    };

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

    // Add DNS resolution timeout and other options
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      // Exchange JWT for access token
      const response = await fetch('https://account-d.docusign.com/oauth/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
          assertion: token
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json();
        if (error.error === 'consent_required') {
          const authError = new Error('DocuSign consent required') as DocuSignAuthError;
          authError.details = {
            error: 'consent_required',
            consentUrl: getJWTConsentUrl()
          };
          throw authError;
        }
        throw new Error(`Failed to get access token: ${error.error_description || error.error}`);
      }

      const data = await response.json();
      return data.access_token;
    } catch (fetchError) {
      if (fetchError.name === 'AbortError') {
        throw new Error('DocuSign API request timed out. Please check your network connection.');
      }
      throw fetchError;
    }
  } catch (error) {
    console.error('DocuSign authentication error:', error);
    throw error;
  }
}
