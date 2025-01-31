import React, { useState } from 'react';
import BusinessInfoForm from './Fourmcp/BusinessInfoForm';
import OwnerInfoForm from './Fourmcp/OwnerInfoForm'; 
import BankingInfoForm from './Fourmcp/BankingInfoForm';
import SignatureCapture from './Fourmcp/SignatureCapture';

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

  const renderStep = () => {
    switch (step) {
      case 1:
        return <BusinessInfoForm formData={formData} handleChange={handleChange} />;
      case 2:
        return <OwnerInfoForm formData={formData} handleChange={handleChange} />;  
      case 3:
        return <BankingInfoForm formData={formData} handleChange={handleChange} />;
      case 4:
        return <SignatureCapture formData={formData} setFormData={setFormData} />;
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