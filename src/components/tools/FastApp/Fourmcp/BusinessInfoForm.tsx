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
  const formFieldClassName = `
    ${inputClassName}
    bg-zinc-800 
    text-zinc-100
    border-zinc-700
    focus:border-zinc-600
    hover:border-zinc-600
    placeholder:text-zinc-500
  `;

  const selectClassName = `
    ${formFieldClassName}
    [&>option]:bg-zinc-800 
    [&>option]:text-zinc-100
  `;

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
          className={selectClassName}
        >
          <option value="" className="bg-zinc-800 text-zinc-100">Select business type</option>
          <option value="llc" className="bg-zinc-800 text-zinc-100">LLC</option>
          <option value="corporation" className="bg-zinc-800 text-zinc-100">Corporation</option>
          <option value="sole-proprietorship" className="bg-zinc-800 text-zinc-100">Sole Proprietorship</option>
          <option value="partnership" className="bg-zinc-800 text-zinc-100">Partnership</option>
          <option value="non-profit" className="bg-zinc-800 text-zinc-100">Non-Profit</option>
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
          className={formFieldClassName}
        />
      </div>
    </div>
  );
};

export default BusinessInfoForm;
