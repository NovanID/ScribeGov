'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface User {
  id: number;
  name: string;
  email: string;
}

interface DispositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  letterId: number;
  onSuccess: () => void;
}

const TEMPLATES = [
  'Tindak Lanjuti',
  'Untuk Diketahui',
  'Selesaikan Segera',
  'Mohon Arahan',
];

export default function DispositionModal({ isOpen, onClose, letterId, onSuccess }: DispositionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<number | ''>('');
  const [note, setNote] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      fetchSuggestion();
    } else {
      // Reset state on close
      setSelectedUserId('');
      setNote('');
      setSuggestedUsers([]);
    }
  }, [isOpen]);

  const fetchSuggestion = async () => {
    try {
      setIsLoading(true);
      // We will suggest routing to target_level = 4 (e.g. Staf Pelaksana) as default for MVP
      const res = await api.get(`/dispositions/suggest?target_level=4`);
      if (res.data && res.data.suggested_users) {
        setSuggestedUsers(res.data.suggested_users);
        if (res.data.suggested_users.length > 0) {
          setSelectedUserId(res.data.suggested_users[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to fetch routing suggestion', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) return;

    try {
      setIsLoading(true);
      await api.post('/dispositions', {
        letter_id: letterId,
        to_user_id: selectedUserId,
        note: note,
      });
      toast.success('Surat berhasil didisposisikan!');
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Failed to submit disposition', err);
      toast.error(err.response?.data?.message || 'Gagal mengirim disposisi.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#16476A] border border-[#1E3A5F] w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-[#1E3A5F] flex justify-between items-center bg-[#0D1929]">
          <h3 className="text-xl font-bold text-[#F0F4F8]">Disposisi Surat</h3>
          <button onClick={onClose} className="text-[#8DA4BF] hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-[#8DA4BF] mb-2">Tujuan Disposisi (Rekomendasi Sistem)</label>
            <select 
              value={selectedUserId} 
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
              className="w-full bg-[#0D1929] border border-[#1E3A5F] text-[#F0F4F8] rounded-xl p-3 focus:outline-none focus:border-[#3B9797] focus:ring-1 focus:ring-[#3B9797]"
              required
            >
              <option value="" disabled>Pilih penerima...</option>
              {suggestedUsers.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
            {suggestedUsers.length === 0 && !isLoading && (
              <p className="text-xs text-amber-500 mt-1">Sistem tidak menemukan rute otomatis. Pastikan struktur organisasi telah diatur.</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8DA4BF] mb-2">Catatan Disposisi</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {TEMPLATES.map(temp => (
                <button 
                  key={temp}
                  type="button"
                  onClick={() => setNote(prev => prev ? `${prev}, ${temp}` : temp)}
                  className="px-3 py-1 bg-[#1E3A5F] text-[#F0F4F8] text-xs rounded-full hover:bg-[#3B9797] transition-colors border border-[#132440]"
                >
                  {temp}
                </button>
              ))}
            </div>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ketik catatan tambahan..."
              className="w-full bg-[#0D1929] border border-[#1E3A5F] text-[#F0F4F8] rounded-xl p-3 h-24 resize-none focus:outline-none focus:border-[#3B9797] focus:ring-1 focus:ring-[#3B9797]"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-[#F0F4F8] bg-transparent hover:bg-[#1E3A5F] transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isLoading || !selectedUserId}
              className="px-6 py-2.5 rounded-xl bg-[#3B9797] text-white font-medium hover:bg-[#2F7A7A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Memproses...
                </>
              ) : (
                'Kirim Disposisi'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
