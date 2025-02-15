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
  signature?: string;
  signatureDate?: string;
}

export async function createEnvelopeFromTemplate(data: {
  signerEmail: string;
  signerName: string;
  formData?: FormData;
}): Promise<any> {
  try {
    const accessToken = await getDocuSignAccessToken();
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
    const templateId = process.env.DOCUSIGN_TEMPLATE_ID;

    if (!accountId || !templateId) {
      throw new Error('Missing DocuSign configuration');
    }

    const envelope = {
      templateId,
      status: 'sent',
      templateRoles: [{
        email: data.signerEmail,
        name: data.signerName,
        roleName: 'signer',
        tabs: {
          textTabs: data.formData ? Object.entries(data.formData).map(([key, value]) => ({
            tabLabel: key,
            value: value?.toString() || ''
          })) : undefined
        }
      }]
    };

    const response = await fetch(`https://demo.docusign.net/restapi/v2.1/accounts/${accountId}/envelopes`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(envelope)
    });

    if (!response.ok) {
      const error = await response.json();
      const docuSignError = new Error(error.message || 'Failed to create envelope') as DocuSignError;
      docuSignError.statusCode = response.status;
      docuSignError.details = error;
      throw docuSignError;
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating envelope:', error);
    throw error;
  }
}

export async function createEmbeddedSigningUrl(envelopeId: string, signerEmail: string, signerName: string, returnUrl: string): Promise<string> {
  try {
    const accessToken = await getDocuSignAccessToken();
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

    if (!accountId) {
      throw new Error('Missing DocuSign configuration');
    }

    const viewRequest = {
      authenticationMethod: 'none',
      email: signerEmail,
      userName: signerName,
      returnUrl,
      clientUserId: '1000', // Required for embedded signing
    };

    const response = await fetch(
      `https://demo.docusign.net/restapi/v2.1/accounts/${accountId}/envelopes/${envelopeId}/views/recipient`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(viewRequest)
      }
    );

    if (!response.ok) {
      const error = await response.json();
      const docuSignError = new Error(error.message || 'Failed to create signing URL') as DocuSignError;
      docuSignError.statusCode = response.status;
      docuSignError.details = error;
      throw docuSignError;
    }

    const result = await response.json();
    return result.url;
  } catch (error) {
    console.error('Error creating signing URL:', error);
    throw error;
  }
}
