'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FormData } from '@/lib/docusign-service';

export default function FastApp() {
  const [status, setStatus] = useState<{
    loading: boolean;
    error?: string;
    success?: boolean;
    message?: string;
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
        body: JSON.stringify({
          formData: data
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        if (error.error === 'auth_required') {
          setStatus({
            loading: false,
            error: 'DocuSign authentication required. Please click "Grant DocuSign Consent" and try again.'
          });
          return;
        }
        throw new Error(error.message || 'Failed to send envelope');
      }

      setStatus({
        loading: false,
        success: true,
        message: 'Application sent successfully! An administrator will review your application.'
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
          type="button"
          onClick={handleGrantConsent}
          className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
        >
          Grant DocuSign Consent
        </button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Business Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Business Information</h2>
          
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
        </div>

        {/* Owner Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Owner Information</h2>
          
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
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            disabled={status.loading}
            className={`w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
              status.loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {status.loading ? 'Submitting...' : 'Submit Application'}
          </button>
        </div>

        {status.error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{status.error}</p>
          </div>
        )}

        {status.success && status.message && (
          <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-600">{status.message}</p>
          </div>
        )}
      </form>
    </div>
  );
}