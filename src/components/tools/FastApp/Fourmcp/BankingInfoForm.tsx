import React from 'react';

interface BankingInfoFormProps {
  formData: {
    // Define the fields for banking info
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const BankingInfoForm: React.FC<BankingInfoFormProps> = ({ formData, handleChange }) => {
  return (
    <div>
      {/* Your banking info form logic */}
    </div>
  );
};

export default BankingInfoForm;