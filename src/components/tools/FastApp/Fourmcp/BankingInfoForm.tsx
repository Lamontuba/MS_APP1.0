// src/components/tools/FastApp/Fourmcp/BankingInfoForm.tsx
import React from 'react';
import { FormData } from '../FastApp';

export interface BankingInfoFormProps {
  formData: FormData;
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
  inputClassName: string;
}

const BankingInfoForm: React.FC<BankingInfoFormProps> = ({
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
      <h2 className="text-xl font-bold text-white mb-4">Banking Information</h2>
      <div className="mb-4">
        <label htmlFor="bankName" className="block text-white mb-2">
          Bank Name
        </label>
        <input
          id="bankName"
          name="bankName"
          type="text"
          value={formData.bankName}
          onChange={(e) => onChange('bankName', e.target.value)}
          placeholder="Enter your bank name"
          className={formFieldClassName}
        />
      </div>
      <div className="mb-4">
        <label htmlFor="accountNumber" className="block text-white mb-2">
          Account Number
        </label>
        <input
          id="accountNumber"
          name="accountNumber"
          type="text"
          value={formData.accountNumber}
          onChange={(e) => onChange('accountNumber', e.target.value)}
          placeholder="Enter your account number"
          className={formFieldClassName}
        />
      </div>
    </div>
  );
};

export default BankingInfoForm;
