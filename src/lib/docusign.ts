
import jwt from 'jsonwebtoken';

const DOCUSIGN_BASE_PATH = 'https://demo.docusign.net/restapi';

export async function createAndSendEnvelope(formData: any, signerEmail: string, signerName: string) {
  const accessToken = await getAccessToken();
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

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
            yPosition: '700'
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
    body: JSON.stringify(envelope)
  });

  if (!response.ok) {
    throw new Error('Failed to create envelope');
  }

  const result = await response.json();
  return result;
}

async function getAccessToken(): Promise<string> {
  const response = await fetch('/api/docusign/auth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
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
      <body style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 800px; margin: 0 auto; padding: 20px;">
        <h1 style="text-align: center; color: #333;">Merchant Application</h1>
        
        <div style="margin-top: 30px;">
          <h2 style="color: #444;">Business Information</h2>
          <p><strong>Business Name:</strong> ${formData.businessName}</p>
          <p><strong>DBA Name:</strong> ${formData.dbaName || 'N/A'}</p>
          <p><strong>Business Address:</strong> ${formData.businessAddress}</p>
          <p><strong>Business Phone:</strong> ${formData.businessPhone}</p>
          <p><strong>Business Email:</strong> ${formData.businessEmail}</p>
          <p><strong>Tax ID:</strong> ${formData.taxId || 'N/A'}</p>
        </div>

        <div style="margin-top: 50px;">
          <hr style="border: 1px solid #ccc;">
          <p style="margin-top: 30px;"><strong>Signature:</strong> ____________________</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
      </body>
    </html>
  `;
}
