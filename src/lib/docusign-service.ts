import { getDocuSignAccessToken } from './docusign-auth';

export interface DocuSignError extends Error {
  statusCode?: number;
  details?: {
    error?: string;
    [key: string]: any;
  };
}

export interface FormData {
  email: string;
  phone: string;
  signature1: string;
  signature2: string;
  date: string;
}

export async function sendEnvelopeToAdmin(formData: FormData): Promise<any> {
  try {
    const accessToken = await getDocuSignAccessToken();
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
    const templateId = process.env.DOCUSIGN_TEMPLATE_ID;
    const adminEmail = process.env.DOCUSIGN_ADMIN_EMAIL || 'fpaocretv@gmail.com';

    console.log('DocuSign Configuration:', {
      accountId,
      templateId,
      adminEmail,
      hasAccessToken: !!accessToken,
      formData: {
        ...formData,
        signature1: '[SIGNATURE_1_DATA]',
        signature2: '[SIGNATURE_2_DATA]'
      }
    });

    if (!accountId || !templateId) {
      throw new Error('Missing DocuSign configuration');
    }

    // Convert signatures to base64 format
    const signature1Image = formData.signature1.split(',')[1];
    const signature2Image = formData.signature2.split(',')[1];

    const envelope = {
      templateId,
      status: 'sent',
      emailSubject: `New Application - ${formData.email}`,
      templateRoles: [{
        email: adminEmail,
        name: 'Administrator',
        roleName: 'signer',
        tabs: {
          textTabs: [
            {
              documentId: '1',
              pageNumber: '1',
              xPosition: '150',
              yPosition: '300',
              font: 'helvetica',
              fontSize: 'size11',
              value: formData.email
            },
            {
              documentId: '1',
              pageNumber: '1',
              xPosition: '150',
              yPosition: '350',
              font: 'helvetica',
              fontSize: 'size11',
              value: formData.phone
            },
            {
              documentId: '1',
              pageNumber: '1',
              xPosition: '150',
              yPosition: '450',
              font: 'helvetica',
              fontSize: 'size11',
              value: formData.date
            }
          ],
          signatureTabs: [
            {
              documentId: '1',
              pageNumber: '1',
              xPosition: '150',
              yPosition: '400',
              name: formData.email,
              optional: false,
              signatureBase64: signature1Image
            },
            {
              documentId: '1',
              pageNumber: '1',
              xPosition: '150',
              yPosition: '550',
              name: formData.email,
              optional: false,
              signatureBase64: signature2Image
            }
          ]
        }
      }]
    };

    console.log('Sending envelope to admin:', JSON.stringify({
      ...envelope,
      templateRoles: [{
        ...envelope.templateRoles[0],
        tabs: {
          ...envelope.templateRoles[0].tabs,
          signatureTabs: envelope.templateRoles[0].tabs.signatureTabs.map(tab => ({
            ...tab,
            signatureBase64: '[SIGNATURE_DATA_HIDDEN]'
          }))
        }
      }]
    }, null, 2));

    const url = `https://demo.docusign.net/restapi/v2.1/accounts/${accountId}/envelopes`;
    console.log('DocuSign API URL:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(envelope)
    });

    const responseText = await response.text();
    console.log('DocuSign envelope creation response:', responseText);

    if (!response.ok) {
      let errorMessage = `Failed to send envelope: ${response.status} ${response.statusText}`;
      try {
        const error = JSON.parse(responseText);
        errorMessage = error.message || errorMessage;
        console.error('DocuSign error details:', error);
      } catch (e) {
        // If we can't parse the error JSON, use the status text
      }
      const docuSignError = new Error(errorMessage) as DocuSignError;
      docuSignError.statusCode = response.status;
      throw docuSignError;
    }

    const result = JSON.parse(responseText);
    return result;
  } catch (error) {
    console.error('Error sending envelope:', error);
    throw error;
  }
}
