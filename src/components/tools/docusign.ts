
import { ApiClient, EnvelopesApi } from 'docusign-esign';

export async function initializeDocuSignClient() {
  const privateKey = process.env.DOCUSIGN_PRIVATE_KEY;
  const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
  const userId = process.env.DOCUSIGN_API_USER_ID;

  const apiClient = new ApiClient();
  apiClient.setOAuthBasePath('account-d.docusign.com');

  const jwtToken = await apiClient.requestJWTUserToken(
    integrationKey,
    userId,
    'signature',
    privateKey,
    3600
  );

  apiClient.addDefaultHeader('Authorization', `Bearer ${jwtToken.body.access_token}`);
  return apiClient;
}

export async function createEnvelope(apiClient: ApiClient, formData: any, recipientEmail: string, recipientName: string) {
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID;
  const envelopesApi = new EnvelopesApi(apiClient);
  
  const envelopeDefinition = {
    emailSubject: 'Please sign this merchant application',
    documents: [{
      documentBase64: Buffer.from(JSON.stringify(formData)).toString('base64'),
      name: 'Merchant Application',
      fileExtension: 'json',
      documentId: '1'
    }],
    recipients: {
      signers: [{
        email: recipientEmail,
        name: recipientName,
        recipientId: '1',
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

  return await envelopesApi.createEnvelope(accountId, { envelopeDefinition });
}
