'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import SessionCard from '../components/SessionCard';


interface Session {
  _id: string;
  title: string;
  tags: string[];
  status: 'draft' | 'published';
}

export default function MySessionsPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchMySessions = async () => {
      
      const token = localStorage.getItem('token');

      if (!token) {
        
        router.push('/login');
        return;
      }

      try {
        
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get('http://wellness-session-platform-2429.onrender.com/api/sessions/my-sessions', config);
        setSessions(response.data);
      } catch (err) {
        setError('Failed to fetch your sessions. You may need to log in again.');
        console.error(err);
        
      } finally {
        setLoading(false);
      }
    };

    fetchMySessions();
  }, [router]);

  if (loading) {
    return <p className="text-center mt-8">Loading your sessions...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Sessions</h1>
      {sessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <div key={session._id} className="relative">
              <SessionCard title={session.title} tags={session.tags} />
              <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${
                  session.status === 'draft' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                }`}>
                {session.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <p>You haven&apos;t created any sessions yet.</p>
      )}
    </div>
  );
}
