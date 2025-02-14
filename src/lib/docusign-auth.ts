import jwt from 'jsonwebtoken';

export class DocuSignAuthError extends Error {
  constructor(message: string, public details: any) {
    super(message);
    this.name = 'DocuSignAuthError';
  }
}

function formatPrivateKey(privateKey: string): string {
  console.log('Key format check 1:', {
    length: privateKey.length,
    hasBeginMarker: privateKey.includes('-----BEGIN RSA PRIVATE KEY-----'),
    hasEndMarker: privateKey.includes('-----END RSA PRIVATE KEY-----'),
    startsWithV: privateKey.startsWith('-----BEGIN'),
    lineCount: privateKey.split('\n').length
  });

  // Remove any existing headers and footers
  let key = privateKey
    .replace('-----BEGIN RSA PRIVATE KEY-----', '')
    .replace('-----END RSA PRIVATE KEY-----', '')
    .replace(/[\r\n\s]/g, '');

  // Format the key body with proper line breaks
  const chunkSize = 64;
  const chunks = key.match(new RegExp(`.{1,${chunkSize}}`, 'g')) || [];
  const formattedBody = chunks.join('\n');

  console.log('Key format check 2:', {
    lineCount: formattedBody.split('\n').length,
    firstLine: '-----BEGIN RSA PRIVATE KEY-----',
    lastLine: '-----END RSA PRIVATE KEY-----'
  });

  // Add back the headers and footers
  const formattedKey = [
    '-----BEGIN RSA PRIVATE KEY-----',
    formattedBody,
    '-----END RSA PRIVATE KEY-----'
  ].join('\n');

  console.log('Final key format:', {
    length: formattedKey.length,
    lineCount: formattedKey.split('\n').length,
    firstLine: formattedKey.split('\n')[0],
    lastLine: formattedKey.split('\n')[formattedKey.split('\n').length - 1],
    sampleLine: 'MIIEowIBAA...'
  });

  return formattedKey;
}

function getDocuSignDomain(): string {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return isDevelopment ? 'account-d.docusign.com' : 'account.docusign.com';
}

export function getJWTConsentUrl(): string {
  const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
  if (!integrationKey) {
    throw new DocuSignAuthError(
      'DocuSign Integration Key is required',
      { error: 'missing_integration_key' }
    );
  }

  // For development, we'll use localhost:3000 as the redirect URI
  const redirectUri = encodeURIComponent('http://localhost:3000/api/docusign/callback');
  const scopes = encodeURIComponent('signature impersonation');
  
  return `https://account-d.docusign.com/oauth/auth?response_type=code&scope=${scopes}&client_id=${integrationKey}&redirect_uri=${redirectUri}`;
}

export async function getDocuSignAccessToken(): Promise<string> {
  try {
    // Get and validate environment variables
    console.log('Raw Environment Variables:', {
      INTEGRATION_KEY: process.env.DOCUSIGN_INTEGRATION_KEY,
      USER_ID: process.env.DOCUSIGN_USER_ID,
      ACCOUNT_ID: process.env.DOCUSIGN_ACCOUNT_ID,
      PRIVATE_KEY_LENGTH: process.env.DOCUSIGN_PRIVATE_KEY?.length,
      PRIVATE_KEY_STARTS_WITH: process.env.DOCUSIGN_PRIVATE_KEY?.substring(0, 50)
    });

    const requiredEnvVars = {
      DOCUSIGN_INTEGRATION_KEY: process.env.DOCUSIGN_INTEGRATION_KEY,
      DOCUSIGN_USER_ID: process.env.DOCUSIGN_USER_ID,
      DOCUSIGN_ACCOUNT_ID: process.env.DOCUSIGN_ACCOUNT_ID,
      DOCUSIGN_TEMPLATE_ID: process.env.DOCUSIGN_TEMPLATE_ID,
      DOCUSIGN_PRIVATE_KEY: process.env.DOCUSIGN_PRIVATE_KEY,
      NODE_ENV: process.env.NODE_ENV
    };

    console.log('Environment Variables Check:', Object.entries(requiredEnvVars).reduce((acc, [key, value]) => ({
      ...acc,
      [key]: value ? '✓ Present' : '✗ Missing'
    }), {}));

    const {
      DOCUSIGN_INTEGRATION_KEY: integrationKey,
      DOCUSIGN_USER_ID: userId,
      DOCUSIGN_PRIVATE_KEY: privateKey
    } = requiredEnvVars;

    if (!integrationKey || !userId || !privateKey) {
      throw new DocuSignAuthError(
        'Missing required environment variables',
        {
          error: 'missing_env_vars',
          vars: {
            integrationKey: !integrationKey,
            userId: !userId,
            privateKey: !privateKey
          }
        }
      );
    }

    console.log('Credential Details:', {
      integrationKeyLength: integrationKey.length,
      userIdLength: userId.length,
      hasPrivateKey: !!privateKey,
      privateKeyLength: privateKey.length
    });

    // Format the private key
    const formattedKey = formatPrivateKey(privateKey);

    // Create JWT payload
    const now = Math.floor(Date.now() / 1000);
    const payload = {
      iss: integrationKey,
      sub: userId,
      aud: 'account-d.docusign.com',
      scope: 'signature',
      iat: now,
      exp: now + 3600,
      privateKeyLength: formattedKey.length
    };

    console.log('Creating JWT token with payload:', payload);

    // Sign the JWT
    const token = jwt.sign(payload, formattedKey, {
      algorithm: 'RS256'
    });

    console.log('Exchanging JWT for access token...');

    // Exchange JWT for access token
    const response = await fetch('https://account-d.docusign.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: token
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('OAuth error response:', data);
      
      // Special handling for consent_required error
      if (data.error === 'consent_required') {
        const consentUrl = getJWTConsentUrl();
        throw new DocuSignAuthError('Consent required', {
          error: 'consent_required',
          consentUrl,
          originalError: data
        });
      }
      
      throw new DocuSignAuthError('Failed to get access token', data);
    }

    if (!data.access_token) {
      throw new DocuSignAuthError('No access token in response', data);
    }

    return data.access_token;
  } catch (error) {
    // If it's already a DocuSignAuthError, just rethrow it
    if (error instanceof DocuSignAuthError) {
      throw error;
    }
    
    console.error('JWT signing error:', error);
    throw new DocuSignAuthError(
      'Failed to sign JWT token',
      error instanceof Error ? error.message : error
    );
  }
}