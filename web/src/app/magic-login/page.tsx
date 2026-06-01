'use client';

import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import api from '@/lib/api';

function MagicLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState('Mengautentikasi tautan...');

  useEffect(() => {
    const token = searchParams.get('token');
    const redirectUrl = searchParams.get('redirect') || '/inbox';

    if (!token) {
      setStatus('Token tidak ditemukan atau tidak valid.');
      setTimeout(() => router.push('/login'), 2000);
      return;
    }

    const authenticate = async () => {
      try {
        const res = await api.post('/auth/magic-link', { token });
        if (res.data && res.data.access_token) {
          localStorage.setItem('auth_token', res.data.access_token);
          setStatus('Autentikasi berhasil. Mengarahkan...');
          setTimeout(() => router.push(redirectUrl), 1000);
        }
      } catch (err) {
        console.error(err);
        setStatus('Tautan kedaluwarsa atau tidak valid.');
        setTimeout(() => router.push('/login'), 2000);
      }
    };

    authenticate();
  }, [router, searchParams]);

  return (
    <div className="min-h-screen bg-[#132440] flex flex-col justify-center items-center p-4">
      <div className="bg-[#16476A] p-8 rounded-2xl shadow-2xl border border-[#1E3A5F] max-w-sm w-full text-center">
        <svg className="animate-spin h-10 w-10 text-[#3B9797] mx-auto mb-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <h2 className="text-xl font-bold text-[#F0F4F8] mb-2">ScribeGov</h2>
        <p className="text-[#8DA4BF]">{status}</p>
      </div>
    </div>
  );
}

export default function MagicLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#132440] flex items-center justify-center text-[#8DA4BF]">Memuat...</div>}>
      <MagicLoginContent />
    </Suspense>
  );
}
