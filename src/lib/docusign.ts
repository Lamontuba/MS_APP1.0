
import jwt from 'jsonwebtoken';

const DOCUSIGN_BASE_PATH = 'https://demo.docusign.net/restapi';

export async function generateJWT(): Promise<string> {
  const privateKey = process.env.DOCUSIGN_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
  const userId = process.env.DOCUSIGN_USER_ID;
  
  if (!privateKey || !integrationKey || !userId) {
    throw new Error('Missing DocuSign configuration');
  }

  const payload = {
    iss: integrationKey,
    sub: userId,
    aud: 'account-d.docusign.com',
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600,
    scope: 'signature'
  };

  return jwt.sign(payload, privateKey, { algorithm: 'RS256' });
}

export async function getAccessToken(): Promise<string> {
  const jwtToken = await generateJWT();
  
  const response = await fetch('https://account-d.docusign.com/oauth/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      'grant_type': 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      'assertion': jwtToken
    })
  });

  const data = await response.json();
  return data.access_token;
}

export async function createAndSendEnvelope(formData: any, signerEmail: string, signerName: string) {
  const accessToken = await getAccessToken();
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

  const envelope = {
    emailSubject: 'Please sign this merchant application',
    documents: [{
      documentBase64: Buffer.from(JSON.stringify(formData, null, 2)).toString('base64'),
      name: 'Merchant Application',
      fileExtension: 'json',
      documentId: '1'
    }],
    recipients: {
      signers: [{
        email: signerEmail,
        name: signerName,
        recipientId: '1',
        routingOrder: '1',
        tabs: {
          signHereTabs: [{
            documentId: '1',
            pageNumber: '1',
            xPosition: '100',
            yPosition: '100'
          }]
        }
      }]
    },
    status: 'sent'
  };

  const response = await fetch(`${DOCUSIGN_BASE_PATH}/v2.1/accounts/${accountId}/envelopes`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ envelopeDefinition: envelope })
  });

  return response.json();
}
