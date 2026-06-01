'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function LetterCreatePage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    number: '',
    date: '',
    subject: '',
    sender: '',
    urgency_level: 'Normal',
  });
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (file) {
        data.append('file', file);
      }

      await api.post('/letters', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Surat berhasil didaftarkan!');
      router.push('/inbox');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal mendaftarkan surat.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Registrasi Surat Masuk</h2>
        <p className="text-[#8DA4BF]">Masukkan data detail surat masuk secara manual.</p>
      </div>

      <div className="bg-[#16476A] rounded-2xl border border-[#1E3A5F] shadow-lg p-6 md:p-8">
        {error && (
          <div className="mb-6 p-4 bg-[#BF092F]/20 border border-[#BF092F] rounded-xl text-[#F0F4F8] text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#8DA4BF] mb-2">
                Nomor Surat <span className="text-[#BF092F]">*</span>
              </label>
              <input
                type="text"
                name="number"
                value={formData.number}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0D1929] border border-[#1E3A5F] rounded-xl text-[#F0F4F8] focus:outline-none focus:ring-2 focus:ring-[#3B9797]"
                placeholder="Contoh: 123/UM/2026"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#8DA4BF] mb-2">
                Tanggal Surat <span className="text-[#BF092F]">*</span>
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#0D1929] border border-[#1E3A5F] rounded-xl text-[#F0F4F8] focus:outline-none focus:ring-2 focus:ring-[#3B9797]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8DA4BF] mb-2">
              Pengirim <span className="text-[#BF092F]">*</span>
            </label>
            <input
              type="text"
              name="sender"
              value={formData.sender}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#0D1929] border border-[#1E3A5F] rounded-xl text-[#F0F4F8] focus:outline-none focus:ring-2 focus:ring-[#3B9797]"
              placeholder="Instansi / Individu Pengirim"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8DA4BF] mb-2">
              Perihal (Subject) <span className="text-[#BF092F]">*</span>
            </label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-[#0D1929] border border-[#1E3A5F] rounded-xl text-[#F0F4F8] focus:outline-none focus:ring-2 focus:ring-[#3B9797]"
              placeholder="Ringkasan isi surat"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8DA4BF] mb-2">
              Tingkat Urgensi
            </label>
            <select
              name="urgency_level"
              value={formData.urgency_level}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-[#0D1929] border border-[#1E3A5F] rounded-xl text-[#F0F4F8] focus:outline-none focus:ring-2 focus:ring-[#3B9797]"
            >
              <option value="Normal">Normal</option>
              <option value="Important">Penting (Important)</option>
              <option value="Urgent">Sangat Segera / Rahasia (Urgent)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#8DA4BF] mb-2">
              Unggah File PDF
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-[#1E3A5F] border-dashed rounded-xl bg-[#0D1929] hover:bg-[#1E3A5F]/20 transition-colors">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-[#8DA4BF]" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-[#8DA4BF] justify-center mt-2">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-transparent rounded-md font-medium text-[#3B9797] hover:text-[#2F7A7A] focus-within:outline-none">
                    <span>Pilih file</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" accept=".pdf" onChange={handleFileChange} />
                  </label>
                  <p className="pl-1">atau seret dan lepas</p>
                </div>
                <p className="text-xs text-[#8DA4BF]">
                  PDF hingga 10MB
                </p>
                {file && <p className="text-sm font-bold text-[#F0F4F8] mt-2">{file.name}</p>}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="button"
              onClick={() => router.push('/inbox')}
              className="px-6 py-3 border border-[#1E3A5F] text-[#F0F4F8] rounded-xl hover:bg-[#1E3A5F] transition-all mr-3"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-3 bg-[#3B9797] hover:bg-[#2F7A7A] text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50"
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Surat'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
