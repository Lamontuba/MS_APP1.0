import React, { useState } from 'react';

const FastApp: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: '',
    businessType: '',
    ownerName: '',
    ownerEmail: '',
    // Other fields...
  });

  const handleNext = () => {
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1); 
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

    const renderStep = (): React.ReactNode => {
        switch (step) {
            case 1:
                return (
                    <div>
                        <h2>Step 1: Business Information</h2>
                        <input
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            placeholder="Business Name"
                        />
                        <input
                            type="text"
                            name="businessType"
                            value={formData.businessType}
                            onChange={handleChange}
                            placeholder="Business Type"
                        />
                    </div>
                );
            case 2:
                return (
                    <div>
                        <h2>Step 2: Owner Information</h2>
                        <input
                            type="text"
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleChange}
                            placeholder="Owner Name"
                        />
                        <input
                            type="email"
                            name="ownerEmail"
                            value={formData.ownerEmail}
                            onChange={handleChange}
                            placeholder="Owner Email"
                        />
                    </div>
                );
            case 3:
                return (
                    <div>
                        <h2>Step 3: Additional Information</h2>
                        {/* Add additional fields as needed */}
                    </div>
                );
            case 4:
                return (
                    <div>
                        <h2>Step 4: Review & Submit</h2>
                        <pre>{JSON.stringify(formData, null, 2)}</pre>
                        <button onClick={() => alert('Form submitted!')}>Submit</button>
                    </div>
                );
            default:
                return null;
        }
    };

  return (
    <div>
      <h1>Merchant Onboarding</h1>
      {renderStep()}
      <div>
        <button onClick={handleBack} disabled={step === 1}>
          Back
        </button>
        <button onClick={handleNext} disabled={step === 4}>
          Next
        </button>
      </div>
    </div>
  );
};

export default FastApp;