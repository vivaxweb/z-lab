'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { extractPalette } from '@/lib/canvas-utils';
import { Copy, Check } from 'lucide-react';

export function ColorPaletteExtractorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setIsProcessing(true);

    try {
      const colors = await extractPalette(selected, 8);
      setPalette(colors);
    } catch (err) {
      console.error('Error extracting palette', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFiles}
        accept="image/*"
        label="Upload photo to extract dominant color palette"
      />

      {previewUrl && (
        <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="h-28 w-28 overflow-hidden rounded-lg border bg-white flex-shrink-0 shadow-sm">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Analyzed" className="h-full w-full object-cover" />
          </div>
          <div className="text-sm space-y-1">
            <p className="font-semibold text-gray-900">{file?.name}</p>
            <p className="text-xs text-gray-500">
              {isProcessing ? 'Analyzing pixel frequency...' : `Found ${palette.length} dominant colors`}
            </p>
          </div>
        </div>
      )}

      {palette.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Dominant Color Palette
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {palette.map((hex) => (
              <button
                key={hex}
                type="button"
                onClick={() => handleCopy(hex)}
                className="group relative flex flex-col items-center rounded-xl border border-gray-200 bg-white p-3 shadow-sm hover:border-blue-400 hover:shadow transition"
              >
                <div
                  className="h-16 w-full rounded-lg shadow-inner mb-2 border border-black/5"
                  style={{ backgroundColor: hex }}
                />
                <span className="font-mono text-xs font-bold text-gray-800 uppercase flex items-center gap-1">
                  {hex}
                  {copiedHex === hex ? (
                    <Check className="h-3 w-3 text-green-600" />
                  ) : (
                    <Copy className="h-3 w-3 text-gray-400 group-hover:text-blue-600" />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
