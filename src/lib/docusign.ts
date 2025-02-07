
import { ApiClient, EnvelopesApi } from '@docusign/esign';

export async function createAndSendEnvelope(formData: any, signerEmail: string, signerName: string) {
  const privateKey = process.env.DOCUSIGN_PRIVATE_KEY;
  const integrationKey = process.env.DOCUSIGN_INTEGRATION_KEY;
  const userId = process.env.DOCUSIGN_API_USER_ID;
  const accountId = process.env.DOCUSIGN_ACCOUNT_ID;

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
        email: signerEmail,
        name: signerName,
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

  const envelope = await envelopesApi.createEnvelope(accountId, {
    envelopeDefinition
  });

  return envelope;
}
