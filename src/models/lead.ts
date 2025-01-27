
// Replace with your own data structure  
  export type Lead = {
    id: string;
    clientName: string;
    value: number;
    status: 'active' | 'closed' | 'pending';
    createdAt: Date;
    userId: string;
  };