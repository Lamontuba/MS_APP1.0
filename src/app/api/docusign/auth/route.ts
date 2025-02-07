
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export async function POST() {
  try {
    const privateKey = process.env.DOCUSIGN_PRIVATE_KEY?.replace(/\\n/g, '\n');
    const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
    const userId = process.env.DOCUSIGN_USER_ID;
    
    if (!privateKey || !integrationKey || !userId) {
      console.error('Missing DocuSign configuration:', { 
        hasPrivateKey: !!privateKey,
        hasIntegrationKey: !!integrationKey,
        hasUserId: !!userId 
      });
      throw new Error('Missing DocuSign configuration');
    }

    const payload = {
      iss: integrationKey,
      sub: userId,
      aud: 'account-d.docusign.com',
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600,
      scope: 'signature impersonation'
    };

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });

    try {
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
        const rawError = await response.text();
        console.error('DocuSign token error (raw):', rawError);
        let error;
        try {
          error = JSON.parse(rawError);
        } catch (parseError) {
          error = { raw: rawError };
        }
        console.error('DocuSign token error (parsed):', error);
        throw new Error('Failed to get DocuSign access token');
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchError) {
      console.error('DocuSign fetch error:', fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error('DocuSign Auth Error:', error);
    return NextResponse.json(
      { error: 'Failed to authenticate with DocuSign', details: error.message }, 
      { status: 500 }
    );
  }
}
