'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/login', { email, password });
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        router.push('/inbox');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#132440] p-4">
      <div className="w-full max-w-md bg-[#16476A] rounded-2xl shadow-2xl overflow-hidden border border-[#1E3A5F]">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#F0F4F8] mb-2">ScribeGov</h1>
            <p className="text-[#8DA4BF]">Platform E-Office Pemerintahan</p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-[#BF092F]/20 border border-[#BF092F] rounded-xl text-[#F0F4F8] text-sm text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#8DA4BF] mb-2" htmlFor="email">
                Email Address / NIP
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0D1929] border border-[#1E3A5F] rounded-xl text-[#F0F4F8] placeholder-[#8DA4BF] focus:outline-none focus:ring-2 focus:ring-[#3B9797] transition-all"
                placeholder="nip@agency.go.id"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#8DA4BF] mb-2" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0D1929] border border-[#1E3A5F] rounded-xl text-[#F0F4F8] placeholder-[#8DA4BF] focus:outline-none focus:ring-2 focus:ring-[#3B9797] transition-all"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#3B9797] hover:bg-[#2F7A7A] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
