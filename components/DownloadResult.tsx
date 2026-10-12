'use client';

import React from 'react';
import { downloadBlob } from '@/lib/download-utils';
import { Download, Sparkles } from 'lucide-react';

export interface DownloadResultProps {
  /** The processed Blob to offer for download. null = no result yet. */
  blob: Blob | null;
  /** Suggested filename for the download. */
  filename: string;
  /** Human-readable label for the download button. */
  label?: string;
  /** Whether to show a file-size summary below the button. */
  showSize?: boolean;
}

/**
 * Renders a MindMate styled download trigger once a Blob result is available.
 * Uses client-side downloadBlob helper to avoid holding lingering object URLs.
 */
export function DownloadResult({
  blob,
  filename,
  label = 'Download Result',
  showSize = true,
}: DownloadResultProps) {
  if (!blob) return null;

  const sizeKb = (blob.size / 1024).toFixed(1);
  const sizeMb = (blob.size / 1024 / 1024).toFixed(2);
  const sizeLabel = blob.size >= 1024 * 1024 ? `${sizeMb} MB` : `${sizeKb} KB`;

  return (
    <div className="flex flex-wrap items-center gap-3 pt-1">
      <button
        type="button"
        onClick={() => downloadBlob(blob, filename)}
        className={[
          'inline-flex items-center gap-2.5 rounded-full px-6 py-3',
          'bg-[#D7F75B] text-xs sm:text-sm font-black text-[#1E1B24]',
          'shadow-[0_6px_20px_rgba(215,247,91,0.35)] hover:shadow-[0_10px_24px_rgba(215,247,91,0.5)]',
          'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-400',
        ].join(' ')}
      >
        <Download className="h-4 w-4" />
        <span>{label}</span>
      </button>

      {showSize && (
        <span className="inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-bold text-neutral-600 shadow-sm border border-black/[0.04]">
          <Sparkles className="h-3 w-3 text-emerald-500" />
          <span>Size: {sizeLabel}</span>
        </span>
      )}
    </div>
  );
}
