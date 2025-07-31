'use client';

import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Interface for registration form data
interface RegisterFormData {
  username: string;
  email: string;
  password: string;
}

// Interface for API response
interface RegisterResponse {
  token: string;
  username: string;
}

// Interface for API error response
interface ApiErrorResponse {
  message: string;
}

export default function RegisterPage() {
  const [username, setUsername] = useState<RegisterFormData['username']>('');
  const [email, setEmail] = useState<RegisterFormData['email']>('');
  const [password, setPassword] = useState<RegisterFormData['password']>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post<RegisterResponse>(
        'https://wellness-session-platform-2429.onrender.com/api/auth/register',
        { username, email, password }
      );

      localStorage.setItem('token', response.data.token);
      localStorage.setItem('username', response.data.username);

      router.push(`/${response.data.username}`);
    } catch (err: unknown) {
      const axiosError = err as AxiosError<ApiErrorResponse>;

      if (axiosError.response?.data?.message) {
        setError(axiosError.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 sm:p-10">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Create an Account</h1>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            id="username"
            type="text"
            placeholder="Username"
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            id="email"
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
          <input
            id="password"
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />

          {error && <p className="text-red-500 text-sm text-center pt-2">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
          >
            {isLoading ? 'Creating Account...' : 'Sign up'}
          </button>
        </form>
        <div className="mt-8 text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{' '}
            <Link href="/login" className="text-blue-600 hover:underline font-medium">
              Log in
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
