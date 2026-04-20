'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Placeholder for API integration
      // const response = await fetch('/api/auth/forgot-password', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email }),
      // });

      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch (err) {
      console.error('Error sending reset email');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Card className="w-full max-w-md space-y-6 border-none shadow-lg text-center">
        <div className="flex justify-center">
          <div className="p-3 bg-success/10 rounded-full">
            <CheckCircle className="h-8 w-8 text-success" />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-foreground">Check your email</h2>
          <p className="text-sm text-muted-foreground mt-2">
            We&apos;ve sent a password reset link to <span className="font-medium">{email}</span>
          </p>
        </div>

        <p className="text-sm text-muted-foreground">
          Click the link in your email to reset your password. If you don&apos;t see it, check your spam folder.
        </p>

        <Link href="/auth/login">
          <Button
            type="button"
            className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
          >
            Back to login
          </Button>
        </Link>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md space-y-6 border-none shadow-lg">
      <div>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to login
        </Link>
        <h2 className="text-2xl font-bold text-foreground">Reset password</h2>
        <p className="text-sm text-muted-foreground mt-2">
          Enter your email address and we&apos;ll send you a link to reset your password
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium text-foreground">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-10 rounded-lg"
              disabled={loading}
            />
          </div>
        </div>

        <Button
          type="submit"
          className="w-full h-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium transition-colors"
          disabled={loading}
        >
          {loading ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>
    </Card>
  );
}
