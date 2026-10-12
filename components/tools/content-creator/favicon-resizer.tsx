'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { resizeImage } from '@/lib/canvas-utils';
import { downloadBlob } from '@/lib/download-utils';
import { Download } from 'lucide-react';

interface FaviconItem {
  size: number;
  label: string;
  blob: Blob | null;
  url: string | null;
}

const TARGET_SIZES = [
  { size: 16, label: '16×16 (Small Favicon)' },
  { size: 32, label: '32×32 (Standard Favicon)' },
  { size: 48, label: '48×48 (Desktop Browser)' },
  { size: 180, label: '180×180 (Apple Touch Icon)' },
  { size: 512, label: '512×512 (PWA App Icon)' },
];

export function FaviconResizerTool() {
  const [fileName, setFileName] = useState<string>('');
  const [icons, setIcons] = useState<FaviconItem[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFileName(selected.name);
    setIsProcessing(true);

    try {
      const generated: FaviconItem[] = [];
      for (const item of TARGET_SIZES) {
        const blob = await resizeImage(selected, {
          width: item.size,
          height: item.size,
          maintainAspectRatio: false,
          format: 'image/png',
        });
        const url = URL.createObjectURL(blob);
        generated.push({
          size: item.size,
          label: item.label,
          blob,
          url,
        });
      }
      setIcons(generated);
    } catch (err) {
      console.error('Error generating favicons', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = (icon: FaviconItem) => {
    if (!icon.blob) return;
    downloadBlob(icon.blob, `favicon-${icon.size}x${icon.size}.png`);
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFiles}
        accept="image/*"
        label="Upload a logo or image to generate all standard web favicon sizes"
      />

      {isProcessing && (
        <p className="text-center text-xs text-blue-600 animate-pulse font-medium">
          Generating 5 favicon resolutions in browser...
        </p>
      )}

      {icons.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Generated Favicons
            </h3>
            {fileName && <span className="text-xs text-gray-400">Source: {fileName}</span>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {icons.map((item) => (
              <div
                key={item.size}
                className="flex flex-col items-center justify-between rounded-xl border border-gray-200 bg-gray-50/50 p-4 text-center gap-3"
              >
                <div className="h-20 w-20 flex items-center justify-center bg-white rounded-lg border border-gray-200 shadow-sm p-1">
                  {item.url && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={item.url}
                      alt={item.label}
                      style={{ width: Math.min(item.size, 64), height: Math.min(item.size, 64) }}
                      className="object-contain"
                    />
                  )}
                </div>

                <div>
                  <span className="text-xs font-bold text-gray-900 block">{item.label}</span>
                  <span className="text-[10px] text-gray-400">PNG Format</span>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownload(item)}
                  className="inline-flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm"
                >
                  <Download className="h-3.5 w-3.5" /> Download
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
