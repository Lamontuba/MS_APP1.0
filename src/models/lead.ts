// src/models/lead.ts

// Interface defining the structure of a Lead object
export interface Lead {
    id?: string; // Optional: Firestore-generated document ID
    name: string; // The name of the business or contact
    contact: string; // Phone number of the lead
    email: string; // Email address of the lead
    status: "prospect" | "closed"; // Status of the lead, limited to two values
    createdAt?: Date; // Optional: Timestamp for when the lead was created
  }
  