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
  
  return `https://account-d.docusign.net/oauth/auth?response_type=code&scope=${scopes}&client_id=${integrationKey}&redirect_uri=${redirectUri}`;
}

export async function getDocuSignAccessToken(): Promise<string> {
  try {
    let privateKey = process.env.DOCUSIGN_PRIVATE_KEY;
    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
    const userId = process.env.DOCUSIGN_USER_ID;

    if (!privateKey || !integrationKey || !userId) {
      throw new Error('Missing required DocuSign configuration');
    }

    // Format private key
    privateKey = privateKey
      .replace(/\\n/g, '\n')
      .replace(/["']/g, '')
      .replace(/-----(BEGIN|END) RSA PRIVATE KEY-----\s*/g, (match) => match.trim() + '\n');

    const payload = {
      iss: integrationKey,
      sub: userId,
      aud: 'account-d.docusign.com',
      scope: 'signature impersonation',
      exp: Math.floor(Date.now() / 1000) + 3600
    };

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

    // Exchange JWT for access token
    const response = await fetch('https://account-d.docusign.net/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token
      })
    });

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
  } catch (error) {
    console.error('DocuSign authentication error:', error);
    throw error;
  }
}
