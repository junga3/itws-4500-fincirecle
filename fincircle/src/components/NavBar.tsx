// src/components/NavBar.tsx
import Link from 'next/link';
import { auth } from '@/auth';
import SignOut from './SignOut';

export default async function NavBar() {
  const session = await auth();

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-white font-bold text-xl">
          FinCircle
        </Link>
        
        <div className="flex space-x-4">
          {session ? (
            <>
              <Link href="/dashboard" className="text-gray-300 hover:text-white">
                Dashboard
              </Link>
              <Link href="/card" className="text-gray-300 hover:text-white">
                Cards
              </Link>
              <SignOut />
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