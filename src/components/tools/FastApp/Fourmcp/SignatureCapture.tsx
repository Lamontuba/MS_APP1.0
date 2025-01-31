// SignatureCapture.tsx
import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';

interface SignatureCaptureProps {
  formData: {
    businessName: string;
    businessType: string;
    ownerName: string;
    ownerEmail: string;
    // Add other fields as needed...
  };
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const SignatureCapture: React.FC<SignatureCaptureProps> = ({ formData, setFormData }) => {
  const sigPad = useRef<SignatureCanvas>(null);

  const handleSaveSignature = () => {
    if (sigPad.current) {
      const signatureData = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
      // For example, store the signature image in formData under 'signature'
      setFormData((prev: any) => ({
        ...prev,
        signature: signatureData
      }));
    }
  };

  const handleClearSignature = () => {
    if (sigPad.current) {
      sigPad.current.clear();
    }
  };

  return (
    <div>
      <h2>Signature Capture</h2>
      <SignatureCanvas
        ref={sigPad}
        penColor="black"
        canvasProps={{ className: 'sigCanvas', width: 500, height: 200 }}
      />
      <div>
        <button onClick={handleClearSignature}>Clear</button>
        <button onClick={handleSaveSignature}>Save Signature</button>
      </div>
    </div>
  );
};

export default SignatureCapture;
