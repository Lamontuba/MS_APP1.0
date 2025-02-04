"use client";
import React, { useState } from "react";

const FastApp = () => {
 const [formData, setFormData] = useState({
   businessName: "",
   businessType: "",
   email: "",
   phone: "",
   address: "",
 });
 const [submitted, setSubmitted] = useState(false);

 const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
   const { name, value } = e.target;
   setFormData({ ...formData, [name]: value });
 };

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault();
   console.log("Form submitted:", formData);
   setSubmitted(true);
   setFormData({ businessName: "", businessType: "", email: "", phone: "", address: "" });
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

 const selectClasses = `
   ${inputClasses}
   appearance-none
   bg-zinc-800
   text-zinc-100
 `;

 return (
   <div className="bg-zinc-900/50 text-white p-6 rounded-xl border border-zinc-800">
     <h2 className="text-2xl font-bold mb-4">Merchant Onboarding</h2>
     {!submitted ? (
       <form onSubmit={handleSubmit}>
         <div className="mb-4">
           <label htmlFor="businessName" className="block text-sm font-medium text-zinc-300">
             Business Name
           </label>
           <input
             type="text"
             id="businessName"
             name="businessName"
             value={formData.businessName}
             onChange={handleChange}
             required
             className={inputClasses}
           />
         </div>

         <div className="mb-4">
           <label htmlFor="businessType" className="block text-sm font-medium text-zinc-300">
             Business Type
           </label>
           <select
             id="businessType"
             name="businessType"
             value={formData.businessType}
             onChange={handleChange}
             required
             className={selectClasses}
           >
             <option value="" className="bg-zinc-800 text-zinc-100">Select a business type</option>
             <option value="retail" className="bg-zinc-800 text-zinc-100">Retail</option>
             <option value="restaurant" className="bg-zinc-800 text-zinc-100">Restaurant</option>
             <option value="service" className="bg-zinc-800 text-zinc-100">Service</option>
             <option value="ecommerce" className="bg-zinc-800 text-zinc-100">E-commerce</option>
             <option value="other" className="bg-zinc-800 text-zinc-100">Other</option>
           </select>
         </div>

         <div className="mb-4">
           <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
             Email
           </label>
           <input
             type="email"
             id="email"
             name="email"
             value={formData.email}
             onChange={handleChange}
             required
             className={inputClasses}
           />
         </div>

         <div className="mb-4">
           <label htmlFor="phone" className="block text-sm font-medium text-zinc-300">
             Phone
           </label>
           <input
             type="tel"
             id="phone"
             name="phone"
             value={formData.phone}
             onChange={handleChange}
             required
             className={inputClasses}
           />
         </div>

         <div className="mb-4">
           <label htmlFor="address" className="block text-sm font-medium text-zinc-300">
             Address
           </label>
           <input
             type="text"
             id="address"
             name="address"
             value={formData.address}
             onChange={handleChange}
             required
             className={inputClasses}
           />
         </div>

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