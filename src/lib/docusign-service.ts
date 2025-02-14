import docusign from 'docusign-esign';
import { getDocuSignAccessToken, DocuSignAuthError } from './docusign-auth';

interface BaseEnvelopeData {
  signerEmail: string;
  signerName: string;
}

interface FullEnvelopeData extends BaseEnvelopeData {
  businessType: string;
  businessName: string;
  ownerName: string;
  ownerEmail: string;
  bankName: string;
  accountNumber: string;
  signature: string;
  additionalFields?: Record<string, string>;
}

type EnvelopeData = BaseEnvelopeData | FullEnvelopeData;

interface EnvelopeResponse {
  envelopeId: string;
  status: string;
  uri: string;
}

interface TextTab {
  tabLabel: string;
  value?: string;
}

interface SignHereTab {
  tabLabel: string;
  anchorString?: string;
  anchorUnits?: string;
  anchorXOffset?: string;
  anchorYOffset?: string;
}

interface EnvelopeDefinition {
  templateId: string;
  templateRoles: {
    email: string;
    name: string;
    roleName: string;
    tabs?: {
      textTabs?: TextTab[];
      signHereTabs?: SignHereTab[];
    };
  }[];
  status: string;
  emailSubject: string;
  emailBlurb: string;
}

export class DocuSignError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'DocuSignError';
  }
}

// Get the base path based on environment
const isDevelopment = process.env.NODE_ENV === 'development';
const DOCUSIGN_BASE_PATH = isDevelopment 
  ? 'https://demo.docusign.net/restapi'
  : 'https://docusign.net/restapi';

function isFullEnvelopeData(data: EnvelopeData): data is FullEnvelopeData {
  return 'businessType' in data;
}

export async function createEnvelopeFromTemplate(data: EnvelopeData): Promise<EnvelopeResponse> {
  try {
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
    const templateId = process.env.DOCUSIGN_TEMPLATE_ID;

    // Log configuration and input data
    console.log('DocuSign Configuration:', {
      hasAccountId: !!process.env.DOCUSIGN_ACCOUNT_ID,
      hasTemplateId: !!process.env.DOCUSIGN_TEMPLATE_ID,
      basePath: DOCUSIGN_BASE_PATH,
      inputData: {
        ...data,
        // Remove sensitive data from logs
        signature: data.hasOwnProperty('signature') ? '[REDACTED]' : undefined,
        accountNumber: (data as any).accountNumber ? '[REDACTED]' : undefined
      }
    });

    if (!accountId || !templateId) {
      throw new DocuSignError(
        'Missing required DocuSign configuration',
        500,
        { accountId: !!accountId, templateId: !!templateId }
      );
    }

    // Get access token
    const accessToken = await getDocuSignAccessToken();
    console.log('Successfully obtained DocuSign access token');

    // Prepare envelope definition
    const envelopeDefinition: EnvelopeDefinition = {
      templateId,
      templateRoles: [{
        email: data.signerEmail,
        name: data.signerName,
        roleName: 'signer',
        tabs: {}
      }],
      status: 'sent',
      emailSubject: 'Please sign this document',
      emailBlurb: 'Please review and sign this document at your earliest convenience.'
    };

    // If we have full envelope data, add the additional tabs
    if (isFullEnvelopeData(data)) {
      envelopeDefinition.templateRoles[0].tabs = {
        textTabs: [
          { tabLabel: 'business_type', value: data.businessType },
          { tabLabel: 'business_name', value: data.businessName },
          { tabLabel: 'owner_name', value: data.ownerName },
          { tabLabel: 'owner_email', value: data.ownerEmail },
          { tabLabel: 'bank_name', value: data.bankName },
          { tabLabel: 'account_number', value: data.accountNumber }
        ]
      };

      // Add any additional fields if present
      if (data.additionalFields) {
        Object.entries(data.additionalFields).forEach(([key, value]) => {
          envelopeDefinition.templateRoles[0].tabs?.textTabs?.push({
            tabLabel: key,
            value
          });
        });
      }
    }

    console.log('Sending envelope definition:', {
      templateId: envelopeDefinition.templateId,
      email: envelopeDefinition.templateRoles[0].email,
      name: envelopeDefinition.templateRoles[0].name,
      tabCount: envelopeDefinition.templateRoles[0].tabs?.textTabs?.length || 0
    });

    const response = await fetch(
      `${DOCUSIGN_BASE_PATH}/v2.1/accounts/${accountId}/envelopes`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(envelopeDefinition),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('DocuSign API Error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      
      throw new DocuSignError(
        'Failed to create envelope',
        response.status,
        errorText
      );
    }

    const result = await response.json();
    console.log('Envelope created successfully:', {
      envelopeId: result.envelopeId,
      status: result.status
    });

    return {
      envelopeId: result.envelopeId,
      status: result.status,
      uri: result.uri
    };
  } catch (error) {
    console.error('Error in createEnvelopeFromTemplate:', error);
    
    // Handle DocuSign authentication errors (including consent required)
    if (error instanceof DocuSignAuthError) {
      // Pass through the error with its details
      throw new DocuSignError(
        error.message,
        401,
        error.details
      );
    }
    
    if (error instanceof DocuSignError) {
      throw error;
    }
    
    throw new DocuSignError(
      'Failed to create envelope',
      500,
      error instanceof Error ? error.message : error
    );
  }
}

async function markEnvelopeComplete(
  accountId: string,
  envelopeId: string,
  accessToken: string
): Promise<void> {
  try {
    const response = await fetch(
      `${DOCUSIGN_BASE_PATH}/v2.1/accounts/${accountId}/envelopes/${envelopeId}`,
      {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'completed'
        })
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new DocuSignError(
        'Failed to complete envelope',
        response.status,
        errorData
      );
    }
  } catch (error) {
    console.error('Error marking envelope complete:', error);
    throw error;
  }
}

export async function getEnvelopeStatus(envelopeId: string): Promise<string> {
  try {
    const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

    if (!accountId) {
      throw new DocuSignError('DocuSign configuration missing', 400);
    }

    const accessToken = await getDocuSignAccessToken();
    
    const response = await fetch(
      `${DOCUSIGN_BASE_PATH}/v2.1/accounts/${accountId}/envelopes/${envelopeId}`,
      {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new DocuSignError(
        'Failed to get envelope status',
        response.status,
        errorData
      );
    }

    const data = await response.json();
    return data.status;
  } catch (error) {
    console.error('Error getting envelope status:', error);

    // Handle DocuSign authentication errors (including consent required)
    if (error instanceof DocuSignAuthError) {
      // Pass through the error with its details
      throw new DocuSignError(
        error.message,
        401,
        error.details
      );
    }

    if (error instanceof DocuSignError) {
      throw error;
    }

    throw new DocuSignError(
      'Failed to get envelope status',
      500,
      error instanceof Error ? error.message : error
    );
  }
}