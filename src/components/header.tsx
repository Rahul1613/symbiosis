'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, LayoutDashboard, MessageSquare, Users } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-gray-700 bg-gray-900 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white hover:text-gray-300 transition-colors">
            SocialHub
          </Link>

          <nav className="flex items-center gap-4 sm:gap-6">
            <Link href="/questions" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800">
              <MessageSquare className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Q&A</span>
            </Link>
            <Link href="/directory" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800">
              <Users className="w-5 h-5" />
              <span className="hidden sm:inline font-medium">Directory</span>
            </Link>

            {session ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors p-2 rounded-lg hover:bg-gray-800">
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="hidden sm:inline font-medium">Dashboard</span>
                </Link>
                <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                  {session.user?.avatarUrl && (
                    <img
                      src={session.user.avatarUrl}
                      alt={session.user.name || 'User'}
                      className="w-10 h-10 rounded-full border-2 border-gray-700"
                    />
                  )}
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors p-2 rounded-lg hover:bg-red-900/20"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="hidden sm:inline font-medium">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3 pl-4 border-l border-gray-700">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
