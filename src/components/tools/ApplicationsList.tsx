
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function ApplicationsList() {
  interface Application {
    id: string;
    businessName: string;
    status: string;
    createdAt: any;
  }

  const [applications, setApplications] = useState<Application[]>([]);

  useEffect(() => {
    const fetchApplications = async () => {
      if (db) {
        const q = query(collection(db, "applications"));
        const querySnapshot = await getDocs(q);
        const apps = querySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            businessName: data.businessName,
            status: data.status,
            createdAt: data.createdAt
          };
        });
        setApplications(apps);
      } else {
        console.error("Firestore database is not initialized");
      }
    };

    fetchApplications();
  }, []);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-4">Submitted Applications</h2>
      <div className="space-y-4">
        {applications.map((app: any) => (
          <div key={app.id} className="p-4 bg-zinc-800/50 rounded-lg">
            <p><strong>Business Name:</strong> {app.businessName}</p>
            <p><strong>Status:</strong> {app.status}</p>
            <p><strong>Submitted:</strong> {app.createdAt?.toDate().toLocaleDateString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
