import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignatureCaptureProps {
  formData: {
    businessInfo: {
      businessName: string;
      businessType: string;
    };
    ownerInfo: {
      ownerName: string;
      ownerEmail: string;
    };
  };
  setFormData: (data: any) => void;
}

const SignatureCapture: React.FC<SignatureCaptureProps> = ({ formData, setFormData }) => {
  const signatureRef = useRef<SignatureCanvas>(null);

  const handleSave = () => {
    const signature = signatureRef.current?.toDataURL();
    setFormData({ ...formData, signature });
  };

  return (
    <div>
      <h2>Signature</h2>
      <SignatureCanvas
        ref={signatureRef}
        canvasProps={{ className: 'signature-canvas' }}
      />
      <button onClick={handleSave}>Save Signature</button>
    </div>
  );
};

export default SignatureCapture;