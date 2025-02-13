import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST() {
  try {
    let rawPrivateKey = process.env.DOCUSIGN_PRIVATE_KEY;
    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
    const userId = process.env.DOCUSIGN_USER_ID;

    // Debug logging
    console.log('DocuSign Config:', {
      hasPrivateKey: !!rawPrivateKey,
      hasIntegrationKey: !!integrationKey,
      hasUserId: !!userId,
      privateKeyLength: rawPrivateKey?.length
    });

    if (!rawPrivateKey || !integrationKey || !userId) {
      console.error('Missing credentials:', {
        hasPrivateKey: !!rawPrivateKey,
        hasIntegrationKey: !!integrationKey,
        hasUserId: !!userId
      });
      return NextResponse.json(
        { error: 'Missing DocuSign credentials. Please check your environment variables.' },
        { status: 401 }
      );
    }

    // Validate private key format
    if (!rawPrivateKey.includes('BEGIN RSA PRIVATE KEY')) {
      console.error('Invalid private key format');
      return NextResponse.json(
        { error: 'Invalid private key format. Please check your DOCUSIGN_PRIVATE_KEY secret.' },
        { status: 401 }
      );
    }

    // Format private key
    rawPrivateKey = rawPrivateKey
      .replace(/\\n/g, '\n')
      .replace(/["']/g, '')
      .trim();

    // Ensure proper RSA key format
    if (!rawPrivateKey.includes('-----BEGIN RSA PRIVATE KEY-----')) {
      rawPrivateKey = `-----BEGIN RSA PRIVATE KEY-----\n${rawPrivateKey}\n-----END RSA PRIVATE KEY-----`;
    }

    // Add line breaks every 64 characters in the key body
    const keyParts = rawPrivateKey.split('\n');
    const header = keyParts[0];
    const footer = keyParts[keyParts.length - 1];
    const keyBody = keyParts.slice(1, -1).join('');
    const formattedBody = keyBody.match(/.{1,64}/g)?.join('\n') || '';
    rawPrivateKey = `${header}\n${formattedBody}\n${footer}`;

    const payload = {
      iss: integrationKey,
      sub: userId,
      aud: 'account-d.docusign.com',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      scope: 'signature impersonation click.manage'
    };

    const token = jwt.sign(payload, rawPrivateKey, { algorithm: 'RS256' });

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
      console.error('DocuSign token error:', error);
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
      { error: 'Authentication failed', details: error.message },
      { status: 500 }
    );
  }
}