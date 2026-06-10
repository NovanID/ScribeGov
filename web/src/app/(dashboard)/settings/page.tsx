'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function SettingsPage() {
  const router = useRouter();
  const [passphrase, setPassphrase] = useState('');
  const [passphraseConfirmation, setPassphraseConfirmation] = useState('');
  const [showPassphrase, setShowPassphrase] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Verify User Role
    api.get('/user')
      .then(res => {
        const roles = res.data.roles || [];
        if (!roles.includes('Admin')) {
          toast.error('Aksi tidak diizinkan. Hanya Admin yang dapat mengakses halaman ini.');
          router.push('/inbox');
        } else {
          setIsAdmin(true);
        }
      })
      .catch(err => {
        console.error('Error initializing settings page:', err);
        toast.error('Gagal memuat data pengaturan.');
      })
      .finally(() => {
        setIsPageLoading(false);
      });
  }, [router]);

  const handleUpdatePassphrase = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passphrase.length < 6) {
      toast.error('Passphrase minimal terdiri dari 6 karakter.');
      return;
    }

    if (passphrase !== passphraseConfirmation) {
      toast.error('Konfirmasi passphrase tidak cocok.');
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading('Sedang memperbarui passphrase TTE Anda...');

    try {
      const response = await api.put('/admin/tte-passphrase', {
        passphrase,
        passphrase_confirmation: passphraseConfirmation
      });

      toast.success(response.data.message || 'Passphrase TTE berhasil diperbarui.', {
        id: loadingToast
      });

      // Reset form
      setPassphrase('');
      setPassphraseConfirmation('');
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string } } };
      const errMsg = axiosError.response?.data?.message || 'Gagal memperbarui passphrase.';
      toast.error(errMsg, {
        id: loadingToast
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isPageLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#3B9797]"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#F0F4F8]">Kelola Passphrase TTE</h1>
        <p className="text-[#8DA4BF] mt-2">
          Sebagai Administrator, Anda dapat mengatur dan memperbarui sandi/passphrase Tanda Tangan Elektronik (TTE) pribadi Anda.
        </p>
      </div>

      <div className="bg-[#16476A] rounded-2xl shadow-xl overflow-hidden border border-[#1E3A5F]">
        <div className="p-8">
          <form onSubmit={handleUpdatePassphrase} className="space-y-6">

            {/* New Passphrase */}
            <div>
              <label className="block text-sm font-medium text-[#8DA4BF] mb-2" htmlFor="passphrase">
                Passphrase Baru
              </label>
              <div className="relative">
                <input
                  id="passphrase"
                  type={showPassphrase ? 'text' : 'password'}
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0D1929] border border-[#1E3A5F] rounded-xl text-[#F0F4F8] placeholder-[#8DA4BF] focus:outline-none focus:ring-2 focus:ring-[#3B9797] transition-all"
                  placeholder="Min. 6 karakter"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassphrase(!showPassphrase)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#8DA4BF] hover:text-[#F0F4F8] transition-colors"
                >
                  {showPassphrase ? (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm New Passphrase */}
            <div>
              <label className="block text-sm font-medium text-[#8DA4BF] mb-2" htmlFor="passphrase_confirmation">
                Konfirmasi Passphrase Baru
              </label>
              <input
                id="passphrase_confirmation"
                type={showPassphrase ? 'text' : 'password'}
                value={passphraseConfirmation}
                onChange={(e) => setPassphraseConfirmation(e.target.value)}
                className="w-full px-4 py-3 bg-[#0D1929] border border-[#1E3A5F] rounded-xl text-[#F0F4F8] placeholder-[#8DA4BF] focus:outline-none focus:ring-2 focus:ring-[#3B9797] transition-all"
                placeholder="Ulangi passphrase baru"
                required
              />
            </div>

            {/* Warning Note */}
            <div className="p-4 bg-[#BF092F]/10 border border-[#BF092F]/30 rounded-xl flex gap-3 text-sm text-[#F0F4F8]/90">
              <svg className="w-6 h-6 text-[#BF092F] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <span className="font-semibold text-white">Perhatian:</span> Passphrase TTE digunakan untuk menandatangani dokumen dinas resmi secara elektronik. Harap catat dan simpan passphrase baru Anda secara aman.
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#3B9797] hover:bg-[#2F7A7A] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  Menyimpan...
                </>
              ) : (
                'Perbarui Passphrase TTE'
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}
