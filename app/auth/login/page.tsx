'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Sparkles, Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginUser, user } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // If already logged in, redirect to account
  if (user) {
    router.push('/account');
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await loginUser(email, password);
      if (res.success) {
        router.push('/account');
      } else {
        setError(res.error || 'Failed to sign in. Check your credentials.');
      }
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
    setLoading(true);
    setError('');
    const res = await loginUser(demoEmail, 'password123');
    if (res.success) {
      router.push('/account');
    } else {
      setError(res.error || 'Failed to log in');
    }
    setLoading(false);
  };

  return (
    <main className="min-h-[85vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-black/5 shadow-xl space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-[#FAFAFA] px-3.5 py-1 text-xs font-bold text-neutral-600 shadow-sm">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            <span>Z-Lab User Account</span>
          </div>
          <h1 className="text-2xl font-black text-[#1E1B24]">Welcome Back</h1>
          <p className="text-xs text-neutral-500 font-medium">
            Sync your favorite tools, preferences, and offline presets across devices.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 font-medium">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-medium focus:outline-none focus:border-black"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#1E1B24] text-white font-black text-xs hover:opacity-90 transition shadow-md flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Login Shelf */}
        <div className="pt-2 border-t border-neutral-100">
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-2 text-center">
            Quick Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemoLogin('sarah.creator@example.com')}
              className="px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-[11px] font-semibold text-neutral-700 transition text-center"
            >
              Sarah (Creator)
            </button>
            <button
              onClick={() => handleDemoLogin('alex.dev@zlab.io')}
              className="px-2.5 py-1.5 rounded-lg border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-[11px] font-semibold text-neutral-700 transition text-center"
            >
              Alex (Developer)
            </button>
          </div>
        </div>

        {/* Footer links */}
        <div className="text-center text-xs space-y-2">
          <p className="text-neutral-500">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="font-bold text-[#1E1B24] underline">
              Create an account
            </Link>
          </p>
          <p>
            <Link href="/" className="text-neutral-400 hover:text-neutral-600 transition text-[11px]">
              ← Continue as Guest (No login required)
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
