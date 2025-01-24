// src/lib/lead_ts.ts

import { doc, updateDoc } from "firebase/firestore"; // Firestore functions for document updates
import { db } from "./firebase"; // Firestore instance
import { Lead } from "../models/lead"; // Importing the Lead interface

// Function to edit an existing lead in Firestore
export const editLead = async (id: string, updatedLead: Partial<Lead>): Promise<void> => {
  try {
    // Reference to the specific document in the "leads" collection
    const leadRef = doc(db, "leads", id);

    // Update the document with the new data
    await updateDoc(leadRef, updatedLead);

    console.log("Lead updated successfully!");
  } catch (error) {
    console.error("Error updating lead: ", error);
    throw new Error("Failed to update lead");
  }
};
