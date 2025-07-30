'use client'; // This directive is necessary for using hooks like useState and useRouter

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Correct import for App Router

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (!username || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        username,
        email,
        password,
      });

      // Store the token in localStorage
      localStorage.setItem('token', response.data.token);

      const returnedUsername = response.data.username;
      router.push(`/${returnedUsername}`);

      // Redirect to the dashboard
      router.push('/');
    } catch (err: any) {
      // Handle errors from the API
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
      console.error(err);
    }
  };

  return (
    // <div className="flex justify-center items-center mt-10">
    //   <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
    //     <h1 className="text-2xl font-bold text-center">Create an Account</h1>
    //     <form onSubmit={handleSubmit} className="space-y-6">
    //       {/* 5. Add the username input field */}
    //       <div>
    //         <label
    //           htmlFor="username"
    //           className="block text-sm font-medium text-gray-700"
    //         >
    //           Username
    //         </label>
    //         <input
    //           id="username"
    //           name="username"
    //           type="text"
    //           required
    //           value={username}
    //           onChange={(e) => setUsername(e.target.value)}
    //           className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
    //         />
    //       </div>
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
    //           Register
    //         </button>
    //       </div>
    //     </form>
    //   </div>
    // </div>



    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-center mb-2">Create your account</h1>
        </div>
        <form className="space-y-4">
          <input
            type="text"
            placeholder="Username"
            className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-200 rounded-md bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-md font-semibold hover:bg-blue-700 transition"
          >
            Sign up
          </button>
        </form>
        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">
            Already have an account?{' '}
            <a href="/login" className="text-blue-600 hover:underline">
              Log in
            </a>
          </span>
        </div>
      </div>
    </div>
  );
}
