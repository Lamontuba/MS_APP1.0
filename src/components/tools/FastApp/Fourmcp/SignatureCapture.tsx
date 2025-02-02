import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { FormData } from '../FastApp';


interface SignatureCaptureProps {
  formData: {
    businessName: string;
    businessType: string;
    [key: string]: string;
  };
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
  onBack: () => void;
  onNext: () => void;
}
const SignatureCapture: React.FC<SignatureCaptureProps> = ({ formData, setFormData, onBack, onNext }) => {
  const sigPad = useRef<SignatureCanvas>(null);

  const handleSaveSignature = () => {
    if (sigPad.current) {
      const signatureData = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
      setFormData(prev => ({ ...prev, signature: signatureData }));
    }
  };

  return (
    <div>
      <h2>Signature Capture</h2>
      <SignatureCanvas
        ref={sigPad}
        penColor="black"
        canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
      />
      <div>
        <button onClick={onBack}>Back</button>
        <button onClick={() => { handleSaveSignature(); onNext(); }}>
          Next
        </button>
      </div>
    </div>
  );
};

export default SignatureCapture;
