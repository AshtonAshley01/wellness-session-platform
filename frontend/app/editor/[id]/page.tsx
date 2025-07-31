'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter, useParams } from 'next/navigation';

export default function EditSessionPage() {
  const params = useParams();
  const id = params.id as string;
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [jsonFileUrl, setJsonFileUrl] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    const fetchSessionData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const response = await axios.get(`http://localhost:5000/api/sessions/my-sessions/${id}`, config);
        const { title, tags, json_file_url } = response.data;
        setTitle(title);
        setTags(tags.join(', '));
        setJsonFileUrl(json_file_url);
      } catch (err) {
        setError('Failed to load session data.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSessionData();
  }, [id, router]);

  const getAuthConfig = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return null;
    }
    return { headers: { Authorization: `Bearer ${token}` } };
  };

  const handleSubmit = async (action: 'draft' | 'publish') => {
    setIsSubmitting(true);
    setError('');

    const config = getAuthConfig();
    if (!config) return;

    const sessionData = {
      title,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      json_file_url: jsonFileUrl,
    };

    try {
      if (action === 'draft') {
        
        await axios.put(`http://localhost:5000/api/sessions/draft/${id}`, sessionData, config);
      } else if (action === 'publish') {
        
        await axios.put(`http://localhost:5000/api/sessions/draft/${id}`, sessionData, config);
        
        await axios.post('http://localhost:5000/api/sessions/publish', { id }, config);
      }
      
      router.push('/my-sessions');

    } catch (err: any) {
      setError('Failed to submit session. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <p className="text-center mt-8">Loading editor...</p>;

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">Edit Session</h1>
        <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            
            <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title
            </label>
            <input
              id="title"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div>
            <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
              Tags (comma-separated)
            </label>
            <input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="e.g., yoga, beginner, morning"
            />
          </div>
          <div>
            <label htmlFor="json_file_url" className="block text-sm font-medium text-gray-700">
              JSON File URL
            </label>
            <input
              id="json_file_url"
              type="url"
              required
              value={jsonFileUrl}
              onChange={(e) => setJsonFileUrl(e.target.value)}
              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="https://example.com/session.json"
            />
          </div>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <div className="flex items-center justify-end space-x-4 pt-4">
            <button
              type="button"
              onClick={() => handleSubmit('draft')}
              disabled={isSubmitting}
              className="px-4 py-2 font-bold text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              type="button"
              onClick={() => handleSubmit('publish')}
              disabled={isSubmitting}
              className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
