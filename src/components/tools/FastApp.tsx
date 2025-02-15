'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormData } from '@/lib/docusign-service';

export default function FastApp() {
  const [status, setStatus] = useState<{
    loading: boolean;
    error?: string;
    success?: boolean;
    signingUrl?: string;
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
      // First, create the envelope
      const createResponse = await fetch('/api/docusign/create-envelope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          signerEmail: data.businessEmail,
          signerName: data.businessName,
          formData: {
            businessName: data.businessName,
            dbaName: data.dbaName,
            businessAddress: data.businessAddress,
            businessPhone: data.businessPhone,
            businessEmail: data.businessEmail,
            taxId: data.taxId,
            ownerName: data.ownerName,
            ownerTitle: data.ownerTitle,
            ownerPhone: data.ownerPhone,
            ownerEmail: data.ownerEmail,
            monthlyVolume: data.monthlyVolume,
            averageTicket: data.averageTicket,
            maxTicket: data.maxTicket,
            bankName: data.bankName,
            routingNumber: data.routingNumber,
            accountNumber: data.accountNumber,
            signature: data.signature,
            signatureDate: new Date().toISOString().split('T')[0]
          }
        }),
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
          signerEmail: data.businessEmail,
          signerName: data.businessName,
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
      <h1 className="text-2xl font-bold mb-6">Merchant Application</h1>

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
        {/* Business Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Name
          </label>
          <input
            type="text"
            {...register('businessName', { required: 'Business name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.businessName && (
            <p className="mt-1 text-sm text-red-600">{errors.businessName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            DBA Name
          </label>
          <input
            type="text"
            {...register('dbaName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Address
          </label>
          <input
            type="text"
            {...register('businessAddress', { required: 'Business address is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.businessAddress && (
            <p className="mt-1 text-sm text-red-600">{errors.businessAddress.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Tax ID
          </label>
          <input
            type="text"
            {...register('taxId')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Phone
          </label>
          <input
            type="tel"
            {...register('businessPhone', { required: 'Business phone is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.businessPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.businessPhone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Business Email
          </label>
          <input
            type="email"
            {...register('businessEmail', { required: 'Business email is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.businessEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.businessEmail.message}</p>
          )}
        </div>

        {/* Owner Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Owner Name
          </label>
          <input
            type="text"
            {...register('ownerName', { required: 'Owner name is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.ownerName && (
            <p className="mt-1 text-sm text-red-600">{errors.ownerName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Owner Title
          </label>
          <input
            type="text"
            {...register('ownerTitle', { required: 'Owner title is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.ownerTitle && (
            <p className="mt-1 text-sm text-red-600">{errors.ownerTitle.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Owner Phone
          </label>
          <input
            type="tel"
            {...register('ownerPhone', { required: 'Owner phone is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.ownerPhone && (
            <p className="mt-1 text-sm text-red-600">{errors.ownerPhone.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Owner Email
          </label>
          <input
            type="email"
            {...register('ownerEmail', { required: 'Owner email is required' })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
          {errors.ownerEmail && (
            <p className="mt-1 text-sm text-red-600">{errors.ownerEmail.message}</p>
          )}
        </div>

        {/* Processing Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Monthly Volume
          </label>
          <input
            type="text"
            {...register('monthlyVolume')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Average Ticket
          </label>
          <input
            type="text"
            {...register('averageTicket')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Max Ticket
          </label>
          <input
            type="text"
            {...register('maxTicket')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        {/* Bank Information */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Bank Name
          </label>
          <input
            type="text"
            {...register('bankName')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Routing Number
          </label>
          <input
            type="text"
            {...register('routingNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Account Number
          </label>
          <input
            type="text"
            {...register('accountNumber')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={status.loading}
          className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
        >
          {status.loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>

      {status.error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{status.error}</p>
        </div>
      )}

      {status.success && status.signingUrl && (
        <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-600 mb-4">
            Application submitted successfully! Please sign the document below:
          </p>
          <iframe
            src={status.signingUrl}
            width="100%"
            height="800px"
            className="border-0"
          />
        </div>
      )}
    </div>
  );
}