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
  const [tab, setTab] = useState<'suggest' | 'manual'>('suggest');
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [groupedUsers, setGroupedUsers] = useState<Record<string, User[]>>({});
  
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [note, setNote] = useState('');
  const [priority, setPriority] = useState('Biasa');
  const [dueDate, setDueDate] = useState('');
  
  useEffect(() => {
    if (isOpen) {
      fetchSuggestion();
      fetchAllUsers();
    } else {
      // Reset state on close
      setSelectedUserIds([]);
      setNote('');
      setPriority('Biasa');
      setDueDate('');
      setSuggestedUsers([]);
      setTab('suggest');
    }
  }, [isOpen]);

  const fetchSuggestion = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/dispositions/suggest?target_level=4`);
      if (res.data && res.data.suggested_users) {
        setSuggestedUsers(res.data.suggested_users);
        if (res.data.suggested_users.length > 0) {
          setSelectedUserIds([res.data.suggested_users[0].id]);
        }
      }
    } catch (err) {
      console.error('Failed to fetch routing suggestion', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await api.get(`/dispositions/users`);
      if (res.data && res.data.data) {
        setGroupedUsers(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch all users', err);
    }
  };

  const toggleUserSelection = (id: number) => {
    setSelectedUserIds(prev => 
      prev.includes(id) ? prev.filter(userId => userId !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedUserIds.length === 0) {
      toast.error('Silakan pilih minimal 1 penerima.');
      return;
    }

    try {
      setIsLoading(true);
      await api.post('/dispositions', {
        letter_id: letterId,
        to_user_ids: selectedUserIds,
        note: note,
        priority: priority,
        due_date: dueDate || null,
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
      <div className="bg-[#16476A] border border-[#1E3A5F] w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-[#1E3A5F] flex justify-between items-center bg-[#0D1929]">
          <h3 className="text-xl font-bold text-[#F0F4F8]">Disposisi Surat</h3>
          <button onClick={onClose} className="text-[#8DA4BF] hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col max-h-[85vh]">
          <div className="flex border-b border-[#1E3A5F] bg-[#0D1929]">
            <button
              type="button"
              onClick={() => { setTab('suggest'); if(suggestedUsers.length > 0) setSelectedUserIds([suggestedUsers[0].id]); }}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'suggest' ? 'text-[#3B9797] border-b-2 border-[#3B9797]' : 'text-[#8DA4BF] hover:text-[#F0F4F8]'}`}
            >
              Rekomendasi Sistem
            </button>
            <button
              type="button"
              onClick={() => setTab('manual')}
              className={`flex-1 py-3 text-sm font-medium transition-colors ${tab === 'manual' ? 'text-[#3B9797] border-b-2 border-[#3B9797]' : 'text-[#8DA4BF] hover:text-[#F0F4F8]'}`}
            >
              Pilih Manual
            </button>
          </div>

          <div className="p-6 overflow-y-auto space-y-6 flex-1">
            {/* Recipient Selection Section */}
            <div>
              <label className="block text-sm font-medium text-[#8DA4BF] mb-3">Tujuan Disposisi (Multi-Penerima)</label>
              
              {tab === 'suggest' ? (
                <div className="space-y-2">
                  {suggestedUsers.length > 0 ? (
                    suggestedUsers.map(u => (
                      <label key={u.id} className="flex items-center gap-3 p-3 bg-[#0D1929] border border-[#1E3A5F] rounded-xl cursor-pointer hover:border-[#3B9797] transition-colors">
                        <input 
                          type="checkbox" 
                          checked={selectedUserIds.includes(u.id)}
                          onChange={() => toggleUserSelection(u.id)}
                          className="w-4 h-4 text-[#3B9797] bg-transparent border-[#1E3A5F] rounded focus:ring-[#3B9797] focus:ring-offset-[#0D1929]"
                        />
                        <span className="text-[#F0F4F8]">{u.name}</span>
                      </label>
                    ))
                  ) : (
                    <p className="text-sm text-amber-500 bg-amber-500/10 p-3 rounded-lg border border-amber-500/30">
                      Sistem tidak menemukan rute otomatis. Silakan gunakan opsi Pilih Manual.
                    </p>
                  )}
                </div>
              ) : (
                <div className="space-y-4 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {Object.entries(groupedUsers).map(([orgName, users]) => (
                    <div key={orgName} className="space-y-2">
                      <h4 className="text-xs font-semibold text-[#3B9797] uppercase tracking-wider">{orgName}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {users.map(u => (
                          <label key={u.id} className="flex items-center gap-3 p-2 bg-[#0D1929] border border-[#1E3A5F] rounded-lg cursor-pointer hover:border-[#3B9797] transition-colors">
                            <input 
                              type="checkbox" 
                              checked={selectedUserIds.includes(u.id)}
                              onChange={() => toggleUserSelection(u.id)}
                              className="w-4 h-4 text-[#3B9797] bg-transparent border-[#1E3A5F] rounded focus:ring-[#3B9797]"
                            />
                            <div className="flex flex-col">
                              <span className="text-sm text-[#F0F4F8]">{u.name}</span>
                              <span className="text-[10px] text-[#8DA4BF]">{u.email}</span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Additional Attributes Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#8DA4BF] mb-2">Batas Waktu (Opsional)</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full bg-[#0D1929] border border-[#1E3A5F] text-[#F0F4F8] rounded-xl p-3 focus:outline-none focus:border-[#3B9797] focus:ring-1 focus:ring-[#3B9797]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[#8DA4BF] mb-2">Prioritas</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  className="w-full bg-[#0D1929] border border-[#1E3A5F] text-[#F0F4F8] rounded-xl p-3 focus:outline-none focus:border-[#3B9797] focus:ring-1 focus:ring-[#3B9797]"
                >
                  <option value="Biasa">Biasa</option>
                  <option value="Penting">Penting</option>
                  <option value="Segera">Segera</option>
                </select>
              </div>
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
          </div>

          <div className="p-4 border-t border-[#1E3A5F] bg-[#0D1929] flex justify-end gap-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-[#F0F4F8] bg-transparent hover:bg-[#1E3A5F] transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isLoading || selectedUserIds.length === 0}
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
