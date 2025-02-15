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
  signature: string; // Base64 image of signature
  signatureDate: string;
}

export async function sendEnvelopeToAdmin(formData: FormData): Promise<any> {
  try {
    const accessToken = await getDocuSignAccessToken();
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
    const templateId = process.env.DOCUSIGN_TEMPLATE_ID;
    const adminEmail = process.env.DOCUSIGN_ADMIN_EMAIL || 'admin@example.com';
    const baseUrl = process.env.DOCUSIGN_BASE_PATH || 'https://demo.docusign.net';

    console.log('DocuSign Configuration:', {
      accountId,
      templateId,
      adminEmail,
      baseUrl,
      hasAccessToken: !!accessToken
    });

    if (!accountId || !templateId) {
      throw new Error('Missing DocuSign configuration');
    }

    // Convert base64 signature to DocuSign format if needed
    const signatureImage = formData.signature.split(',')[1]; // Remove data:image/png;base64, prefix

    const envelope = {
      templateId,
      status: 'sent',
      emailSubject: `New Merchant Application - ${formData.businessName}`,
      templateRoles: [{
        email: adminEmail,
        name: 'Administrator',
        roleName: 'signer',
        tabs: {
          textTabs: Object.entries(formData)
            .filter(([key]) => key !== 'signature') // Exclude signature from text tabs
            .map(([key, value]) => ({
              tabLabel: key,
              value: value?.toString() || ''
            })),
          signHereTabs: [{
            tabLabel: 'merchantSignature',
            imageType: 'signature',
            signatureImageData: signatureImage,
            stampType: 'signature',
            name: formData.ownerName,
            optional: false,
            scaleValue: 1.0
          }]
        }
      }]
    };

    console.log('Sending envelope to admin:', JSON.stringify({
      ...envelope,
      templateRoles: [{
        ...envelope.templateRoles[0],
        tabs: {
          ...envelope.templateRoles[0].tabs,
          signHereTabs: [{
            ...envelope.templateRoles[0].tabs.signHereTabs[0],
            signatureImageData: 'BASE64_SIGNATURE_DATA_HIDDEN_FOR_LOGGING'
          }]
        }
      }]
    }, null, 2));

    const url = `${baseUrl}/restapi/v2.1/accounts/${accountId}/envelopes`;
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
