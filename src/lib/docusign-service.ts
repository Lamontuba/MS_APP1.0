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

    if (!accountId || !templateId) {
      throw new Error('Missing DocuSign configuration');
    }

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

    // Convert signatures to base64 format if they're not already
    const signature1Image = formData.signature1.includes('base64,') 
      ? formData.signature1.split(',')[1] 
      : formData.signature1;
    const signature2Image = formData.signature2.includes('base64,') 
      ? formData.signature2.split(',')[1] 
      : formData.signature2;

    // Log signature data for debugging
    console.log('Signature 1 length:', signature1Image?.length);
    console.log('Signature 2 length:', signature2Image?.length);

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
              anchorString: 'Email:',
              anchorUnits: 'pixels',
              anchorXOffset: '100',
              anchorYOffset: '0',
              value: formData.email,
              locked: true
            },
            {
              anchorString: 'Phone:',
              anchorUnits: 'pixels',
              anchorXOffset: '100',
              anchorYOffset: '0',
              value: formData.phone,
              locked: true
            },
            {
              anchorString: 'Date:',
              anchorUnits: 'pixels',
              anchorXOffset: '100',
              anchorYOffset: '0',
              value: formData.date,
              locked: true
            }
          ],
          stampTabs: [
            {
              anchorString: 'Signature:',
              anchorUnits: 'pixels',
              anchorXOffset: '100',
              anchorYOffset: '0',
              stampImageBase64: signature1Image,
              stampType: 'signature',
              imageType: 'signature',
              locked: true
            },
            {
              anchorString: 'By signing this document',
              anchorUnits: 'pixels',
              anchorXOffset: '0',
              anchorYOffset: '20',
              stampImageBase64: signature2Image,
              stampType: 'signature',
              imageType: 'signature',
              locked: true
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
          stampTabs: envelope.templateRoles[0].tabs.stampTabs.map(tab => ({
            ...tab,
            stampImageBase64: '[SIGNATURE_DATA_HIDDEN]'
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
