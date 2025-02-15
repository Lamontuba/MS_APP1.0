'use client';

import { useState } from 'react';

export default function DocuSignTest() {
  const [status, setStatus] = useState<{
    loading: boolean;
    error?: string;
    success?: boolean;
    signingUrl?: string;
  }>({ loading: false });

  const handleGrantConsent = async () => {
    try {
      const response = await fetch('/api/docusign/get-consent-url');
      const data = await response.json();
      
      if (data.consentUrl) {
        window.open(data.consentUrl, '_blank');
        setStatus(prev => ({
          ...prev,
          error: 'After granting consent in the new window, please try sending the envelope again.'
        }));
      } else {
        setStatus(prev => ({
          ...prev,
          error: 'Failed to get consent URL'
        }));
      }
    } catch (err) {
      setStatus(prev => ({
        ...prev,
        error: 'Failed to get consent URL'
      }));
    }
  };

  const handleTestEnvelope = async () => {
    setStatus({ loading: true });

    try {
      // Test data
      const testData = {
        signerEmail: 'test@example.com',
        signerName: 'Test User',
        formData: {
          businessName: 'Test Business',
          dbaName: 'Test DBA',
          businessAddress: '123 Test St',
          businessPhone: '555-0123',
          businessEmail: 'test@example.com',
          taxId: '12-3456789',
          ownerName: 'Test Owner',
          ownerTitle: 'CEO',
          ownerPhone: '555-0124',
          ownerEmail: 'owner@example.com',
          monthlyVolume: '50000',
          averageTicket: '100',
          maxTicket: '1000',
          bankName: 'Test Bank',
          routingNumber: '123456789',
          accountNumber: '987654321',
          signatureDate: new Date().toISOString().split('T')[0]
        }
      };

      // First, create the envelope
      const createResponse = await fetch('/api/docusign/create-envelope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const createResult = await createResponse.json();

      if (!createResponse.ok) {
        throw new Error(createResult.message || 'Failed to create envelope');
      }

      // Then, get the signing URL
      const signingResponse = await fetch('/api/docusign/get-signing-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          envelopeId: createResult.envelopeId,
          signerEmail: testData.signerEmail,
          signerName: testData.signerName,
        }),
      });

      const signingResult = await signingResponse.json();

      if (!signingResponse.ok) {
        throw new Error(signingResult.message || 'Failed to get signing URL');
      }

      setStatus({
        loading: false,
        success: true,
        signingUrl: signingResult.signingUrl
      });
    } catch (err) {
      setStatus({
        loading: false,
        error: err instanceof Error ? err.message : 'An error occurred'
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">DocuSign Test Page</h1>

      <div className="space-y-4">
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <h2 className="text-lg font-semibold text-yellow-800 mb-2">Test Instructions</h2>
          <ol className="list-decimal list-inside space-y-2 text-yellow-700">
            <li>First time? Click "Grant DocuSign Consent" below</li>
            <li>After granting consent, click "Send Test Envelope"</li>
            <li>Sign the document in the iframe that appears</li>
          </ol>
        </div>

        <div className="flex space-x-4">
          <button
            onClick={handleGrantConsent}
            className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Grant DocuSign Consent
          </button>

          <button
            onClick={handleTestEnvelope}
            disabled={status.loading}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {status.loading ? 'Sending...' : 'Send Test Envelope'}
          </button>
        </div>

        {status.error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{status.error}</p>
          </div>
        )}

        {status.success && status.signingUrl && (
          <div>
            <div className="p-4 mb-4 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">
                Test envelope created successfully! Please sign the document below:
              </p>
            </div>
            <iframe
              src={status.signingUrl}
              width="100%"
              height="800px"
              className="border-0"
            />
          </div>
        )}
      </div>
    </div>
  );
}
