'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { logEvent } from '@/lib/telemetry';
import { signIn } from '@/lib/auth';
import { validateEmail } from '@/lib/validation';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setEmailError('');
    setLoading(true);

    try {
      // Validation
      if (!email || !password) {
        setError('Please enter both email and password');
        setLoading(false);
        return;
      }

      if (!validateEmail(email)) {
        setEmailError('Please enter a valid email address');
        setLoading(false);
        return;
      }

      // Log login attempt
      logEvent('login_attempt', { email });

      // Sign in with Supabase
      const { user, session } = await signIn(email, password);
      
      if (!user || !session) {
        setError('Login failed. Please check your credentials.');
        setLoading(false);
        return;
      }

      // Store user session
      localStorage.setItem('user', JSON.stringify({
        id: user.id,
        email: user.email,
        username: user.user_metadata?.username
      }));
      
      // Store session token
      localStorage.setItem('session', JSON.stringify(session));
      
      // Dispatch event to update header
      window.dispatchEvent(new Event('userLoggedIn'));
      
      logEvent('login_success', { email, userId: user.id });
      
      // Small delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Redirect to shop
      router.push('/shop');
    } catch (err: any) {
      console.error('Login error:', err);
      const errorMessage = err.message?.toLowerCase().includes('invalid') 
        ? 'Invalid email or password. Please try again.'
        : err.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      logEvent('login_error', { email, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="mx-auto h-16 w-16 bg-black rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform duration-200">
              <span className="text-white font-bold text-3xl">E</span>
            </div>
            <h2 className="mt-6 text-4xl font-bold text-black">
              Welcome Back
            </h2>
            <p className="mt-2 text-gray-600">
              Sign in to continue shopping
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg flex items-start">
                <svg className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-4">
              <Input
                id="email"
                name="email"
                type="email"
                label="Email address"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                  setError('');
                }}
                error={emailError}
                placeholder="you@example.com"
                disabled={loading}
              />

              <Input
                id="password"
                name="password"
                type="password"
                label="Password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                placeholder="••••••••"
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 border-gray-300 rounded text-black focus:ring-black focus:ring-offset-0"
                  disabled={loading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="#" className="font-medium text-black hover:text-gray-600 transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              loading={loading}
              fullWidth
            >
              Sign In
            </Button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link href="/signup" className="font-semibold text-black hover:text-gray-600 transition-colors">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
