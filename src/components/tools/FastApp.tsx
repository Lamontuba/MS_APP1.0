"use client";
import React, { useState } from "react";

const FastApp = () => {
 const [formData, setFormData] = useState({
   businessName: "",
   email: "",
   phone: "",
   address: "",
 });
 const [submitted, setSubmitted] = useState(false);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
   const { name, value } = e.target;
   setFormData({ ...formData, [name]: value });
 };

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault();
   console.log("Form submitted:", formData);
   setSubmitted(true);
   setFormData({ businessName: "", email: "", phone: "", address: "" });
 };

 const inputClasses = `
   mt-1 block w-full p-2 
   bg-zinc-800/50 border border-zinc-700 
   rounded-md text-zinc-100 
   placeholder-zinc-500 
   focus:outline-none focus:border-zinc-600 
   hover:shadow-[0_0_10px_rgba(212,175,55,0.1)] 
   transition-all duration-200 
   hover:bg-zinc-800/70 
   [&:autofill]:!bg-zinc-800/70 
   [&:autofill]:!text-zinc-100
   [&:-webkit-autofill]:!bg-zinc-800/70 
   [&:-webkit-autofill]:!text-zinc-100
   [&:-webkit-autofill:hover]:!bg-zinc-800/70
   [&:-webkit-autofill:focus]:!bg-zinc-800/70
 `;

 return (
   <div className="bg-zinc-900/50 text-white p-6 rounded-xl border border-zinc-800">
     <h2 className="text-2xl font-bold mb-4">Merchant Onboarding</h2>
     {!submitted ? (
       <form onSubmit={handleSubmit}>
         {[
           { id: "businessName", label: "Business Name", type: "text" },
           { id: "email", label: "Email", type: "email" },
           { id: "phone", label: "Phone", type: "tel" },
           { id: "address", label: "Address", type: "text" }
         ].map(field => (
           <div key={field.id} className="mb-4">
             <label htmlFor={field.id} className="block text-sm font-medium text-zinc-300">
               {field.label}
             </label>
             <input
               type={field.type}
               id={field.id}
               name={field.id}
               value={formData[field.id as keyof typeof formData]}
               onChange={handleChange}
               required
               className={inputClasses}
             />
           </div>
         ))}
         <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-md transition duration-200">
           Submit
         </button>
       </form>
     ) : (
       <div className="text-center">
         <h3 className="text-lg font-semibold">Thank you for onboarding!</h3>
         <p className="text-sm text-zinc-400">We have received your details.</p>
         <button onClick={() => setSubmitted(false)} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white p-2 rounded-md transition duration-200">
           Onboard Another Merchant
         </button>
       </div>
     )}
   </div>
 );
};

export default FastApp;