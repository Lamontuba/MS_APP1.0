'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';

interface FormData {
  signerEmail: string;
  signerName: string;
}

export default function DocuSignTest() {
  const [status, setStatus] = useState<{
    loading: boolean;
    error?: string;
    success?: boolean;
  }>({ loading: false });

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

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

  const onSubmit = async (data: FormData) => {
    setStatus({ loading: true });

    try {
      const response = await fetch('/api/docusign/create-envelope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to create envelope');
      }

      setStatus({
        loading: false,
        success: true
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
      <h1 className="text-2xl font-bold mb-6">DocuSign Test Form</h1>

      <div className="mb-6">
        <p className="text-sm text-gray-600 mb-2">
          First time using this app? You'll need to grant consent to DocuSign:
        </p>
        <button
          onClick={handleGrantConsent}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Grant DocuSign Consent
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Signer Email
          </label>
          <input
            type="email"
            {...register('signerEmail', { required: 'Email is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.signerEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.signerEmail.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Signer Name
          </label>
          <input
            type="text"
            {...register('signerName', { required: 'Name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.signerName && (
            <p className="mt-1 text-sm text-red-600">{errors.signerName.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={status.loading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {status.loading ? 'Sending...' : 'Send Envelope'}
        </button>
      </form>

      {status.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{status.error}</p>
        </div>
      )}

      {status.success && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600">
            Envelope sent successfully!
          </p>
        </div>
      )}
    </div>
  );
}
