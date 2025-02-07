import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST() {
  try {
    const rawPrivateKey = process.env.DOCUSIGN_PRIVATE_KEY;
    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
    const userId = process.env.DOCUSIGN_USER_ID;

    if (!rawPrivateKey || !integrationKey || !userId) {
      console.error('Missing DocuSign configuration');
      return NextResponse.json(
        { error: 'Missing DocuSign configuration' },
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