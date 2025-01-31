import React from 'react';

interface OwnerInfoFormProps {
  formData: {
    ownerName: string;
    ownerEmail: string;
    // Other fields...
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const OwnerInfoForm: React.FC<OwnerInfoFormProps> = ({ formData, handleChange }) => {
  return (
    <div>
      <label>
        Owner Name:
        <input
          type="text"
          name="ownerName"
          value={formData.ownerName}
          onChange={handleChange}
        />
      </label>
      <label>
        Owner Email:
        <input
          type="email"
          name="ownerEmail"
          value={formData.ownerEmail}
          onChange={handleChange}
        />
      </label>
      {/* Other fields... */}
    </div>
  );
};

export default OwnerInfoForm;