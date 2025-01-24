"use client";

import { useState } from "react";

export default function LeadsPage() {
  const [leads, setLeads] = useState<{ id: number; name: string }[]>([]);

  const deleteLead = async (id: number) => {
    // Simulate API call to delete lead
    console.log(`Deleting lead with id ${id}`);
  };
 

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      <h1>Lead Management</h1>
      <p>Here you can manage your leads!</p>
      <button onClick={() => alert("Leads feature coming soon!")}>
        Fetch Leads
      </button>
      {leads.map((lead) => (
        <div key={lead.id}>
          <span>{lead.name}</span>
          <button
            onClick={async () => {
              if (confirm("Are you sure you want to delete this lead?")) {
                await deleteLead(lead.id);
                setLeads(leads.filter((l) => l.id !== lead.id)); // Update the UI
              }
            }}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
