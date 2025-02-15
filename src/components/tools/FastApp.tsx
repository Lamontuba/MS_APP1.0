'use client';

import { useState, useRef, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FormData } from '@/lib/docusign-service';
import dynamic from 'next/dynamic';

const SignaturePad = dynamic(() => import('react-signature-pad-wrapper'), {
  ssr: false
});

export default function FastApp() {
  const [status, setStatus] = useState<{
    loading: boolean;
    error?: string;
    success?: boolean;
    message?: string;
  }>({ loading: false });

  const signaturePad1Ref = useRef<any>(null);
  const signaturePad2Ref = useRef<any>(null);
  const { register, handleSubmit, formState: { errors }, setValue } = useForm<FormData>();

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
    if (!signaturePad1Ref.current || signaturePad1Ref.current.isEmpty()) {
      setStatus({
        loading: false,
        error: 'Please provide your first signature'
      });
      return;
    }

    if (!signaturePad2Ref.current || signaturePad2Ref.current.isEmpty()) {
      setStatus({
        loading: false,
        error: 'Please provide your second signature'
      });
      return;
    }

    setStatus({ loading: true });

    try {
      // Add signatures and date to form data
      const formData = {
        ...data,
        signature1: signaturePad1Ref.current.toDataURL(),
        signature2: signaturePad2Ref.current.toDataURL(),
        date: new Date().toLocaleDateString('en-US')
      };

      console.log('Submitting form data:', {
        ...formData,
        signature1: '[SIGNATURE_1_DATA]',
        signature2: '[SIGNATURE_2_DATA]'
      });

      const response = await fetch('/api/docusign/create-envelope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formData
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        if (responseData.error === 'auth_required') {
          setStatus({
            loading: false,
            error: 'DocuSign authentication required. Please click "Grant DocuSign Consent" and try again.'
          });
          return;
        }
        throw new Error(responseData.message || 'Failed to send envelope');
      }

      setStatus({
        loading: false,
        success: true,
        message: 'Application sent successfully! An administrator will review your application.'
      });

      // Clear signature pads
      signaturePad1Ref.current?.clear();
      signaturePad2Ref.current?.clear();
    } catch (err) {
      console.error('Error submitting form:', err);
      setStatus({
        loading: false,
        error: err instanceof Error ? err.message : 'Failed to send envelope'
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Fast Application</h2>

      <p className="text-gray-700 mb-6">
        This document is provided as a sample template for testing DocuSign integration.
        Please complete the following fields:
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email:
            </label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Phone:
            </label>
            <input
              type="tel"
              {...register('phone', { required: 'Phone is required' })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signature 1:
            </label>
            <div className="border rounded-md p-2 bg-white">
              <SignaturePad
                ref={signaturePad1Ref}
                options={{
                  backgroundColor: 'rgb(255, 255, 255)'
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => signaturePad1Ref.current?.clear()}
              className="mt-2 text-sm text-blue-600 hover:text-blue-500"
            >
              Clear Signature
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Signature 2:
            </label>
            <div className="border rounded-md p-2 bg-white">
              <SignaturePad
                ref={signaturePad2Ref}
                options={{
                  backgroundColor: 'rgb(255, 255, 255)'
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => signaturePad2Ref.current?.clear()}
              className="mt-2 text-sm text-blue-600 hover:text-blue-500"
            >
              Clear Signature
            </button>
          </div>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={status.loading}
            className={`px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
              status.loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {status.loading ? 'Sending...' : 'Submit Application'}
          </button>

          <button
            type="button"
            onClick={handleGrantConsent}
            className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Grant DocuSign Consent
          </button>
        </div>

        {status.error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {status.error}
          </div>
        )}

        {status.success && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {status.message}
          </div>
        )}
      </form>
    </div>
  );
}