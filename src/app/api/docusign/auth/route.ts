import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST() {
  try {
    let privateKey = process.env.DOCUSIGN_PRIVATE_KEY;
    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
    const userId = process.env.DOCUSIGN_USER_ID;

    if (!privateKey || !integrationKey || !userId) {
      console.error('Missing DocuSign configuration');
      return NextResponse.json(
        { error: 'Missing DocuSign configuration' },
        { status: 500 }
      );
    }

    // Format private key properly
    privateKey = privateKey
      .replace(/\\n/g, '\n')
      .replace(/["']/g, '')
      .trim();

    // Ensure key has proper headers if missing
    if (!privateKey.includes('-----BEGIN RSA PRIVATE KEY-----')) {
      privateKey = `-----BEGIN RSA PRIVATE KEY-----\n${privateKey}\n-----END RSA PRIVATE KEY-----`;
    }

    const payload = {
      iss: integrationKey,
      sub: userId,
      aud: 'account-d.docusign.com',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      scope: 'signature impersonation click.manage click.send'
    };

    console.log('Attempting JWT signing with payload:', {
      ...payload,
      privateKeyLength: privateKey.length
    });

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

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

    const data = await response.json();

    if (!response.ok) {
      console.error('DocuSign token error:', data);
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error('DocuSign Auth Error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}