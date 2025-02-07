
import { ApiClient, EnvelopesApi, RecipientViewRequest } from 'docusign-esign';

const BASE_PATH = 'https://demo.docusign.net/restapi';

export async function initializeDocuSignClient() {
  const privateKey = process.env.DOCUSIGN_PRIVATE_KEY;
  const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
  const userId = process.env.DOCUSIGN_USER_ID;

  const apiClient = new ApiClient({
    basePath: BASE_PATH,
    authentication: {
      oAuth: {
        privateKey,
        integrationKey,
        userId,
        oAuthBasePath: 'account-d.docusign.com'
      }
    }
  });

  try {
    const token = await apiClient.requestJWTUserToken(
      integrationKey,
      userId,
      'signature',
      privateKey,
      3600
    );
    
    apiClient.addDefaultHeader('Authorization', `Bearer ${token.body.access_token}`);
    return apiClient;
  } catch (error) {
    console.error('Error getting JWT token:', error);
    throw error;
  }
}

export async function createEnvelope(apiClient: any, formData: any, recipientEmail: string, recipientName: string) {
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
        routingOrder: '1',
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

  try {
    return await envelopesApi.createEnvelope(accountId, { envelopeDefinition });
  } catch (error) {
    console.error('Error creating envelope:', error);
    throw error;
  }
}
