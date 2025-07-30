'use client';

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function CreateSessionPage() {
  const [sessionId, setSessionId] = useState<string | null>(null); // To store the ID of the draft
  const [title, setTitle] = useState('');
  const [tags, setTags] = useState('');
  const [jsonFileUrl, setJsonFileUrl] = useState('');
  const [error, setError] = useState('');
  const [status, setStatus] = useState(''); // For user feedback (e.g., "Saving...", "Draft saved")
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const getAuthConfig = useCallback(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return null;
    }
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }, [router]);

  // Debounced auto-save logic
  useEffect(() => {
    // Don't auto-save if the form is empty
    if (!title && !tags && !jsonFileUrl) {
      return;
    }

    setStatus('Typing...');
    const handler = setTimeout(() => {
      setStatus('Saving...');
      handleSaveDraft();
    }, 5000); // 5-second delay

    // Cleanup function to reset the timer if the user types again
    return () => {
      clearTimeout(handler);
    };
  }, [title, tags, jsonFileUrl]); // Rerun effect if these dependencies change


  const handleSaveDraft = async () => {
    const config = getAuthConfig();
    if (!config) return;

    const sessionData = {
      title: title || 'Untitled Session', // Provide a default title if empty
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      json_file_url: jsonFileUrl,
    };

    try {
      // If we already have a sessionId, it means we are updating an existing draft
      // Note: For this, your backend would need a PUT/PATCH route like /api/sessions/draft/:id
      // For simplicity here, we'll just keep creating new drafts as per the POST route.
      // A more advanced implementation would handle updates.
      const response = await axios.post('http://localhost:5000/api/sessions/save-draft', sessionData, config);
      
      if (!sessionId) {
        setSessionId(response.data._id); // Save the new ID for future updates
      }
      setStatus('Draft saved!');
    } catch (err) {
      setStatus('Failed to save draft.');
      console.error(err);
    }
  };


  const handlePublish = async () => {
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
        // First, save the latest version as a draft to get an ID
        const draftResponse = await axios.post('http://localhost:5000/api/sessions/save-draft', sessionData, config);
        const newSessionId = draftResponse.data._id;

        // Then, publish it
        await axios.post('http://localhost:5000/api/sessions/publish', { id: newSessionId }, config);
      
        router.push('/my-sessions');
    } catch (err: any) {
      setError('Failed to publish session. Please ensure all fields are filled correctly.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <div className="w-full max-w-2xl p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-center">Session Editor</h1>
            <span className="text-sm text-gray-500">{status}</span>
        </div>
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

          <div className="flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={handlePublish}
              disabled={isSubmitting || !title || !jsonFileUrl}
              className="px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
