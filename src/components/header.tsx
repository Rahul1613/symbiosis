'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, LayoutDashboard, MessageSquare, Users } from 'lucide-react';

export function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-gray-800 bg-gray-900/95 backdrop-blur-md sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl sm:text-2xl font-extrabold text-white hover:text-blue-400 transition-colors tracking-tight">
            SocialHub
          </Link>

          <nav className="flex items-center gap-1.5 sm:gap-4">
            <Link href="/questions" className="flex items-center gap-1.5 sm:gap-2 text-gray-300 hover:text-white transition-colors px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-800 text-xs sm:text-sm">
              <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline sm:inline font-medium">Q&amp;A</span>
            </Link>
            <Link href="/directory" className="flex items-center gap-1.5 sm:gap-2 text-gray-300 hover:text-white transition-colors px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-800 text-xs sm:text-sm">
              <Users className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xs:inline sm:inline font-medium">Directory</span>
            </Link>

            {session ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-1.5 sm:gap-2 text-gray-300 hover:text-white transition-colors px-2 py-1.5 sm:px-3 sm:py-2 rounded-lg hover:bg-gray-800 text-xs sm:text-sm">
                  <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="hidden sm:inline font-medium">Dashboard</span>
                </Link>
                <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-gray-800">
                  {session.user?.avatarUrl && (
                    <img
                      src={session.user.avatarUrl}
                      alt={session.user.name || 'User'}
                      className="w-7 h-7 sm:w-9 sm:h-9 rounded-full border border-gray-700 object-cover"
                    />
                  )}
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-1.5 text-gray-400 hover:text-red-400 transition-colors p-1.5 rounded-lg hover:bg-red-900/20 text-xs sm:text-sm"
                    title="Logout"
                  >
                    <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span className="hidden sm:inline font-medium">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-3 pl-2 sm:pl-3 border-l border-gray-800">
                <Link
                  href="/login"
                  className="px-2.5 py-1.5 sm:px-4 sm:py-2 text-gray-300 hover:text-white text-xs sm:text-sm font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-3 py-1.5 sm:px-4 sm:py-2 bg-[var(--primary)] text-white text-xs sm:text-sm rounded-lg hover:opacity-90 transition font-medium"
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
