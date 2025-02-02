// src/components/tools/FastApp/Fourmcp/OwnerInfoForm.tsx
import React from 'react';
import { FormData } from '../FastApp';

export interface OwnerInfoFormProps {
  formData: FormData;
  onChange: (field: string, value: string) => void;
  inputClassName: string;
}

const OwnerInfoForm: React.FC<OwnerInfoFormProps> = ({
  formData,
  onChange,
  inputClassName,
}) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Owner Information</h2>
      <div className="mb-4">
        <label htmlFor="ownerName" className="block text-white mb-2">
          Owner Name
        </label>
        <input
          id="ownerName"
          name="ownerName"
          type="text"
          value={formData.ownerName}
          onChange={(e) => onChange('ownerName', e.target.value)}
          placeholder="Enter owner name"
          className={inputClassName}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="ownerEmail" className="block text-white mb-2">
          Owner Email
        </label>
        <input
          id="ownerEmail"
          name="ownerEmail"
          type="email"
          value={formData.ownerEmail}
          onChange={(e) => onChange('ownerEmail', e.target.value)}
          placeholder="Enter owner email"
          className={inputClassName}
        />
      </div>
      {/* Navigation buttons have been removed from this component */}
    </div>
  );
};

export default OwnerInfoForm;
