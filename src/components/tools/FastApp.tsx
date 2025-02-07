"use client";
import React, { useState } from "react";
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, updateDoc } from "firebase/firestore";
import { initializeDocuSignClient, createEnvelope } from './docusign'; // You'll need to create this file


// Placeholder for DocuSign integration - Replace with your actual implementation
const createAndSendEnvelope = async (formData, recipientEmail, recipientName) => {
  try {
    const docusignClient = await initializeDocuSignClient(); // Initialize the DocuSign client

    const envelope = await createEnvelope(docusignClient, formData, recipientEmail, recipientName); // Create the envelope

    return envelope;

  } catch (error) {
    console.error("Error creating DocuSign envelope:", error);
    throw error; // Re-throw the error for handling in handleSubmit
  }
};


const FastApp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Business Information
    businessName: "",
    dbaName: "",
    businessAddress: "",
    businessPhone: "",
    businessEmail: "",
    taxId: "",

    // Owner Information
    ownerName: "",
    ownerTitle: "",
    ownerPhone: "",
    ownerEmail: "",
    ownerSSN: "",
    dateOfBirth: "",

    // Processing Information
    monthlyVolume: "",
    averageTicket: "",
    maxTicket: "",

    // Bank Information
    bankName: "",
    routingNumber: "",
    accountNumber: "",

    // Signature
    signature: "",
    signatureDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error("User must be authenticated");
      }

      // Save to Firestore
      const docRef = await addDoc(collection(db, "applications"), {
        ...formData,
        userId: user.uid,
        createdAt: new Date(),
        status: "pending"
      });

      // Create and send DocuSign envelope
      const envelope = await createAndSendEnvelope(
        formData,
        formData.ownerEmail,
        formData.ownerName
      );

      // Update application with DocuSign envelope ID
      await updateDoc(docRef, {
        docusignEnvelopeId: envelope.envelopeId
      });

      alert("Application submitted and sent for signature!");
      setStep(1);
      setFormData({
        businessName: "", dbaName: "", businessAddress: "", businessPhone: "",
        businessEmail: "", taxId: "", ownerName: "", ownerTitle: "", ownerPhone: "",
        ownerEmail: "", ownerSSN: "", dateOfBirth: "", monthlyVolume: "",
        averageTicket: "", maxTicket: "", bankName: "", routingNumber: "",
        accountNumber: "", signature: "", signatureDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again.");
    }
  };

  const renderStep = () => {
    const inputClass = `
      mt-1 block w-full p-2 
      bg-zinc-800/50 border border-zinc-700 
      rounded-md text-zinc-100 
      placeholder-zinc-500 
      focus:outline-none focus:border-zinc-600 
      hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] 
      transition-all duration-200 
      hover:bg-zinc-800/70
    `;

    switch(step) {
      case 1:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Business Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300">Business Name</label>
                <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">DBA Name</label>
                <input type="text" name="dbaName" value={formData.dbaName} onChange={handleChange} className={inputClass} />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-zinc-300">Business Address</label>
                <input type="text" name="businessAddress" value={formData.businessAddress} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Business Phone</label>
                <input type="tel" name="businessPhone" value={formData.businessPhone} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Business Email</label>
                <input type="email" name="businessEmail" value={formData.businessEmail} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Tax ID</label>
                <input type="text" name="taxId" value={formData.taxId} onChange={handleChange} className={inputClass} required />
              </div>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Owner Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300">Owner Name</label>
                <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Title</label>
                <input type="text" name="ownerTitle" value={formData.ownerTitle} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Phone</label>
                <input type="tel" name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Email</label>
                <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">SSN</label>
                <input type="text" name="ownerSSN" value={formData.ownerSSN} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className={inputClass} required />
              </div>
            </div>
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Processing Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300">Monthly Volume</label>
                <input type="text" name="monthlyVolume" value={formData.monthlyVolume} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Average Ticket</label>
                <input type="text" name="averageTicket" value={formData.averageTicket} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Max Ticket</label>
                <input type="text" name="maxTicket" value={formData.maxTicket} onChange={handleChange} className={inputClass} required />
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Bank Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300">Bank Name</label>
                <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Routing Number</label>
                <input type="text" name="routingNumber" value={formData.routingNumber} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Account Number</label>
                <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className={inputClass} required />
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Review & Sign</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-zinc-300">Signature</label>
                <input type="text" name="signature" value={formData.signature} onChange={handleChange} className={inputClass} required placeholder="Type your full name to sign" />
              </div>
              <div>
                <label className="block text-sm font-medium text-zinc-300">Date</label>
                <input type="date" name="signatureDate" value={formData.signatureDate} onChange={handleChange} className={inputClass} required />
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="bg-zinc-900/50 text-white p-6 rounded-xl border border-zinc-800">
      <h2 className="text-2xl font-bold mb-6">Merchant Application</h2>
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3, 4, 5].map((s) => (
            <div
              key={s}
              className={`w-1/5 h-2 rounded-full mx-1 ${
                s <= step ? "bg-emerald-500" : "bg-zinc-700"
              }`}
            />
          ))}
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        {renderStep()}
        <div className="mt-6 flex justify-between">
          {step > 1 && (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-md transition duration-200"
            >
              Previous
            </button>
          )}
          {step < 5 ? (
            <button
              type="button"
              onClick={() => setStep(step + 1)}
              className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition duration-200"
            >
              Next
            </button>
          ) : (
            <button
              type="submit"
              className="ml-auto bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition duration-200"
            >
              Submit Application
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default FastApp;