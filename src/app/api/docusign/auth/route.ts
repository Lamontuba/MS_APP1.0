import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST() {
  try {
    let rawPrivateKey = process.env.DOCUSIGN_PRIVATE_KEY;
    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
    const userId = process.env.DOCUSIGN_USER_ID;

    // Ensure private key has proper line breaks
    if (rawPrivateKey) {
      rawPrivateKey = rawPrivateKey
        .replace(/\\n/g, '\n')
        .replace(/-----(BEGIN|END) RSA PRIVATE KEY-----\s*/g, (match) => match.trim() + '\n');
    }

    console.log('DocuSign Config Check:', {
      hasPrivateKey: !!rawPrivateKey,
      hasIntegrationKey: !!integrationKey,
      hasUserId: !!userId,
      privateKeyLength: rawPrivateKey?.length
    });

    if (!rawPrivateKey || !integrationKey || !userId) {
      console.error('Missing DocuSign configuration:', {
        hasPrivateKey: !!rawPrivateKey,
        hasIntegrationKey: !!integrationKey,
        hasUserId: !!userId
      });
      return NextResponse.json(
        { error: 'Missing DocuSign configuration. Please check environment variables.' },
        { status: 500 }
      );
    }

    // Validate private key format
    if (!rawPrivateKey.includes('-----BEGIN RSA PRIVATE KEY-----')) {
      console.error('Invalid private key format');
      return NextResponse.json(
        { error: 'Invalid private key format' },
        { status: 500 }
      );
    }

    // Convert literal "\n" sequences into actual newline characters
    const privateKey = rawPrivateKey.replace(/\\n/g, '\n');

    const payload = {
      iss: integrationKey,
      sub: userId,
      aud: 'account-d.docusign.com',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      scope: 'signature impersonation'
    };

    const token = jwt.sign(payload, privateKey, { 
      algorithm: 'RS256'
    });

    const response = await fetch('https://account-d.docusign.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'assertion': token
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('DocuSign token error:', {
        status: response.status,
        error: error,
        payload: payload
      });
      return NextResponse.json(
        { error: 'Failed to get DocuSign access token', details: error },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('DocuSign Auth Error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate with DocuSign', details: error.message },
      { status: 500 }
    );
  }
}