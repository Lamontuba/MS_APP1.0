import docusign from 'docusign-esign';
import { EnvelopeDefinition, ApiClient, EnvelopesApi } from 'docusign-esign';

export interface DocuSignError extends Error {
  statusCode?: number;
  details?: {
    error?: string;
    consentUrl?: string;
    [key: string]: any;
  };
}

export async function sendEnvelopeForSignature(formData: any, formType: string) {
  // 1. Setup DocuSign API Client
  const apiClient = new ApiClient();
  apiClient.setBasePath('https://demo.docusign.net/restapi');
  // If you have an OAuth token or JWT approach, set it here.

  // 2. Prepare EnvelopeDefinition
  // This is just an example with minimal fields.
  const envelopeDefinition: EnvelopeDefinition = {
    emailSubject: 'Your Merchant Application',
  };
  
  // If using a template:
  //   envelopeDefinition.templateId = <TEMPLATE_ID>;
  //   envelopeDefinition.templateRoles = [
  //     {
  //       email: formData.ownerInfo.ownerEmail,
  //       name: formData.ownerInfo.ownerName,
  //       roleName: 'Signer', // Must match the role name in your template
  //     }
  //   ];
  
  // If embedding the signature image:
  //   Create a custom Document with the image placed or use an ImageTab
  //   that references the base64 signature from formData.signature

  // 3. Set Envelope Status
  //   'sent' = actually send for DocuSign signature
  //   'completed' = finalize envelope as if it was already signed
  envelopeDefinition.status = 'sent';

  // 4. Create and Send Envelope
  const envelopesApi = new EnvelopesApi(apiClient);
  const results = await envelopesApi.createEnvelope('YOUR_ACCOUNT_ID', { envelopeDefinition });
  
  console.log('Envelope created. EnvelopeId: ', results.envelopeId);
  return results;
}
