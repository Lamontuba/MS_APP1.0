// src/components/tools/FastApp/FastApp.tsx
import React, { useState } from 'react';
import BusinessInfoForm from './Fourmcp/BusinessInfoForm';
import OwnerInfoForm from './Fourmcp/OwnerInfoForm';
import BankingInfoForm from './Fourmcp/BankingInfoForm';
import SignatureCapture from './Fourmcp/SignatureCapture';

export interface FormData {
  businessName: string;
  businessType: string;
  ownerName: string;
  ownerEmail: string;
  bankName: string;
  accountNumber: string;
  [key: string]: string;
}

const FastApp: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    businessName: '',
    businessType: '',
    ownerName: '',
    ownerEmail: '',
    bankName: '',
    accountNumber: '',
  });
  const [step, setStep] = useState(1);

  // This function updates form fields.
  const onChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Tailwind CSS classes for consistent input styling.
  const inputFieldClasses =
    "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent";

  // Render the appropriate form step based on "step".
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <BusinessInfoForm
            formData={formData}
            onChange={onChange}
            onNext={() => setStep(2)}
            inputClassName={inputFieldClasses}
          />
        );
      case 2:
        return (
          <OwnerInfoForm
            formData={formData}
            onChange={onChange}
            inputClassName={inputFieldClasses}
          />
        );
      case 3:
        return (
          <BankingInfoForm
            formData={formData}
            onChange={onChange}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)}
            inputClassName={inputFieldClasses}
          />
        );
      case 4:
        return (
          <SignatureCapture
            formData={formData}
            setFormData={setFormData}
            inputClassName={inputFieldClasses}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-zinc-900/50 rounded-2xl border border-zinc-800">
          {/* Header */}
          <div className="p-6 border-b border-zinc-800">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold text-white">
                Merchant Onboarding
              </h1>
              {/* Progress Steps */}
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div
                    key={stepNumber}
                    className={`w-8 h-1 rounded ${
                      stepNumber <= step ? 'bg-emerald-500' : 'bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">{renderStep()}</div>

          {/* Navigation Buttons (Global) */}
          <div className="p-6 border-t border-zinc-800 flex justify-between">
            <button
              onClick={() => setStep(step - 1)}
              disabled={step === 1}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                step === 1
                  ? 'text-zinc-600 cursor-not-allowed'
                  : 'text-zinc-400 hover:bg-zinc-800'
              }`}
            >
              Back
            </button>
            <button
              onClick={() => {
                if (step === 4) {
                  // Add your submission logic here.
                  console.log('Submitting form:', formData);
                } else {
                  setStep(step + 1);
                }
              }}
              className="px-4 py-2 rounded-lg bg-emerald-500 text-white hover:bg-emerald-600"
            >
              {step === 4 ? 'Submit' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FastApp;
