'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';

interface TimelineEvent {
  type: string;
  actor: string;
  role: string;
  recipient?: string;
  action: string;
  note?: string;
  timestamp: string;
  status?: string;
  priority?: string;
  due_date?: string;
}

interface TimelineProps {
  letterId: number;
}

export default function Timeline({ letterId }: TimelineProps) {
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    fetchTimeline();
  }, [letterId]);

  const fetchTimeline = async () => {
    try {
      setIsLoading(true);
      const res = await api.get(`/letters/${letterId}/timeline`);
      if (res.data && res.data.data) {
        setEvents(res.data.data);
      }
    } catch (err) {
      console.error('Failed to fetch timeline', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getPriorityColor = (priority?: string) => {
    if (priority === 'Segera') return 'text-red-400 bg-red-400/10 border-red-400/20';
    if (priority === 'Penting') return 'text-amber-400 bg-amber-400/10 border-amber-400/20';
    return 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-pulse flex space-x-4">
          <div className="rounded-full bg-[#1E3A5F] h-10 w-10"></div>
          <div className="flex-1 space-y-4 py-1">
            <div className="h-2 bg-[#1E3A5F] rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-2 bg-[#1E3A5F] rounded"></div>
              <div className="h-2 bg-[#1E3A5F] rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 bg-[#0D1929] rounded-2xl border border-[#1E3A5F]">
      <h3 className="text-lg font-bold text-[#F0F4F8] mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-[#3B9797]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Riwayat Disposisi
      </h3>
      
      <div className="relative border-l border-[#1E3A5F] ml-3 md:ml-4 space-y-8">
        {events.map((event, index) => {
          const isLast = index === events.length - 1;
          const date = new Date(event.timestamp);
          
          return (
            <div key={index} className="relative pl-6 md:pl-8">
              {/* Timeline dot */}
              <div className={`absolute -left-1.5 md:-left-2 mt-1.5 w-3 h-3 md:w-4 md:h-4 rounded-full border-2 border-[#0D1929] ${isLast ? 'bg-[#3B9797] shadow-[0_0_8px_rgba(59,151,151,0.6)]' : 'bg-[#8DA4BF]'}`}></div>
              
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-2 md:gap-4 mb-1">
                <div>
                  <h4 className="font-bold text-[#F0F4F8] flex items-center gap-2">
                    {event.type === 'signed' && (
                      <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {event.action}
                    {event.priority && (
                      <span className={`text-[10px] px-2 py-0.5 rounded-full border ${getPriorityColor(event.priority)}`}>
                        {event.priority}
                      </span>
                    )}
                  </h4>
                  <p className="text-sm text-[#8DA4BF] mt-1">
                    Oleh: <span className="text-[#3B9797] font-medium">{event.actor}</span> <span className="opacity-60">({event.role})</span>
                  </p>
                  {event.recipient && (
                    <p className="text-sm text-[#8DA4BF] mt-0.5">
                      Kepada: <span className="text-white font-medium">{event.recipient}</span>
                    </p>
                  )}
                  {event.due_date && (
                    <p suppressHydrationWarning className="text-xs text-amber-500/80 mt-1 flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      Tenggat: {isMounted ? new Date(event.due_date).toLocaleDateString('id-ID') : ''}
                    </p>
                  )}
                </div>
                
                <div suppressHydrationWarning className="text-xs font-medium text-[#8DA4BF] bg-[#16476A] px-2 py-1 rounded-md w-fit whitespace-nowrap">
                  {isMounted ? `${date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' })} • ${date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}` : ''}
                </div>
              </div>
              
              {event.note && (
                <div className="mt-3 p-3 bg-[#16476A] border border-[#1E3A5F] rounded-xl text-sm text-[#F0F4F8] shadow-sm relative">
                  <div className="absolute -top-2 left-4 w-4 h-4 bg-[#16476A] border-t border-l border-[#1E3A5F] transform rotate-45"></div>
                  <p className="relative z-10 italic">"{event.note}"</p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
