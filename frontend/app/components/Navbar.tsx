'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Check for token on component mount and whenever the path changes
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []); // Re-run this effect if the user navigates

  const handleLogout = () => {
    // Remove the token from storage
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    // Redirect to the login page
    router.push('/login');
  };

  return (
    <nav className="bg-gray-100 text-gray-950 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
      <div className="flex items-center space-x-2">
      <Image 
            src="/logo.svg" 
            alt="Logo" 
            width={32} 
            height={32}
            className="h-8 w-8"
          />
        <Link href="/" className="text-xl font-bold">
          Wellness Sessions
        </Link>
      </div>
        <div className="space-x-4 flex items-center">
          <Link href="/" className="hover:text-gray-300">
            Dashboard
          </Link>
          {isLoggedIn ? (
            <>
              <Link href="/my-sessions" className="hover:text-gray-300">
                My Sessions
              </Link>
              <Link href="/editor" className="hover:text-gray-300">
                Create Session
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-indigo-600 hover:bg-indigo-700 px-3 py-1 rounded">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
