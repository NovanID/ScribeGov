'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import OcrModal from '@/components/OcrModal';
import OcrReviewModal from '@/components/OcrReviewModal';
import SignatureModal from '@/components/SignatureModal';

interface Letter {
  id: number;
  number: string;
  date: string;
  subject: string;
  sender: string;
  urgency_level: string;
  status: string;
  created_at: string;
}

export default function InboxPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Batch Sign State
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
  const [isBatchSignModalOpen, setIsBatchSignModalOpen] = useState(false);

  // OCR State
  const [isOcrModalOpen, setIsOcrModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [ocrData, setOcrData] = useState<any>(null);
  const [ocrConfidence, setOcrConfidence] = useState<any>(null);

  useEffect(() => {
    fetchInbox();
  }, []);

  const fetchInbox = async () => {
    try {
      setIsLoading(true);
      // Fallback data for UI before API is ready
      setLetters([
        { id: 1, number: '001/A/2026', date: '2026-05-14', subject: 'Undangan Rapat Koordinasi Nasional Kementerian PAN-RB', sender: 'Kementerian PAN-RB', urgency_level: 'Urgent', status: 'Diterima', created_at: '2026-05-14T08:00:00.000000Z' },
        { id: 2, number: '002/B/2026', date: '2026-05-13', subject: 'Laporan Triwulan I Tahun 2026', sender: 'Dinas Kominfo Provinsi', urgency_level: 'Normal', status: 'Didisposisi', created_at: '2026-05-13T10:00:00.000000Z' }
      ]);
      const res = await api.get('/inbox');
      if (res.data && res.data.data) {
        setLetters(res.data.data);
      }
      setSelectedLetters([]); // Reset selection on fetch
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLetters = letters.filter(l => l.subject.toLowerCase().includes(search.toLowerCase()) || l.sender.toLowerCase().includes(search.toLowerCase()));

  const getUrgencyColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'urgent': return 'bg-[#BF092F] text-white';
      case 'important': return 'bg-[#F59E0B] text-white';
      default: return 'bg-[#3B9797] text-white';
    }
  };

  const handleSelectLetter = (id: number) => {
    setSelectedLetters(prev => 
      prev.includes(id) ? prev.filter(lId => lId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    const signableLetters = filteredLetters.filter(l => l.status !== 'Signed');
    if (selectedLetters.length === signableLetters.length) {
      setSelectedLetters([]);
    } else {
      setSelectedLetters(signableLetters.map(l => l.id));
    }
  };

  const signableCount = filteredLetters.filter(l => l.status !== 'Signed').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Kotak Masuk</h2>
          <p className="text-[#8DA4BF]">Kelola semua surat dan disposisi Anda di sini.</p>
        </div>
        <div className="w-full md:w-auto relative">
          <input
            type="text"
            placeholder="Cari surat..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-64 px-4 py-2 pl-10 bg-[#0D1929] border border-[#1E3A5F] rounded-xl text-white placeholder-[#8DA4BF] focus:outline-none focus:ring-2 focus:ring-[#3B9797]"
          />
          <svg className="w-5 h-5 absolute left-3 top-2.5 text-[#8DA4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          onClick={() => setIsOcrModalOpen(true)}
          className="w-full md:w-auto px-5 py-2.5 bg-[#3B9797] hover:bg-[#2F7A7A] text-white font-medium rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          </svg>
          Scan Surat (OCR)
        </button>
      </div>

      {selectedLetters.length > 0 && (
        <div className="bg-[#1E3A5F] border border-[#3B9797]/50 rounded-xl p-4 flex items-center justify-between shadow-lg mb-4 animate-in fade-in slide-in-from-top-2">
          <p className="text-[#F0F4F8] font-medium">
            <span className="bg-[#3B9797] text-white px-2 py-0.5 rounded-md mr-2">{selectedLetters.length}</span>
            Surat terpilih untuk TTE Massal
          </p>
          <button
            onClick={() => setIsBatchSignModalOpen(true)}
            className="px-5 py-2 bg-[#3B9797] hover:bg-[#2F7A7A] text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            TTE Massal
          </button>
        </div>
      )}

      <div className="bg-[#16476A] rounded-2xl border border-[#1E3A5F] overflow-hidden shadow-lg">
        {isLoading ? (
          <div className="p-8 text-center text-[#8DA4BF]">Memuat surat...</div>
        ) : filteredLetters.length === 0 ? (
          <div className="p-8 text-center text-[#8DA4BF]">Belum ada surat masuk.</div>
        ) : (
          <div>
            <div className="bg-[#0D1929] border-b border-[#1E3A5F] p-4 flex items-center gap-4">
              <input
                type="checkbox"
                checked={selectedLetters.length === signableCount && signableCount > 0}
                onChange={handleSelectAll}
                className="w-4 h-4 rounded border-[#1E3A5F] bg-[#16476A] text-[#3B9797] focus:ring-[#3B9797] focus:ring-offset-[#0D1929]"
                disabled={signableCount === 0}
              />
              <span className="text-sm font-medium text-[#8DA4BF]">Pilih Semua (Yang belum ditandatangani)</span>
            </div>
            <ul className="divide-y divide-[#1E3A5F]">
              {filteredLetters.map((letter) => (
                <li key={letter.id} className={`hover:bg-[#1E3A5F]/50 transition-colors flex items-center ${selectedLetters.includes(letter.id) ? 'bg-[#1E3A5F]/30' : ''}`}>
                  <div className="pl-4">
                    <input
                      type="checkbox"
                      checked={selectedLetters.includes(letter.id)}
                      onChange={() => handleSelectLetter(letter.id)}
                      disabled={letter.status === 'Signed'}
                      className="w-4 h-4 rounded border-[#1E3A5F] bg-[#16476A] text-[#3B9797] focus:ring-[#3B9797] focus:ring-offset-[#0D1929] disabled:opacity-50"
                    />
                  </div>
                  <Link href={`/letters/${letter.id}`} className="flex-1 block p-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${getUrgencyColor(letter.urgency_level)}`}>
                        {letter.urgency_level}
                      </span>
                      <p className="text-sm font-medium text-[#F0F4F8] line-clamp-1">{letter.subject}</p>
                    </div>
                    <div className="ml-4 flex-shrink-0 flex items-center gap-2">
                      <p className="text-sm text-[#8DA4BF]">{new Date(letter.date).toLocaleDateString('id-ID')}</p>
                      <svg className="w-5 h-5 text-[#8DA4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex text-sm text-[#8DA4BF]">
                      <p className="flex items-center gap-1">
                        <svg className="flex-shrink-0 mr-1.5 h-4 w-4 text-[#8DA4BF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        {letter.sender}
                      </p>
                    </div>
                  </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <OcrModal 
        isOpen={isOcrModalOpen} 
        onClose={() => setIsOcrModalOpen(false)} 
        onSuccess={(data, confidence) => {
          setOcrData(data);
          setOcrConfidence(confidence);
          setIsReviewModalOpen(true);
        }}
      />

      <OcrReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        initialData={ocrData}
        confidence={ocrConfidence}
        onSuccess={() => {
          fetchInbox();
        }}
      />

      <SignatureModal
        isOpen={isBatchSignModalOpen}
        onClose={() => setIsBatchSignModalOpen(false)}
        letterIds={selectedLetters}
        onSuccess={() => {
          fetchInbox();
        }}
      />
    </div>
  );
}
