'use client';

import { useState } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface SignatureModalProps {
  isOpen: boolean;
  onClose: () => void;
  letterId?: number; // For single sign
  letterIds?: number[]; // For batch sign
  onSuccess: () => void;
}

export default function SignatureModal({ isOpen, onClose, letterId, letterIds, onSuccess }: SignatureModalProps) {
  const [passphrase, setPassphrase] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passphrase) return;

    try {
      setIsLoading(true);
      setError('');
      
      if (letterIds && letterIds.length > 0) {
        // Batch Sign
        await api.post(`/letters/batch-sign`, {
          letter_ids: letterIds,
          passphrase: passphrase,
        });
      } else {
        // Single Sign
        await api.post(`/letters/${letterId}/sign`, {
          passphrase: passphrase,
        });
      }

      toast.success(letterIds ? 'Dokumen berhasil ditandatangani secara massal!' : 'Dokumen berhasil ditandatangani!');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to sign document', err);
      toast.error(err.response?.data?.message || 'Passphrase salah atau terjadi kesalahan pada server BSrE.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#16476A] border border-[#1E3A5F] w-full max-w-sm rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-[#1E3A5F] flex justify-between items-center bg-[#0D1929]">
          <h3 className="text-xl font-bold text-[#F0F4F8] flex items-center gap-2">
            <svg className="w-5 h-5 text-[#3B9797]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Tanda Tangan Elektronik
          </h3>
          <button onClick={onClose} className="text-[#8DA4BF] hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="text-center text-sm text-[#8DA4BF] mb-4">
            Masukkan Passphrase BSrE Anda untuk menandatangani {letterIds ? `massal ${letterIds.length} dokumen` : 'dokumen ini'}. Dokumen akan disertifikasi secara elektronik.
          </div>

          <div>
            <label className="block text-sm font-medium text-[#F0F4F8] mb-2">Passphrase TTE</label>
            <input 
              type="password"
              value={passphrase}
              onChange={(e) => setPassphrase(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-[#0D1929] border border-[#1E3A5F] text-[#F0F4F8] rounded-xl p-3 focus:outline-none focus:border-[#3B9797] focus:ring-1 focus:ring-[#3B9797] font-mono tracking-widest"
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-[#F0F4F8] bg-transparent hover:bg-[#1E3A5F] transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isLoading || !passphrase}
              className="px-5 py-2.5 rounded-xl bg-[#3B9797] text-white font-medium hover:bg-[#2F7A7A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menghubungi BSrE...
                </>
              ) : (
                'Tandatangani Dokumen'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
