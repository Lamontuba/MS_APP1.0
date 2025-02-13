import React, { useState } from 'react';
import { FilePlus, Check } from 'lucide-react';

export default function FastApp() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    businessAddress: '',
    businessPhone: '',
    businessEmail: '',
    ownerName: '',
    ownerTitle: '',
    ownerPhone: '',
    ownerEmail: '',
    bankName: '',
    accountType: '',
    routingNumber: '',
    accountNumber: ''
  });

  const steps = [
    { id: 1, title: 'Business Information' },
    { id: 2, title: 'Owner Information' },
    { id: 3, title: 'Bank Information' },
    { id: 4, title: 'Review & Sign' }
  ];

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length));
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/docusign/create-elastic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to create template');

      // Handle success
      setCurrentStep(4);
    } catch (error) {
      console.error('Error creating elastic template:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                currentStep >= step.id ? 'bg-blue-600' : 'bg-gray-300'
              }`}>
                {currentStep > step.id ? (
                  <Check className="w-5 h-5 text-white" />
                ) : (
                  <span className="text-white">{step.id}</span>
                )}
              </div>
              <span className="mt-2 text-sm">{step.title}</span>
            </div>
          ))}
        </div>
        <div className="relative mt-2">
          <div className="absolute top-1/2 h-1 w-full bg-gray-200 -z-10" />
          <div
            className="absolute top-1/2 h-1 bg-blue-600 transition-all -z-10"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      {/* Form Steps */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Business Information</h3>
            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              value={formData.businessName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-zinc-800 text-white"
            />
            <input
              type="text"
              name="businessAddress"
              placeholder="Business Address"
              value={formData.businessAddress}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-zinc-800 text-white"
            />
            <input
              type="tel"
              name="businessPhone"
              placeholder="Business Phone"
              value={formData.businessPhone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-zinc-800 text-white"
            />
            <input
              type="email"
              name="businessEmail"
              placeholder="Business Email"
              value={formData.businessEmail}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-zinc-800 text-white"
            />
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Owner Information</h3>
            <input
              type="text"
              name="ownerName"
              placeholder="Owner Name"
              value={formData.ownerName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-zinc-800 text-white"
            />
            <input
              type="text"
              name="ownerTitle"
              placeholder="Owner Title"
              value={formData.ownerTitle}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-zinc-800 text-white"
            />
            <input
              type="tel"
              name="ownerPhone"
              placeholder="Owner Phone"
              value={formData.ownerPhone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-zinc-800 text-white"
            />
            <input
              type="email"
              name="ownerEmail"
              placeholder="Owner Email"
              value={formData.ownerEmail}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-zinc-800 text-white"
            />
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Bank Information</h3>
            <input
              type="text"
              name="bankName"
              placeholder="Bank Name"
              value={formData.bankName}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-zinc-800 text-white"
            />
            <input
              type="text"
              name="accountType"
              placeholder="Account Type"
              value={formData.accountType}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-zinc-800 text-white"
            />
            <input
              type="text"
              name="routingNumber"
              placeholder="Routing Number"
              value={formData.routingNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-zinc-800 text-white"
            />
            <input
              type="text"
              name="accountNumber"
              placeholder="Account Number"
              value={formData.accountNumber}
              onChange={handleInputChange}
              className="w-full p-2 border rounded bg-zinc-800 text-white"
            />
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">Review & Sign</h3>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium">Business Information</h4>
              <p>Business Name: {formData.businessName}</p>
              <p>Business Address: {formData.businessAddress}</p>
              <p>Business Phone: {formData.businessPhone}</p>
              <p>Business Email: {formData.businessEmail}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium">Owner Information</h4>
              <p>Owner Name: {formData.ownerName}</p>
              <p>Owner Title: {formData.ownerTitle}</p>
              <p>Owner Phone: {formData.ownerPhone}</p>
              <p>Owner Email: {formData.ownerEmail}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded">
              <h4 className="font-medium">Bank Information</h4>
              <p>Bank Name: {formData.bankName}</p>
              <p>Account Type: {formData.accountType}</p>
              <p>Routing Number: {formData.routingNumber}</p>
              <p>Account Number: {formData.accountNumber}</p>
            </div>
          </div>
        )}

        <div className="flex justify-between pt-4">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handleBack}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
            >
              Back
            </button>
          )}
          {currentStep < steps.length ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 ml-auto"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 ml-auto"
            >
              Submit Application
            </button>
          )}
        </div>
      </form>
    </div>
  );
}