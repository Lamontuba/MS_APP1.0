
import jwt from 'jsonwebtoken';

const DOCUSIGN_BASE_PATH = process.env.NEXT_PUBLIC_DOCUSIGN_BASE_PATH || 'https://demo.docusign.net/restapi';

export async function createAndSendEnvelope(formData: any, signerEmail: string, signerName: string) {
  const accessToken = await getAccessToken();
  const accountId = process.env.NEXT_PUBLIC_DOCUSIGN_ACCOUNT_ID;

  if (!accountId) {
    throw new Error('DocuSign Account ID is required');
  }

  const documentHtml = generateDocumentHtml(formData);
  const documentBase64 = Buffer.from(documentHtml).toString('base64');

  const envelope = {
    emailSubject: 'Please sign this merchant application',
    documents: [{
      documentBase64,
      name: 'Merchant Application',
      fileExtension: 'html',
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

  try {
    const response = await fetch(`${DOCUSIGN_BASE_PATH}/v2.1/accounts/${accountId}/envelopes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(envelope)
    });

    if (!response.ok) {
      throw new Error('Failed to create envelope');
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('DocuSign API Error:', error);
    throw error;
  }
}

async function getAccessToken(): Promise<string> {
  const response = await fetch('/api/docusign/auth', {
    method: 'POST'
  });
  
  if (!response.ok) {
    throw new Error('Failed to get DocuSign access token');
  }

  const data = await response.json();
  return data.access_token;
}

function generateDocumentHtml(formData: any): string {
  return `
    <!DOCTYPE html>
    <html>
      <body>
        <h1>Merchant Application</h1>
        <div>
          <h2>Business Information</h2>
          <p>Business Name: ${formData.businessName}</p>
          <p>DBA Name: ${formData.dbaName}</p>
          <p>Business Address: ${formData.businessAddress}</p>
          <p>Business Phone: ${formData.businessPhone}</p>
          <p>Business Email: ${formData.businessEmail}</p>
          <p>Tax ID: ${formData.taxId}</p>
        </div>
        <!-- Add signature field -->
        <div style="margin-top: 50px;">
          <p>Signature: ____________________</p>
          <p>Date: ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
    </html>
  `;
}
