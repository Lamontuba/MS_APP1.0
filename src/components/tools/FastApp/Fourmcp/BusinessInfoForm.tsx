// src/components/tools/FastApp/Fourmcp/BusinessInfoForm.tsx
import React from 'react';
import { FormData } from '../FastApp'; // Adjust the path if necessary

// Update the interface to include the onChange property
export interface BusinessInfoFormProps {
  formData: FormData;
  onChange: (field: string, value: string) => void;
  onNext: () => void;
}

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({ formData, onChange, onNext }) => {
  return (
    <div>
      <h2>Business Information</h2>
      <div>
        <label htmlFor="businessType">Business Type</label>
        <select
          id="businessType"
          name="businessType"
          value={formData.businessType}
          onChange={(e) => onChange('businessType', e.target.value)}
        >
          <option value="">Select business type</option>
          <option value="llc">LLC</option>
          <option value="corporation">Corporation</option>
          <option value="sole-proprietorship">Sole Proprietorship</option>
        </select>
      </div>
      <div>
        <label htmlFor="businessName">Business Name</label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          value={formData.businessName}
          onChange={(e) => onChange('businessName', e.target.value)}
          placeholder="Enter your business name"
        />
      </div>
      <button onClick={onNext}>Next</button>
    </div>
  );
};

export default BusinessInfoForm;
