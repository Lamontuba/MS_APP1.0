import React from 'react';

interface BankingInfoFormProps {
  formData: {
    bankName: string;
    accountNumber: string;
    // ...
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const BankingInfoForm: React.FC<BankingInfoFormProps> = ({ formData, onChange }) => {
  return (
    <div>
      <h2>Banking Information</h2>
      <label htmlFor="bankName">Bank Name</label>
      <input
        type="text"
        id="bankName"
        name="bankName"
        value={formData.bankName}
        onChange={onChange}
      />

      <label htmlFor="accountNumber">Account Number</label>
      <input
        type="text"
        id="accountNumber"
        name="accountNumber"
        value={formData.accountNumber}
        onChange={onChange}
      />
      {/* Additional fields as needed */}
    </div>
  );
};

export default BankingInfoForm;
