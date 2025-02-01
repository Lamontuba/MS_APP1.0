// File: FastApp.tsx
import React, { useState } from 'react';
import FormRenderer from './FormRenderer';
import standardSchema from './schemas/standard-application-schema.json';

const FastApp: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [stepIndex, setStepIndex] = useState(0);

  const steps = standardSchema.steps || [];
  const totalSteps = steps.length;

  if (totalSteps === 0) {
    return <div>No steps found in the schema!</div>;
  }

  const currentStep = steps[stepIndex];
  const partialSchema = {
    type: 'object',
    title: currentStep.title,
    properties: currentStep.properties,
    required: currentStep.required,
  };

  const handleFormDataChange = (updatedData: Record<string, any>) => {
    setFormData(updatedData);
  };

  const handleNext = () => {
    const isLastStep = stepIndex === totalSteps - 1;
    if (isLastStep) {
      console.log('Form data submitted:', formData);
      alert('Form submitted (see console for data)');
    } else {
      setStepIndex(stepIndex + 1);
    }
  };

  const handleBack = () => {
    if (stepIndex > 0) {
      setStepIndex(stepIndex - 1);
    }
  };

  // *** TAILWIND UI IMPROVEMENT HERE ***
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      {/* Card container */}
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-lg w-full">
        {/* Title and step indicator */}
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          {standardSchema.title || 'Multi-Step Application'}
        </h1>
        <p className="text-gray-600 mb-6">
          Step {stepIndex + 1} of {totalSteps}
        </p>

        {/* The dynamic form fields */}
        <FormRenderer
          schema={partialSchema}
          formData={formData}
          onChange={handleFormDataChange}
        />

        {/* Navigation Buttons */}
        <div className="mt-6 flex justify-between">
          <button
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleBack}
            disabled={stepIndex === 0}
          >
            Back
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleNext}
          >
            {stepIndex === totalSteps - 1 ? 'Submit' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FastApp;
