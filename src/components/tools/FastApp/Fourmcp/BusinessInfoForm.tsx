import React from 'react';

interface BusinessInfoFormProps {
  formData: {
    businessName: string;
    businessType: string;
    // Other fields...
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const BusinessInfoForm: React.FC<BusinessInfoFormProps> = ({ formData, handleChange }) => {
  return (
    <div>
      <label>
        Business Name:
        <input
          type="text"
          name="businessName"
          value={formData.businessName}
          onChange={handleChange}
        />
      </label>
      <label>
        Business Type:
        <input
          type="text"
          name="businessType"
          value={formData.businessType}
          onChange={handleChange}
        />
      </label>
      {/* Other fields... */}
    </div>
  );
};

export default BusinessInfoForm;