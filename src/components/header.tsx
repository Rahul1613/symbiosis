'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { User, LogOut, LayoutDashboard, MessageSquare, Users, Moon, Sun } from 'lucide-react';
import { useTheme } from './theme-provider';

export function Header() {
  const { data: session } = useSession();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            SocialHub
          </Link>

          <nav className="flex items-center gap-6">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
              <span className="hidden sm:inline">{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
            <Link href="/questions" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Q&A</span>
            </Link>
            <Link href="/directory" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Directory</span>
            </Link>

            {session ? (
              <>
                <Link href="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <LayoutDashboard className="w-4 h-4" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <div className="flex items-center gap-3">
                  {session.user?.avatarUrl && (
                    <img
                      src={session.user.avatarUrl}
                      alt={session.user.name || 'User'}
                      className="w-8 h-8 rounded-full"
                    />
                  )}
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  href="/login"
                  className="px-4 py-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
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
