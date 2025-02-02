// src/components/tools/FastApp/FastApp.tsx
import React, { useState } from 'react';
import BusinessInfoForm from './Fourmcp/BusinessInfoForm';
import OwnerInfoForm from './Fourmcp/OwnerInfoForm';
import BankingInfoForm from './Fourmcp/BankingInfoForm';
import SignatureCapture from './Fourmcp/SignatureCapture';
import { Dispatch, SetStateAction } from 'react';

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

  // This function is used by our form components.
  const onChange = (field: string, value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Render the appropriate step based on "step" value.
  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <BusinessInfoForm
            formData={formData}
            onChange={onChange}
            onNext={() => setStep(2)}
          />
        );
      case 2:
        return (
          <OwnerInfoForm
            formData={formData}
            onChange={onChange}
            onBack={() => setStep(1)}
            onNext={() => setStep(3)}
          />
        );
      case 3:
        return (
          <BankingInfoForm
            formData={formData}
            onChange={onChange}
            onBack={() => setStep(2)}
            onNext={() => setStep(4)} handleChange={function (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void {
              throw new Error('Function not implemented.');
            } }          />
        );
      case 4:
        return (
          <SignatureCapture
            formData={formData}
            setFormData={setFormData as Dispatch<SetStateAction<{ [key: string]: string }>>}
            onBack={() => setStep(3)}
            onNext={() => {
              // You can add form submission logic here.
              console.log('Submitting form:', formData);
            }}
            handleChange={(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
              const { name, value } = e.target;
              onChange(name, value);
            }}
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
          <div className="p-6">
            {renderStep()}
          </div>

          {/* Navigation Buttons */}
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
              onClick={() => setStep(step + 1)}
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
