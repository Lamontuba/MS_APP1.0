// src/components/tools/FastApp/Fourmcp/BusinessInfoForm.tsx
import React from 'react';
import { FormData } from '../FastApp';

export interface BusinessInfoFormProps {
  formData: FormData;
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  inputClassName: string;
}

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({
  formData,
  onChange,
  onNext,
  inputClassName,
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Business Information</h2>
      <div className="mb-4">
        <label htmlFor="businessType" className="block text-white mb-2">
          Business Type
        </label>
        <select
          id="businessType"
          name="businessType"
          value={formData.businessType}
          onChange={(e) => onChange('businessType', e.target.value)}
          className={inputClassName}
        >
          <option value="">Select business type</option>
          <option value="llc">LLC</option>
          <option value="corporation">Corporation</option>
          <option value="sole-proprietorship">Sole Proprietorship</option>
        </select>
      </div>
      <div className="mb-4">
        <label htmlFor="businessName" className="block text-white mb-2">
          Business Name
        </label>
        <input
          id="businessName"
          name="businessName"
          type="text"
          value={formData.businessName}
          onChange={(e) => onChange('businessName', e.target.value)}
          placeholder="Enter your business name"
          className={inputClassName}
        />
      </div>
    </div>
  );
};

export default BusinessInfoForm;
