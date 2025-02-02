// src/components/tools/FastApp/Fourmcp/OwnerInfoForm.tsx
import React from 'react';

export interface OwnerInfoFormProps {
  formData: {
    ownerName: string;
    ownerEmail: string;
    [key: string]: string;
  };
  onChange: (field: string, value: string) => void;
  onBack: () => void;
  onNext: () => void;
}

const OwnerInfoForm: React.FC<OwnerInfoFormProps> = ({ formData, onChange, onBack, onNext }) => {
  return (
    <div>
      <h2>Owner Information</h2>
      <div>
        <label htmlFor="ownerName">Owner Name</label>
        <input
          id="ownerName"
          name="ownerName"
          type="text"
          value={formData.ownerName}
          onChange={(e) => onChange('ownerName', e.target.value)}
          placeholder="Enter owner name"
        />
      </div>
      <div>
        <label htmlFor="ownerEmail">Owner Email</label>
        <input
          id="ownerEmail"
          name="ownerEmail"
          type="email"
          value={formData.ownerEmail}
          onChange={(e) => onChange('ownerEmail', e.target.value)}
          placeholder="Enter owner email"
        />
      </div>
      <div>
        <button onClick={onBack}>Back</button>
        <button onClick={onNext}>Next</button>
      </div>
    </div>
  );
};

export default OwnerInfoForm;
