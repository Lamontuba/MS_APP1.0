import { doc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";

export const deleteLead = async (id: string) => {
  try {
    const leadRef = doc(db, "leads", id);
    await deleteDoc(leadRef);
    console.log("Lead deleted successfully!");
  } catch (error) {
    console.error("Error deleting lead: ", error);
    throw new Error("Failed to delete lead");
  }
};
