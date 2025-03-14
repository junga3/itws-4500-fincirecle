
'use client';

import { signIn, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function NavBar() {
  const { data: session, status } = useSession();
  const isLoading = status === 'loading';

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl">
          FinCircle
        </Link>
        
        <div className="flex space-x-4">
          <Link href="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          
          {session ? (
            <>
              <Link href="/profile" className="text-gray-300 hover:text-white">
                Profile
              </Link>
              <button 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-gray-300 hover:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-gray-300 hover:text-white">
                Login
              </Link>
              <Link href="/register" className="text-gray-300 hover:text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}