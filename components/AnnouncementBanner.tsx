'use client';

import React, { useState, useEffect } from 'react';
import { AdminStore, GlobalAnnouncement } from '@/lib/admin-store';
import { Sparkles, AlertTriangle, Info, CheckCircle2, X } from 'lucide-react';

export function AnnouncementBanner() {
  const [activeBanner, setActiveBanner] = useState<GlobalAnnouncement | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    try {
      const announcements = AdminStore.getAnnouncements();
      const current = announcements.find((a) => a.active);
      if (current) {
        const isDismissed = sessionStorage.getItem(`zlab_dismiss_ann_${current.id}`);
        if (!isDismissed) {
          setActiveBanner(current);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  if (!activeBanner || dismissed) return null;

  const bgStyles = {
    info: 'bg-[#BCE6F8] text-[#113B53] border-blue-200',
    warning: 'bg-[#FFE500] text-[#1E1B24] border-amber-300',
    alert: 'bg-[#FF6B8B] text-white border-rose-300',
    success: 'bg-[#D4F84B] text-[#1E1B24] border-lime-300',
  }[activeBanner.type];

  const Icon = {
    info: Info,
    warning: AlertTriangle,
    alert: AlertTriangle,
    success: Sparkles,
  }[activeBanner.type];

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem(`zlab_dismiss_ann_${activeBanner.id}`, '1');
  };

  return (
    <div className={`relative px-4 py-2 text-xs font-semibold border-b transition-all ${bgStyles}`}>
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <Icon className="h-4 w-4 shrink-0" />
          <span className="font-bold underline decoration-black/20">{activeBanner.title}:</span>
          <span className="truncate">{activeBanner.message}</span>
        </div>
        <button
          onClick={handleDismiss}
          className="rounded p-1 hover:bg-black/10 transition shrink-0"
          title="Dismiss notification"
          aria-label="Dismiss notification"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
