import React, { useState } from 'react';
import FormRenderer from './FormRenderer';
import StandardApplicationSchema from './schemas/standard-application-schema.json';

import SignatureCapture from './Fourmcp/SignatureCapture';

// Optional: If you have a stub or actual implementation, you can import it.
// import { sendEnvelopeForSignature } from '../../lib/docusign';

// Define a type for your form data so TypeScript knows what fields exist
interface MerchantFormData {
  businessName: string;
  businessType: string;
  ownerName: string;
  ownerEmail: string;
  signature?: string; // We can store the captured signature here if you like
}

const FastApp: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const [selectedFormType, setSelectedFormType] = useState<'standard' | 'simplified'>('standard');

  // Initialize the shape of your form data with some defaults
  const [formData, setFormData] = useState<MerchantFormData>({
    businessName: '',
    businessType: '',
    ownerName: '',
    ownerEmail: ''
  });

  const getFormSchema = () => {
    switch (selectedFormType) {
      case 'standard':
        return StandardApplicationSchema;
      // If simplified eventually has a different schema, you can return it here
      default:
        return StandardApplicationSchema;
    }
  };

  const handleNext = () => {
    // If this is the last step, we could do something with formData.
    // Since we’re not implementing DocuSign right now, we’ll just reset or proceed.
    if (step === Object.keys(getFormSchema().properties).length) {
      // Commenting out the call to DocuSign to avoid errors
      /*
      sendEnvelopeForSignature(formData, selectedFormType)
        .then(() => {
          setStep(1);
          setFormData({
            businessName: '',
            businessType: '',
            ownerName: '',
            ownerEmail: ''
          });
        })
        .catch((error: unknown) => {
          console.error('Error submitting form:', error);
        });
      */
      // For now, just reset the form and step:
      setStep(1);
      setFormData({
        businessName: '',
        businessType: '',
        ownerName: '',
        ownerEmail: ''
      });
    } else {
      setStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const renderStep = () => {
    const formSchema = getFormSchema();
    const totalSteps = Object.keys(formSchema.properties).length;

    switch (step) {
      // On the final step, render the signature capture
      case totalSteps:
        return <SignatureCapture formData={formData} setFormData={setFormData} />;
      // Otherwise, render the current form section
      default: {
        // currentSection is based on your JSON schema property order
        const currentSection = Object.entries(formSchema.properties)[step - 1][1];
        return (
          <FormRenderer
            schema={currentSection}
            formData={formData}
            onChange={setFormData}
          />
        );
      }
    }
  };

  return (
    <div>
      <h1>Merchant Onboarding</h1>
      <div>
        <label htmlFor="formType">Select Form Type:</label>
        <select
          id="formType"
          value={selectedFormType}
          onChange={(e) => setSelectedFormType(e.target.value as 'standard' | 'simplified')}
        >
          <option value="standard">Standard Application</option>
          <option value="simplified">Simplified Application</option>
        </select>
      </div>

      <div>{renderStep()}</div>

      <div>
        <button onClick={handleBack} disabled={step === 1}>
          Back
        </button>
        <button onClick={handleNext}>
          {step === Object.keys(getFormSchema().properties).length ? 'Submit' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default FastApp;
