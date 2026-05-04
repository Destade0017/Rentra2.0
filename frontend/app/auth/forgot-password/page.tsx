'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { AuthCard } from '@/components/auth/auth-card';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);

    try {
      // API call would go here
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch (err) {
      console.error('Error sending reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <AuthCard 
        title="Check your email" 
        description="We've sent a recovery link to your email address."
        className="text-center"
      >
        <div className="flex justify-center py-2">
          <div className="w-16 h-16 bg-zinc-50 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-zinc-950" />
          </div>
        </div>

        <p className="text-sm text-zinc-500 max-w-[280px] mx-auto leading-relaxed">
          If an account exists for <span className="font-semibold text-zinc-950">{email}</span>, you will receive a password reset link shortly.
        </p>

        <div className="pt-4 space-y-4">
          <Link href="/auth/login" className="block">
            <Button
              className="w-full h-11 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg font-medium transition-all shadow-sm"
            >
              Return to Login
            </Button>
          </Link>
          <button 
            onClick={() => setSubmitted(false)}
            className="text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors underline underline-offset-4"
          >
            Didn&apos;t get the email? Try again
          </button>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard 
      title="Reset password" 
      description="Enter your email and we'll send you a link to get back into your account."
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label htmlFor="email" className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
            Email Address
          </label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-11 px-4 border-zinc-200 focus:ring-1 focus:ring-zinc-950 focus:border-zinc-950 transition-all rounded-lg bg-[#fdfdfd]"
            disabled={loading}
            required
          />
        </div>

        <div className="space-y-4">
          <Button
            type="submit"
            className="w-full h-11 bg-zinc-950 hover:bg-zinc-800 text-white rounded-lg font-medium transition-all shadow-sm active:scale-[0.98]"
            disabled={loading}
          >
            {loading ? <Spinner className="h-4 w-4 text-white" /> : 'Send Reset Link'}
          </Button>

          <Link href="/auth/login" className="flex items-center justify-center gap-2 text-sm font-medium text-zinc-500 hover:text-zinc-950 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
