'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    router.push('/login');
  };

  if (!isClient) return null;

  return (
    <div className="min-h-screen bg-[#132440] text-[#F0F4F8] flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-[#0D1929] border-r border-[#1E3A5F] flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-[#F0F4F8]">ScribeGov</h1>
          <p className="text-sm text-[#3B9797] mt-1">E-Office Portal</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <Link href="/inbox" className={`block px-4 py-3 rounded-xl transition-all ${pathname.includes('/inbox') ? 'bg-[#16476A] text-white shadow-md' : 'text-[#8DA4BF] hover:bg-[#1E3A5F] hover:text-white'}`}>
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              Kotak Masuk
            </span>
          </Link>
          <Link href="/letters/create" className={`block px-4 py-3 rounded-xl transition-all ${pathname.includes('/letters/create') ? 'bg-[#16476A] text-white shadow-md' : 'text-[#8DA4BF] hover:bg-[#1E3A5F] hover:text-white'}`}>
            <span className="flex items-center gap-3">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Buat Surat
            </span>
          </Link>
        </nav>

        <div className="p-4 border-t border-[#1E3A5F]">
          <button onClick={handleLogout} className="w-full px-4 py-3 text-left text-[#BF092F] hover:bg-[#BF092F]/10 rounded-xl transition-all flex items-center gap-3">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
