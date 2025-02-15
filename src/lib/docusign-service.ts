import { getDocuSignAccessToken } from './docusign-auth';

export interface DocuSignError extends Error {
  statusCode?: number;
  details?: {
    error?: string;
    [key: string]: any;
  };
}

export interface FormData {
  businessName: string;
  businessAddress: string;
  businessPhone: string;
  businessEmail: string;
  ownerName: string;
  ownerTitle: string;
  ownerPhone: string;
  ownerEmail: string;
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
      hasAccessToken: !!accessToken
    });

    if (!accountId || !templateId) {
      throw new Error('Missing DocuSign configuration');
    }

    const envelope = {
      templateId,
      status: 'sent',
      emailSubject: `New Merchant Application - ${formData.businessName}`,
      templateRoles: [{
        email: adminEmail,
        name: 'Administrator',
        roleName: 'signer',
        tabs: {
          textTabs: [
            {
              tabLabel: 'businessName',
              value: formData.businessName
            },
            {
              tabLabel: 'businessAddress',
              value: formData.businessAddress
            },
            {
              tabLabel: 'businessPhone',
              value: formData.businessPhone
            },
            {
              tabLabel: 'businessEmail',
              value: formData.businessEmail
            },
            {
              tabLabel: 'ownerName',
              value: formData.ownerName
            },
            {
              tabLabel: 'ownerTitle',
              value: formData.ownerTitle
            },
            {
              tabLabel: 'ownerPhone',
              value: formData.ownerPhone
            },
            {
              tabLabel: 'ownerEmail',
              value: formData.ownerEmail
            }
          ]
        }
      }]
    };

    console.log('Sending envelope to admin:', JSON.stringify(envelope, null, 2));

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
    console.log('Envelope creation response:', responseText);

    if (!response.ok) {
      let errorMessage = `Failed to send envelope: ${response.status} ${response.statusText}`;
      try {
        const error = JSON.parse(responseText);
        errorMessage = error.message || errorMessage;
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
