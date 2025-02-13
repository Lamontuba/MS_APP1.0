
"use client";
import React, { useState, useEffect } from 'react';
import SignatureCanvas from '../SignatureCanvas';
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, updateDoc } from "firebase/firestore";
import { createAndSendEnvelope } from '@/lib/docusign';

const FastApp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Record<string, string>>({
    businessName: "",
    dbaName: "",
    businessAddress: "",
    businessType: "",
    taxId: "",
    businessPhone: "",
    businessEmail: "",
    ownerName: "",
    ownerTitle: "",
    ownerPhone: "",
    ownerEmail: "",
    ownerSSN: "",
    ownershipPercentage: "",
    monthlyVolume: "",
    averageTicket: "",
    maxTicket: "",
    businessCategory: "",
    processingMethods: "",
    bankName: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "",
    signature: "",
    signatureDate: new Date().toISOString().split('T')[0],
    ipAddress: "",
    location: "",
    
    // Owner Information
    ownerName: "",
    ownerTitle: "",
    ownerPhone: "",
    ownerEmail: "",
    ownerSSN: "",
    ownershipPercentage: "",
    
    // Processing Information
    monthlyVolume: "",
    averageTicket: "",
    maxTicket: "",
    businessCategory: "",
    processingMethods: [],
    
    // Bank Information
    bankName: "",
    routingNumber: "",
    accountNumber: "",
    accountType: "",
    
    // Signature Information
    signature: "",
    signatureDate: new Date().toISOString().split('T')[0],
    ipAddress: "",
    location: "",
    additionalSigners: []
  });

  // Get IP and location on component mount
  useEffect(() => {
    const getIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setFormData(prev => ({...prev, ipAddress: data.ip}));
      } catch (error) {
        console.error('Error fetching IP:', error);
      }
    };
    getIpAddress();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value || ''
    }));
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User must be authenticated");
      }

      // Save to Firestore including signatures
      // Save to Firebase
      const docRef = await addDoc(collection(db, "applications"), {
        ...formData,
        userId: user.uid,
        createdAt: new Date(),
        status: "pending",
        signature: formData.signature,
        signatureDate: formData.signatureDate
      });

      // Create DocuSign envelope from template
      try {
        // Create elastic template first
        const elasticTemplateData = {
          name: `Merchant Application - ${formData.businessName}`,
          documents: [{
            documentBase64: Buffer.from(generateDocumentHtml(formData)).toString('base64'),
            documentName: 'Merchant Application.html',
            fileExtension: 'html',
            order: 1,
            display: 'document'
          }],
          displaySettings: {
            displayType: 'modal',
            consentButtonType: 'button_checkbox',
            hasDeclineButton: false,
            downloadEnabled: true,
            emailEnabled: true
          }
        };

        const elasticResponse = await fetch('/api/docusign/create-elastic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(elasticTemplateData)
        });

        if (!elasticResponse.ok) {
          throw new Error('Failed to create elastic template');
        }

        const { clickwrapId } = await elasticResponse.json();

        // Create agreement using the elastic template
        const agreementData = {
          clickwrapId,
          documentData: {
            businessName: formData.businessName,
            dbaName: formData.dbaName,
            businessAddress: formData.businessAddress,
            businessPhone: formData.businessPhone,
            businessEmail: formData.businessEmail,
            taxId: formData.taxId,
            ownerName: formData.ownerName,
            ownerTitle: formData.ownerTitle,
            ownerPhone: formData.ownerPhone,
            ownerEmail: formData.ownerEmail,
            monthlyVolume: formData.monthlyVolume,
            averageTicket: formData.averageTicket,
            maxTicket: formData.maxTicket,
            bankName: formData.bankName,
            routingNumber: formData.routingNumber,
            accountNumber: formData.accountNumber,
            signature: formData.signature,
            signatureDate: formData.signatureDate
          }
        };

        const response = await fetch('/api/docusign/create-envelope', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(envelopeData)
        });

        if (!response.ok) {
          throw new Error('Failed to create DocuSign envelope');
        }

        alert("Application submitted and document created successfully!");
      } catch (error) {
        console.error('DocuSign error:', error);
        alert("Application saved but document creation failed. Please contact support.");
      }
      
      // Reset form
      setFormData(prev => ({
        ...Object.keys(prev).reduce((acc, key) => ({...acc, [key]: ""}), {}),
        signatureDate: new Date().toISOString().split('T')[0]
      }));
      setStep(1);
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again.");
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Business Information</h2>
            <div>
              <label className="block text-sm font-medium text-zinc-300">Business Name</label>
              <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300">DBA Name</label>
              <input type="text" name="dbaName" value={formData.dbaName} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md" />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300">Business Address</label>
              <input type="text" name="businessAddress" value={formData.businessAddress} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md" required />
            </div>
            <div className="flex justify-end">
              <button onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md">Next</button>
            </div>
          </div>
        );
      
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
            <div>
              <label className="block text-sm font-medium text-zinc-300">Business Phone</label>
              <input type="tel" name="businessPhone" value={formData.businessPhone} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300">Business Email</label>
              <input type="email" name="businessEmail" value={formData.businessEmail} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300">Tax ID</label>
              <input type="text" name="taxId" value={formData.taxId} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md" required />
            </div>
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-md">Back</button>
              <button onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md">Next</button>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Owner Information</h2>
            <div>
              <label className="block text-sm font-medium text-zinc-300">Owner Name</label>
              <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300">Title</label>
              <input type="text" name="ownerTitle" value={formData.ownerTitle} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300">Owner Phone</label>
              <input type="tel" name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300">Owner Email</label>
              <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md" required />
            </div>
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-md">Back</button>
              <button onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md">Next</button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Processing Information</h2>
            <div>
              <label className="block text-sm font-medium text-zinc-300">Monthly Volume</label>
              <input type="text" name="monthlyVolume" value={formData.monthlyVolume} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300">Average Ticket</label>
              <input type="text" name="averageTicket" value={formData.averageTicket} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300">Max Ticket</label>
              <input type="text" name="maxTicket" value={formData.maxTicket} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md" required />
            </div>
            <div className="flex justify-between">
              <button onClick={prevStep} className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-md">Back</button>
              <button onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md">Next</button>
            </div>
          </div>
        );

      case 5:
        return (
          <form onSubmit={handleSubmit} className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Sign & Submit</h2>
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">Draw Signature</label>
              <SignatureCanvas
                onChange={(signature) => setFormData({ ...formData, signature })}
                width={400}
                height={150}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-300">Date</label>
              <input type="date" name="signatureDate" value={formData.signatureDate} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md" required />
            </div>
            <div className="flex justify-between">
              <button type="button" onClick={prevStep} className="bg-zinc-600 hover:bg-zinc-700 text-white px-4 py-2 rounded-md">Back</button>
              <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md">Submit Application</button>
            </div>
          </form>
        );

      default:
        return null;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4, 5].map((stepNumber) => (
            <div
              key={stepNumber}
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= stepNumber ? 'bg-emerald-600' : 'bg-zinc-700'
              }`}
            >
              {stepNumber}
            </div>
          ))}
        </div>
      </div>
      {renderStep()}
    </div>
  );
};

export default FastApp;
