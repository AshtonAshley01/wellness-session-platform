'use client'; 

import { useState, useEffect } from 'react';
import axios from 'axios';
import SessionCard from './components/SessionCard';


interface Session {
  _id: string;
  title: string;
  tags: string[];
}

export default function DashboardPage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/sessions');
        setSessions(response.data);
      } catch (err) {
        setError('Failed to fetch sessions. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) {
    return <p className="text-center mt-8">Loading sessions...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 mt-8">{error}</p>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Published Sessions</h1>
      {sessions.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sessions.map((session) => (
            <SessionCard key={session._id} title={session.title} tags={session.tags} />
          ))}
        </div>
      ) : (
        <p>No published sessions found.</p>
      )}
    </div>
  );
}
