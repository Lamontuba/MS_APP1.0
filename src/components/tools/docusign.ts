
const BASE_PATH = 'https://demo.docusign.net/restapi';

export async function initializeDocuSignClient() {
  const privateKey = process.env.DOCUSIGN_PRIVATE_KEY;
  const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
  const userId = process.env.DOCUSIGN_USER_ID;

  try {
    const response = await fetch('https://account-d.docusign.com/oauth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: generateJWT(integrationKey, userId, privateKey),
      }),
    });

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error getting JWT token:', error);
    throw error;
  }
}

export async function createEnvelope(accessToken: string, formData: any, recipientEmail: string, recipientName: string) {
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

  const envelopeDefinition = {
    emailSubject: 'Please sign this merchant application',
    documents: [{
      documentBase64: Buffer.from(JSON.stringify(formData)).toString('base64'),
      name: 'Merchant Application',
      fileExtension: 'json',
      documentId: '1'
    }],
    recipients: {
      signers: [{
        email: recipientEmail,
        name: recipientName,
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

  try {
    const response = await fetch(`${BASE_PATH}/v2.1/accounts/${accountId}/envelopes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ envelopeDefinition }),
    });

    return response.json();
  } catch (error) {
    console.error('Error creating envelope:', error);
    throw error;
  }
}

function generateJWT(integrationKey: string, userId: string, privateKey: string): string {
  // Implement JWT generation here
  // You'll need to add a JWT library like 'jsonwebtoken'
  return '';
}
