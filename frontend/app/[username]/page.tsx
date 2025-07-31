'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import SessionCard from '../components/SessionCard';

interface Session {
  _id: string;
  title: string;
  tags: string[];
  status: 'draft' | 'published';
}

export default function UserProfilePage() {
  const params = useParams();
  const username = params.username as string;
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
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get('http://wellness-session-platform-2429.onrender.com/api/sessions/my-sessions', config);
        setSessions(response.data);
      } catch (err) {
        setError('Failed to fetch your sessions.');
      } finally {
        setLoading(false);
      }
    };
    fetchMySessions();
  }, [router]);

  if (loading) return <p className="text-center mt-8">Loading your dashboard...</p>;
  if (error) return <p className="text-center text-red-500 mt-8">{error}</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Welcome, {username}!</h1>
        <Link href="/editor" className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
          Create New Session
        </Link>
      </div>
      <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Your Sessions</h2>
      {sessions.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            
            <Link href={`/editor/${session._id}`} key={session._id}>
              <div className="relative block hover:scale-105 transition-transform duration-200">
                <SessionCard title={session.title} tags={session.tags} />
                <span className={`absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded-full ${
                    session.status === 'draft' ? 'bg-yellow-200 text-yellow-800' : 'bg-green-200 text-green-800'
                  }`}>
                  {session.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-10 px-6 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-800">No sessions yet</h3>
          <p className="text-gray-500 mt-1">Click "Create New Session" to get started.</p>
        </div>
      )}
    </div>
  );
}
