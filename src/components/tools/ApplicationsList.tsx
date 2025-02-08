
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function ApplicationsList() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      const q = query(collection(db, "applications"));
      const querySnapshot = await getDocs(q);
      const apps = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setApplications(apps);
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
