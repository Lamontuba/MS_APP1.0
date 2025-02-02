import React from 'react';

interface BankingInfoFormProps {
  formData: {
    businessName: string;
    businessType: string;
    [key: string]: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onChange: (field: string, value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

const BankingInfoForm: React.FC<BankingInfoFormProps> = ({ formData, onChange, onNext, onBack }) => {
  return (
    <div>
      <h2>Banking Information</h2>
      <div>
        <label htmlFor="bankName">Bank Name</label>
        <input
          id="bankName"
          name="bankName"
          type="text"
          value={formData.bankName}
          onChange={(e) => onChange('bankName', e.target.value)}
          placeholder="Enter your bank name"
        />
      </div>
      <div>
        <label htmlFor="accountNumber">Account Number</label>
        <input
          id="accountNumber"
          name="accountNumber"
          type="text"
          value={formData.accountNumber}
          onChange={(e) => onChange('accountNumber', e.target.value)}
          placeholder="Enter your account number"
        />
      </div>
      <div>
        <label htmlFor="routingNumber">Routing Number</label>
        <input
          id="routingNumber"
          name="routingNumber"
          type="text"
          value={formData.routingNumber}
          onChange={(e) => onChange('routingNumber', e.target.value)}
          placeholder="Enter your routing number"
        />
      </div>
      <div>
        <button onClick={onBack}>Back</button>
        <button onClick={onNext}>Next</button>
      </div>
    </div>
  );
};

export default BankingInfoForm;
