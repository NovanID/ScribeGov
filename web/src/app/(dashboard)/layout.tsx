'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';

interface UserProfile {
  id: number;
  name: string;
  email: string;
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('auth_token');
    if (!token) {
      router.push('/login');
      return;
    }

    // Fetch user profile
    api.get('/user')
      .then(res => {
        setUser(res.data.user);
        setIsAdmin(res.data.roles.includes('Admin'));
      })
      .catch(err => {
        console.error("Failed to fetch user profile:", err);
      });
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
        <div className="p-6 border-b border-[#1E3A5F]/40">
          <h1 className="text-2xl font-bold text-[#F0F4F8]">ScribeGov</h1>
          <p className="text-sm text-[#3B9797] mt-1">E-Office Portal</p>
        </div>

        {user && (
          <div className="px-6 py-4 border-b border-[#1E3A5F]/40 bg-[#0A1420]/50">
            <p className="text-sm font-semibold text-[#F0F4F8] truncate">{user.name}</p>
            <p className="text-xs text-[#8DA4BF] truncate mt-0.5">{user.email}</p>
            <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-medium bg-[#3B9797]/25 text-[#42B3B3] rounded border border-[#3B9797]/30">
              {isAdmin ? 'Admin' : 'User'}
            </span>
          </div>
        )}
        
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
          {isAdmin && (
            <Link href="/settings" className={`block px-4 py-3 rounded-xl transition-all ${pathname.includes('/settings') ? 'bg-[#16476A] text-white shadow-md' : 'text-[#8DA4BF] hover:bg-[#1E3A5F] hover:text-white'}`}>
              <span className="flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Kelola TTE
              </span>
            </Link>
          )}
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
