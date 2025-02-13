import jwt from 'jsonwebtoken';

const DOCUSIGN_BASE_PATH = 'https://demo.docusign.net/restapi';

export async function getDocuSignToken() {
  try {
    let privateKey = process.env.DOCUSIGN_PRIVATE_KEY;

    if (!privateKey) {
      throw new Error('DOCUSIGN_PRIVATE_KEY environment variable is not set');
    }

    // Format private key
    privateKey = privateKey
      .replace(/\\n/g, '\n')
      .replace(/["']/g, '')
      .replace(/-----(BEGIN|END) RSA PRIVATE KEY-----\s*/g, (match) => match.trim() + '\n');

    console.log('DocuSign Token Generation:', {
      hasPrivateKey: !!privateKey,
      privateKeyLength: privateKey?.length,
      keyFormat: privateKey?.substring(0, 50) + '...' // Log first 50 chars for debugging
    });

    const payload = {
      iss: process.env.DOCUSIGN_INTEGRATION_KEY,
      sub: process.env.DOCUSIGN_USER_ID,
      aud: 'account-d.docusign.com',
      scope: 'signature impersonation click.manage',
      exp: Math.floor(Date.now() / 1000) + 3600
    };

    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256' });
    return token;
  } catch (error) {
    console.error("DocuSign token error:", error);
    throw new Error("Failed to get DocuSign access token");
  }
}

interface FormData {
  businessName: string;
  dbaName?: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  taxId?: string;
  ownerName: string;
  ownerTitle: string;
  ownerPhone: string;
  ownerEmail: string;
  ownerSSN?: string;
  dateOfBirth?: string;
  monthlyVolume?: string;
  averageTicket?: string;
  maxTicket?: string;
  bankName?: string;
  routingNumber?: string;
  accountNumber?: string;
  signature?: string;
  signatureDate?: string;
}

export async function createAndSendEnvelope(formData: FormData, signerEmail: string, signerName: string) {
  try {
    const accessToken = await getDocuSignToken();
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
        const error = await response.json();
        console.error('DocuSign envelope error:', error);
        throw new Error('Failed to create envelope');
      }

      return response.json();
    } catch (error) {
      console.error('DocuSign create envelope error:', error);
      throw new Error('Failed to create envelope');
    }
  } catch (error) {
    console.error("DocuSign auth error:", error);
    throw error;
  }
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
          <p><strong>Business Type:</strong> ${formData.businessType}</p>
          <p><strong>Tax ID/EIN:</strong> ${formData.taxId || 'N/A'}</p>
          <p><strong>Business Category:</strong> ${formData.businessCategory}</p>
        </div>

        <div style="margin-top: 30px;">
          <h2 style="color: #444;">Processing Information</h2>
          <p><strong>Monthly Volume:</strong> ${formData.monthlyVolume}</p>
          <p><strong>Average Ticket:</strong> ${formData.averageTicket}</p>
          <p><strong>Processing Methods:</strong> ${formData.processingMethods.join(', ')}</p>
        </div>

        <div style="margin-top: 30px;">
          <h2 style="color: #444;">Bank Information</h2>
          <p><strong>Bank Name:</strong> ${formData.bankName}</p>
          <p><strong>Account Type:</strong> ${formData.accountType}</p>
          <p><strong>Routing Number:</strong> ${formData.routingNumber}</p>
          <p><strong>Account Number:</strong> ${formData.accountNumber}</p>
        </div>

        <div style="margin-top: 30px;">
          <h2 style="color: #444;">Owner Information</h2>
          <p><strong>Name:</strong> ${formData.ownerName}</p>
          <p><strong>Title:</strong> ${formData.ownerTitle}</p>
          <p><strong>Phone:</strong> ${formData.ownerPhone}</p>
          <p><strong>Email:</strong> ${formData.ownerEmail}</p>
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