'use client';

import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { FormData } from '@/lib/docusign-service';

// Dynamically import the signature pad to avoid SSR issues
const SignaturePad = dynamic(() => import('react-signature-pad-wrapper'), {
  ssr: false,
});

export default function FastApp() {
  const [status, setStatus] = useState<{
    loading: boolean;
    error?: string;
    success?: boolean;
    message?: string;
  }>({ loading: false });

  const signaturePadRef = useRef<any>(null);
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>();

  const clearSignature = () => {
    if (signaturePadRef.current) {
      signaturePadRef.current.clear();
      setValue('signature', '');
    }
  };

  const onSubmit = async (data: FormData) => {
    setStatus({ loading: true });

    try {
      // Get signature data
      if (signaturePadRef.current && !signaturePadRef.current.isEmpty()) {
        const signatureData = signaturePadRef.current.toDataURL('image/png');
        data.signature = signatureData;
      } else {
        throw new Error('Signature is required');
      }

      // Set signature date
      data.signatureDate = new Date().toISOString().split('T')[0];

      // Send the envelope to admin
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        {/* Processing Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Processing Information</h2>
          
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
        </div>

        {/* Bank Information */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Bank Information</h2>
          
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
        </div>

        {/* Signature Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Signature</h2>
          
          <div className="border rounded-md p-4">
            <div className="border border-gray-300 rounded-md bg-white" style={{ height: '200px' }}>
              <SignaturePad
                ref={signaturePadRef}
                options={{
                  backgroundColor: 'rgb(255, 255, 255)',
                  penColor: 'rgb(0, 0, 0)'
                }}
              />
            </div>
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={clearSignature}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900"
              >
                Clear Signature
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
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