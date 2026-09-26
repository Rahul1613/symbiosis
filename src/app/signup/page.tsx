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