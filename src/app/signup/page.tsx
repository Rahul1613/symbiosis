'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';

const inputClass =
  'w-full px-4 py-3 rounded-lg border border-[var(--border)] bg-[var(--secondary)] text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition';

export default function SignupPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', username: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success('Account created successfully!');
        const result = await signIn('credentials', {
          email: formData.email,
          password: formData.password,
          redirect: false,
        });
        router.push(result?.ok ? '/dashboard' : '/login');
      } else {
        toast.error(data.error || 'Signup failed');
      }
    } catch {
      toast.error('An error occurred during signup');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch {
      toast.error('Google sign-in failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-[var(--card)] rounded-2xl border border-[var(--border)] shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-2 text-[var(--foreground)]">Create Account</h1>
          <p className="text-center text-[var(--muted-foreground)] mb-8">Join SocialHub and connect with others</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                Full Name
              </label>
              <input id="name" type="text" required value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={inputClass} placeholder="John Doe" />
            </div>

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                Username
              </label>
              <input id="username" type="text" required value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className={inputClass} placeholder="johndoe" />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                Email
              </label>
              <input id="email" type="email" required value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={inputClass} placeholder="john@example.com" />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">
                Password
              </label>
              <input id="password" type="password" required value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className={inputClass} placeholder="••••••••" />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[var(--primary)] text-white py-3 rounded-lg font-medium hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[var(--border)]" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-[var(--card)] text-[var(--muted-foreground)]">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleSignIn}
              className="mt-6 w-full flex items-center justify-center gap-3 px-4 py-3 border border-[var(--border)] rounded-lg hover:bg-[var(--secondary)] transition text-[var(--foreground)]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              <span className="font-medium">Google</span>
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-[var(--muted-foreground)]">
            Already have an account?{' '}
            <Link href="/login" className="text-[var(--primary)] hover:underline font-medium">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}