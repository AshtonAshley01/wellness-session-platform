'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import vector0 from "./vector-0.svg";

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password,
      });

      localStorage.setItem('token', response.data.token);
      
      const username = response.data.username;
      // Redirect to the user's personalized page after successful login
      router.push(`/${username}`);

    } catch (err: any) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // <div className="flex justify-center items-center mt-10">
    //   <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
    //     <h1 className="text-2xl font-bold text-center">Sign in to your account</h1>
    //     <form onSubmit={handleSubmit} className="space-y-6">
    //       <div>
    //         <label
    //           htmlFor="email"
    //           className="block text-sm font-medium text-gray-700"
    //         >
    //           Email address
    //         </label>
    //         <input
    //           id="email"
    //           name="email"
    //           type="email"
    //           autoComplete="email"
    //           required
    //           value={email}
    //           onChange={(e) => setEmail(e.target.value)}
    //           className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    //         />
    //       </div>
    //       <div>
    //         <label
    //           htmlFor="password"
    //           className="block text-sm font-medium text-gray-700"
    //         >
    //           Password
    //         </label>
    //         <input
    //           id="password"
    //           name="password"
    //           type="password"
    //           autoComplete="current-password"
    //           required
    //           value={password}
    //           onChange={(e) => setPassword(e.target.value)}
    //           className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    //         />
    //       </div>
    //       {error && <p className="text-red-500 text-sm text-center">{error}</p>}
    //       <div>
    //         <button
    //           type="submit"
    //           className="w-full px-4 py-2 font-bold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
    //         >
    //           Sign in
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>




    // src/app/login/page.tsx
    // <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
    //   <div className="w-full max-w-sm bg-white rounded-xl shadow p-8">
    //     <h1 className="text-2xl font-bold text-center mb-6 text-gray-900">
    //       Welcome back
    //     </h1>

    //     <form onSubmit={handleSubmit} className="space-y-4">
    //       <input
    //         id="email"
    //         type="email"
    //         placeholder="Email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //       />

    //       <input
    //         id="password"
    //         type="password"
    //         placeholder="Password"
    //         value={password}
    //         onChange={(e) => setPassword(e.target.value)}
    //         className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    //       />

    //       <div className="text-right">
    //         <a href="#" className="text-sm text-blue-600 hover:underline">
    //           Forgot password?
    //         </a>
    //       </div>

    //       {error && (
    //         <p className="text-red-500 text-sm text-center">{error}</p>
    //       )}

    //       <button
    //         type="submit"
    //         disabled={isLoading}
    //         className="w-full py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-blue-300"
    //       >
    //         {isLoading ? 'Signing in...' : 'Log in'}
    //       </button>
    //     </form>

    //     <p className="mt-6 text-center text-sm text-gray-600">
    //       Don&apos;t have an account?{' '}
    //       <Link href="/register" className="text-blue-600 hover:underline font-medium">
    //         Sign up
    //       </Link>
    //     </p>
    //   </div>
    // </div>


    <div className='bg-white'>

    </div>
  );
}
