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
  const formFieldClassName = `
    ${inputClassName}
    bg-zinc-800 
    text-zinc-100
    border-zinc-700
    focus:border-zinc-600
    hover:border-zinc-600
    placeholder:text-zinc-500
  `;

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
          className={formFieldClassName}
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
          className={formFieldClassName}
        />
      </div>
      {/* Navigation buttons have been removed from this component */}
    </div>
  );
};

export default OwnerInfoForm;
