// src/components/tools/FastApp/FastApp.tsx
"use client";
import React, { useState } from 'react';
import BusinessInfoForm from './Fourmcp/BusinessInfoForm';
import OwnerInfoForm from './Fourmcp/OwnerInfoForm';
import BankingInfoForm from './Fourmcp/BankingInfoForm';
import SignatureCapture from './Fourmcp/SignatureCapture';

export interface FormData {
  businessType: string;
  businessName: string;
  ownerName: string;
  ownerEmail: string;
  bankName: string;
  accountNumber: string;
  signature?: string;
}

const FastApp = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    businessType: '',
    businessName: '',
    ownerName: '',
    ownerEmail: '',
    bankName: '',
    accountNumber: '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const steps = [
    { title: 'Business Information', component: BusinessInfoForm },
    { title: 'Owner Information', component: OwnerInfoForm },
    { title: 'Banking Information', component: BankingInfoForm },
    { title: 'Sign & Submit', component: SignatureCapture },
  ];

  const inputClassName = `
    w-full
    px-4
    py-3
    rounded-lg
    transition-all
    duration-200
    ease-in-out
    focus:ring-2
    focus:ring-emerald-500
    focus:outline-none
  `;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-950">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {steps.map((step, index) => (
              <div key={step.title} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    index <= currentStep ? 'bg-emerald-600' : 'bg-zinc-700'
                  } text-white font-semibold`}
                >
                  {index + 1}
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 w-24 sm:w-32 md:w-48 mx-2 ${
                      index < currentStep ? 'bg-emerald-600' : 'bg-zinc-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-zinc-400">
            {steps.map((step, index) => (
              <span
                key={step.title}
                className={`${
                  index <= currentStep ? 'text-emerald-500' : ''
                }`}
              >
                {step.title}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-800">
          <div className="p-8">
            <CurrentStepComponent
              formData={formData}
              onChange={handleChange}
              onNext={handleNext}
              onBack={handleBack}
              inputClassName={inputClassName}
              setFormData={setFormData}
            />

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 gap-4">
              <button
                onClick={handleBack}
                className={`px-6 py-3 rounded-lg text-white transition-all duration-200
                  ${currentStep === 0
                    ? 'opacity-50 cursor-not-allowed bg-zinc-700'
                    : 'bg-zinc-700 hover:bg-zinc-600'
                  }`}
                disabled={currentStep === 0}
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className={`px-6 py-3 rounded-lg text-white transition-all duration-200
                  ${currentStep === steps.length - 1
                    ? 'bg-emerald-600 hover:bg-emerald-500'
                    : 'bg-emerald-600 hover:bg-emerald-500'
                  }`}
              >
                {currentStep === steps.length - 1 ? 'Submit' : 'Next'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #18181b;
        }

        ::-webkit-scrollbar-thumb {
          background: #3f3f46;
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #52525b;
        }

        /* Firefox */
        * {
          scrollbar-width: thin;
          scrollbar-color: #3f3f46 #18181b;
        }
      `}</style>
    </div>
  );
};

export default FastApp;
