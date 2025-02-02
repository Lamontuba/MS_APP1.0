// src/components/tools/FastApp/Fourmcp/SignatureCapture.tsx
import React, { useRef } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import { FormData } from '../FastApp';

export interface SignatureCaptureProps {
  formData: FormData;
  setFormData: React.Dispatch<React.SetStateAction<FormData>>;
  inputClassName: string;
}

const SignatureCapture: React.FC<SignatureCaptureProps> = ({
  formData,
  setFormData,
  inputClassName,
}) => {
  const sigPad = useRef<SignatureCanvas>(null);

  const handleSaveSignature = () => {
    if (sigPad.current) {
      const signatureData = sigPad.current.getTrimmedCanvas().toDataURL('image/png');
      setFormData((prev) => ({ ...prev, signature: signatureData }));
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold text-white mb-4">Signature Capture</h2>
      <SignatureCanvas
        ref={sigPad}
        penColor="black"
        canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
      />
      <button
        onClick={handleSaveSignature}
        className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded"
      >
        Save Signature
      </button>
    </div>
  );
};

export default SignatureCapture;
