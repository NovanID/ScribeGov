'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface OcrReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData: any;
  confidence: any;
  onSuccess: () => void;
}

export default function OcrReviewModal({ isOpen, onClose, initialData, confidence, onSuccess }: OcrReviewModalProps) {
  const [formData, setFormData] = useState({
    number: '',
    date: '',
    sender: '',
    subject: '',
    urgency_level: 'Normal'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        number: initialData.number || '',
        date: initialData.date || '',
        sender: initialData.sender || '',
        subject: initialData.subject || '',
        urgency_level: 'Normal'
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      await api.post('/letters', formData);
      toast.success('Surat hasil scan berhasil disimpan!');
      onSuccess();
      onClose();
    } catch (err) {
      console.error('Failed to save OCR letter', err);
      toast.error('Gagal menyimpan surat. Periksa form Anda.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLowConfidence = (field: string) => {
    return confidence && confidence[field] < 70;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#16476A] border border-[#1E3A5F] w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-[#1E3A5F] flex justify-between items-center bg-[#0D1929]">
          <h3 className="text-xl font-bold text-[#F0F4F8]">Review Hasil OCR</h3>
          <button onClick={onClose} disabled={isSubmitting} className="text-[#8DA4BF] hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#F0F4F8] mb-1">
                Nomor Surat {isLowConfidence('number') && <span className="text-amber-500 text-xs ml-2">(Periksa Ulang!)</span>}
              </label>
              <input 
                type="text"
                value={formData.number}
                onChange={(e) => setFormData({...formData, number: e.target.value})}
                className={`w-full bg-[#0D1929] border ${isLowConfidence('number') ? 'border-amber-500 focus:ring-amber-500' : 'border-[#1E3A5F] focus:ring-[#3B9797]'} text-[#F0F4F8] rounded-xl p-3 focus:outline-none focus:ring-1`}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#F0F4F8] mb-1">
                Tanggal Surat {isLowConfidence('date') && <span className="text-amber-500 text-xs ml-2">(Periksa Ulang!)</span>}
              </label>
              <input 
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                className={`w-full bg-[#0D1929] border ${isLowConfidence('date') ? 'border-amber-500 focus:ring-amber-500' : 'border-[#1E3A5F] focus:ring-[#3B9797]'} text-[#F0F4F8] rounded-xl p-3 focus:outline-none focus:ring-1`}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#F0F4F8] mb-1">
              Pengirim {isLowConfidence('sender') && <span className="text-amber-500 text-xs ml-2">(Periksa Ulang!)</span>}
            </label>
            <input 
              type="text"
              value={formData.sender}
              onChange={(e) => setFormData({...formData, sender: e.target.value})}
              className={`w-full bg-[#0D1929] border ${isLowConfidence('sender') ? 'border-amber-500 focus:ring-amber-500' : 'border-[#1E3A5F] focus:ring-[#3B9797]'} text-[#F0F4F8] rounded-xl p-3 focus:outline-none focus:ring-1`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#F0F4F8] mb-1">
              Perihal {isLowConfidence('subject') && <span className="text-amber-500 text-xs ml-2">(Periksa Ulang!)</span>}
            </label>
            <input 
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className={`w-full bg-[#0D1929] border ${isLowConfidence('subject') ? 'border-amber-500 focus:ring-amber-500' : 'border-[#1E3A5F] focus:ring-[#3B9797]'} text-[#F0F4F8] rounded-xl p-3 focus:outline-none focus:ring-1`}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#F0F4F8] mb-1">
              Tingkat Urgensi
            </label>
            <select 
              value={formData.urgency_level}
              onChange={(e) => setFormData({...formData, urgency_level: e.target.value})}
              className="w-full bg-[#0D1929] border border-[#1E3A5F] text-[#F0F4F8] rounded-xl p-3 focus:outline-none focus:ring-1 focus:ring-[#3B9797]"
            >
              <option value="Normal">Normal</option>
              <option value="Important">Penting (Important)</option>
              <option value="Urgent">Sangat Segera (Urgent)</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl text-[#F0F4F8] bg-transparent hover:bg-[#1E3A5F] transition-colors"
            >
              Batal
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-[#3B9797] text-white font-medium hover:bg-[#2F7A7A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Menyimpan...' : 'Simpan Surat Masuk'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
