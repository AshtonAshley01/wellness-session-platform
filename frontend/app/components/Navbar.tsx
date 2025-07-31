'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState<string | null>(null); // State to hold the username
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username'); // Get username from storage
    setIsLoggedIn(!!token);
    setUsername(storedUsername);
  }, [pathname]); // Re-run the check when the path changes

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username'); // Remove username on logout
    setIsLoggedIn(false);
    setUsername(null);
    router.push('/login');
  };

  return (
    <nav className="bg-white text-gray-800 p-4 shadow-md mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M12 2a5 5 0 0 0-5 5c0 1.66 1.34 3 3 3s3-1.34 3-3a5 5 0 0 0-5-5zM20.94 14.06a9 9 0 0 0-17.88 0"/><path d="M3.5 21.5a2.5 2.5 0 0 1 0-5c1.66 0 3-1.34 3-3s-1.34-3-3-3a2.5 2.5 0 0 1 0-5"/><path d="M20.5 21.5a2.5 2.5 0 0 0 0-5c-1.66 0-3-1.34-3-3s1.34-3 3-3a2.5 2.5 0 0 0 0-5"/></svg>
            Wellness App
        </Link>
        <div className="space-x-6 flex items-center">
          <Link href="/" className="hover:text-blue-600 transition-colors">
            Dashboard
          </Link>
          {isLoggedIn && username ? (
            <>
              {/* This link now points to the user's personal dashboard */}
              <Link href={`/${username}`} className="hover:text-blue-600 transition-colors">
                My Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link href="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold transition">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;