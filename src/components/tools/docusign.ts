// src/components/tools/docusign.ts
import { createAndSendEnvelope } from '@/lib/docusign';

export const initializeDocuSignClient = async (formData: any, recipientEmail: string, recipientName: string) => {
  try {
    const envelope = await createAndSendEnvelope(formData, recipientEmail, recipientName);
    return envelope;
  } catch (error) {
    console.error('DocuSign initialization error:', error);
    throw error;
  }
};