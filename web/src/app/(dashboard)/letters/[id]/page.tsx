'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import Timeline from '@/components/Timeline';
import DispositionModal from '@/components/DispositionModal';
import SignatureModal from '@/components/SignatureModal';

interface Letter {
  id: number;
  number: string;
  date: string;
  subject: string;
  sender: string;
  urgency_level: string;
  status: string;
  file_url?: string;
  download_url?: string;
  created_at: string;
}

export default function LetterDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [letter, setLetter] = useState<Letter | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    if (letter?.date) {
      setFormattedDate(new Date(letter.date).toLocaleDateString('id-ID'));
    }
  }, [letter]);

  useEffect(() => {
    fetchLetter();
  }, [params.id]);

  const fetchLetter = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/letters/${params.id}`);
      if (res.data && res.data.data) {
        setLetter(res.data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getUrgencyColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'urgent': return 'bg-[#BF092F] text-white';
      case 'important': return 'bg-[#F59E0B] text-white';
      default: return 'bg-[#3B9797] text-white';
    }
  };

  if (isLoading) {
    return <div className="text-[#8DA4BF]">Memuat detail surat...</div>;
  }

  if (!letter) {
    return <div className="text-[#BF092F]">Surat tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6 h-[calc(100vh-5rem)] flex flex-col">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/inbox" className="p-2 bg-[#16476A] text-[#F0F4F8] rounded-xl hover:bg-[#1E3A5F] transition-all border border-[#1E3A5F]">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <h2 className="text-2xl md:text-3xl font-bold line-clamp-1">{letter.subject}</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden md:block">
            <span className={`px-3 py-1.5 text-sm font-semibold rounded-full shadow-sm ${getUrgencyColor(letter.urgency_level)}`}>
              {letter.urgency_level}
            </span>
          </div>
          <button
            onClick={async () => {
              if (!confirm('Apakah Anda yakin ingin menghapus surat ini?')) return;
              try {
                await api.delete(`/letters/${letter.id}`);
                router.push('/inbox');
              } catch (err) {
                console.error('Failed to delete letter:', err);
                alert('Gagal menghapus surat.');
              }
            }}
            className="px-4 py-2 bg-[#BF092F]/10 text-[#BF092F] hover:bg-[#BF092F] hover:text-white font-medium rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 border border-[#BF092F]/20"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            <span className="hidden md:inline">Hapus Surat</span>
          </button>
        </div>
      </div>

      <div className="bg-[#16476A] rounded-2xl border border-[#1E3A5F] p-5 shadow-lg flex-shrink-0">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div>
            <p className="text-xs text-[#8DA4BF] mb-1">Pengirim</p>
            <p className="font-medium text-[#F0F4F8]">{letter.sender}</p>
          </div>
          <div>
            <p className="text-xs text-[#8DA4BF] mb-1">Nomor Surat</p>
            <p className="font-medium text-[#F0F4F8]">{letter.number}</p>
          </div>
          <div>
            <p className="text-xs text-[#8DA4BF] mb-1">Tanggal Surat</p>
            <p className="font-medium text-[#F0F4F8]">{formattedDate}</p>
          </div>
          <div>
            <p className="text-xs text-[#8DA4BF] mb-1">Status</p>
            <p className="font-medium text-[#3B9797]">{letter.status}</p>
          </div>
        </div>
      </div>

      <div className="flex-1 bg-[#0D1929] rounded-2xl border border-[#1E3A5F] overflow-hidden flex flex-col relative shadow-inner">
        <div className="p-3 bg-[#1E3A5F] flex justify-between items-center border-b border-[#132440]">
          <span className="text-sm font-medium text-[#F0F4F8]">Dokumen PDF</span>
          <a href={letter.download_url || '#'} target="_blank" rel="noreferrer" className="text-xs text-[#3B9797] hover:text-[#F0F4F8] transition-colors flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Unduh
          </a>
        </div>
        
        {/* PDF Viewer Fallback */}
        <div className="flex-1 w-full h-full bg-[#132440] flex items-center justify-center p-4">
          {letter.file_url ? (
            <iframe src={letter.file_url} className="w-full h-full rounded shadow-md border-none" title="PDF Viewer" />
          ) : (
            <div className="text-center text-[#8DA4BF] max-w-sm">
              <svg className="mx-auto h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>Viewer dokumen PDF akan ditampilkan di sini ketika URL file tersedia dari server.</p>
            </div>
          )}
        </div>

        {/* Sticky Disposition Footer CTA */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0D1929] to-transparent flex justify-end gap-3">
          {/* Mock Role Check: Show TTE Button if status is not Signed */}
          {letter.status !== 'Signed' && (
            <button 
              onClick={() => setIsSignatureModalOpen(true)}
              className="w-full md:w-auto px-8 py-3 bg-[#1E3A5F] hover:bg-[#16476A] text-[#3B9797] font-semibold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 border border-[#3B9797]/30"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              TTE
            </button>
          )}

          <button 
            onClick={() => setIsModalOpen(true)}
            className="w-full md:w-auto px-8 py-3 bg-[#3B9797] hover:bg-[#2F7A7A] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
            Disposisi Surat
          </button>
        </div>
      </div>

      {/* Timeline Section */}
      <Timeline letterId={letter.id} />

      {/* Signature Modal */}
      <SignatureModal
        isOpen={isSignatureModalOpen}
        onClose={() => setIsSignatureModalOpen(false)}
        letterId={letter.id}
        onSuccess={() => {
          fetchLetter();
        }}
      />

      {/* Disposition Modal */}
      <DispositionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        letterId={letter.id}
        onSuccess={() => {
          fetchLetter(); // Refresh letter data to update status
        }}
      />
    </div>
  );
}
