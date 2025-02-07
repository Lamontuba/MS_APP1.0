"use client";
import React, { useState } from 'react';
import { db, auth } from "@/lib/firebase";
import { collection, addDoc, updateDoc } from "firebase/firestore";
import { createAndSendEnvelope } from '@/lib/docusign';

const FastApp = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessName: "",
    dbaName: "",
    businessAddress: "",
    businessPhone: "",
    businessEmail: "",
    taxId: "",
    ownerName: "",
    ownerTitle: "",
    ownerPhone: "",
    ownerEmail: "",
    ownerSSN: "",
    dateOfBirth: "",
    monthlyVolume: "",
    averageTicket: "",
    maxTicket: "",
    bankName: "",
    routingNumber: "",
    accountNumber: "",
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

      if (envelope) {
        await updateDoc(docRef, {
          envelopeId: envelope.envelopeId,
          status: "sent_for_signature"
        });
      }
      alert("Application submitted successfully!");
      setFormData({...formData}); // Reset form
    } catch (error) {
      console.error("Error submitting application:", error);
      alert("Error submitting application. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-300">Business Name</label>
        <input type="text" name="businessName" value={formData.businessName} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">DBA Name</label>
        <input type="text" name="dbaName" value={formData.dbaName} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Business Address</label>
        <input type="text" name="businessAddress" value={formData.businessAddress} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Business Phone</label>
        <input type="tel" name="businessPhone" value={formData.businessPhone} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Business Email</label>
        <input type="email" name="businessEmail" value={formData.businessEmail} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Tax ID</label>
        <input type="text" name="taxId" value={formData.taxId} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Owner Name</label>
        <input type="text" name="ownerName" value={formData.ownerName} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Title</label>
        <input type="text" name="ownerTitle" value={formData.ownerTitle} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Phone</label>
        <input type="tel" name="ownerPhone" value={formData.ownerPhone} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Email</label>
        <input type="email" name="ownerEmail" value={formData.ownerEmail} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">SSN</label>
        <input type="text" name="ownerSSN" value={formData.ownerSSN} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Date of Birth</label>
        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Monthly Volume</label>
        <input type="text" name="monthlyVolume" value={formData.monthlyVolume} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Average Ticket</label>
        <input type="text" name="averageTicket" value={formData.averageTicket} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Max Ticket</label>
        <input type="text" name="maxTicket" value={formData.maxTicket} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Bank Name</label>
        <input type="text" name="bankName" value={formData.bankName} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Routing Number</label>
        <input type="text" name="routingNumber" value={formData.routingNumber} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Account Number</label>
        <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Signature</label>
        <input type="text" name="signature" value={formData.signature} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required placeholder="Type your full name to sign" />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-300">Date</label>
        <input type="date" name="signatureDate" value={formData.signatureDate} onChange={handleChange} className="mt-1 block w-full p-2 bg-zinc-800/50 border border-zinc-700 rounded-md text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-zinc-600 hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] transition-all duration-200 hover:bg-zinc-800/70" required />
      </div>
      <button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md transition duration-200">Submit Application</button>
    </form>
  );
};

export default FastApp;