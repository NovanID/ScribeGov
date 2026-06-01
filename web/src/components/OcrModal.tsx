'use client';

import { useState, useRef } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface OcrModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (data: any, confidence: any) => void;
}

export default function OcrModal({ isOpen, onClose, onSuccess }: OcrModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleScan = async () => {
    if (!file) return;

    try {
      setIsScanning(true);
      const formData = new FormData();
      formData.append('image', file);

      const res = await api.post('/letters/ocr', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (res.data) {
        toast.success('Analisis OCR selesai.');
        onSuccess(res.data.data, res.data.confidence);
        onClose();
      }
    } catch (err) {
      console.error('OCR Scan failed:', err);
      toast.error('Gagal memproses gambar. Pastikan gambar jelas dan berformat JPG/PNG.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleClose = () => {
    setFile(null);
    setPreview(null);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-[#16476A] border border-[#1E3A5F] w-full max-w-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-[#1E3A5F] flex justify-between items-center bg-[#0D1929]">
          <h3 className="text-xl font-bold text-[#F0F4F8] flex items-center gap-2">
            <svg className="w-5 h-5 text-[#3B9797]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Scan Surat (OCR)
          </h3>
          <button onClick={handleClose} disabled={isScanning} className="text-[#8DA4BF] hover:text-white transition-colors">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-5">
          {!preview ? (
            <div 
              className="border-2 border-dashed border-[#3B9797]/50 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:bg-[#1E3A5F] transition-colors group"
              onClick={() => fileInputRef.current?.click()}
            >
              <svg className="w-12 h-12 text-[#8DA4BF] group-hover:text-[#3B9797] transition-colors mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <p className="text-sm font-medium text-[#F0F4F8]">Klik atau Seret Gambar Surat</p>
              <p className="text-xs text-[#8DA4BF] mt-1">Mendukung JPG, PNG (Max 5MB)</p>
            </div>
          ) : (
            <div className="relative rounded-xl overflow-hidden bg-[#0D1929] border border-[#1E3A5F] flex items-center justify-center h-64">
              <img src={preview} alt="Surat Preview" className="max-h-full max-w-full object-contain" />
              {!isScanning && (
                <button 
                  onClick={() => { setFile(null); setPreview(null); }}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/80 rounded-lg text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              )}
            </div>
          )}

          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/jpeg,image/png" 
            className="hidden" 
          />

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={handleClose}
              disabled={isScanning}
              className="px-5 py-2.5 rounded-xl text-[#F0F4F8] bg-transparent hover:bg-[#1E3A5F] transition-colors"
            >
              Batal
            </button>
            <button 
              onClick={handleScan}
              disabled={!file || isScanning}
              className="px-5 py-2.5 rounded-xl bg-[#3B9797] text-white font-medium hover:bg-[#2F7A7A] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isScanning ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Menganalisis...
                </>
              ) : (
                'Proses OCR'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
