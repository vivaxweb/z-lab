'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadResult } from '@/components/DownloadResult';
import { compressImage } from '@/lib/canvas-utils';
import { Sparkles, FileImage, CheckCircle2 } from 'lucide-react';

export function ImageCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [quality, setQuality] = useState<number>(0.75);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [compressedBlob, setCompressedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    setCompressedBlob(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const blob = await compressImage(file, {
        quality,
        maxWidth: maxWidth > 0 ? maxWidth : undefined,
        format: file.type === 'image/png' ? 'image/png' : 'image/jpeg',
      });
      setCompressedBlob(blob);
    } catch (err) {
      console.error('Error compressing image', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const originalKb = file ? file.size / 1024 : 0;
  const compressedKb = compressedBlob ? compressedBlob.size / 1024 : 0;
  const savedPercent =
    originalKb > 0 && compressedKb > 0 ? Math.round(((originalKb - compressedKb) / originalKb) * 100) : 0;

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFiles}
        accept="image/jpeg,image/png,image/webp"
        label="Select or drop a photo to compress file size inside browser memory"
      />

      {file && (
        <div className="space-y-6 rounded-3xl bg-[#FAF7FD] border border-purple-100/60 p-6 sm:p-7 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-purple-100/60 text-xs">
            <span className="flex items-center gap-1.5 font-bold text-[#1E1B24]">
              <FileImage className="h-4 w-4 text-purple-600" />
              <span>{file.name}</span>
            </span>
            <span className="rounded-full bg-white px-3 py-1 font-mono font-bold text-neutral-600 shadow-sm">
              Original: {originalKb.toFixed(1)} KB
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <div className="flex justify-between text-xs font-bold text-neutral-600 mb-2">
                <span>Compression Quality</span>
                <span className="font-extrabold text-purple-700 font-mono">{Math.round(quality * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.95}
                step={0.05}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-purple-600 h-2 bg-purple-100 rounded-lg cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-2">
                Max Width (px, 0 = keep original)
              </label>
              <input
                type="number"
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
                className="w-full rounded-2xl border border-black/[0.06] bg-white p-3 text-xs font-bold text-[#1E1B24] outline-none focus:border-purple-300 shadow-sm"
              />
            </div>
          </div>

          <div className="pt-2">
            <ProcessButton
              onClick={handleCompress}
              isLoading={isProcessing}
              label="Compress Image"
              loadingLabel="Compressing on device..."
            />
          </div>
        </div>
      )}

      {compressedBlob && (
        <div className="rounded-3xl bg-[#F0FDF4] border border-emerald-100 p-6 sm:p-7 space-y-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              <span className="flex items-center gap-1.5 text-sm font-extrabold text-emerald-950">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>Compression Finished!</span>
              </span>
              <p className="text-xs font-semibold text-emerald-800">
                {originalKb.toFixed(1)} KB → {compressedKb.toFixed(1)} KB
              </p>
            </div>
            {savedPercent > 0 && (
              <span className="rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-black text-white shadow-sm">
                Saved {savedPercent}%
              </span>
            )}
          </div>

          <DownloadResult
            blob={compressedBlob}
            filename={`compressed_${file?.name || 'image.jpg'}`}
            label="Download Compressed Image"
          />
        </div>
      )}
    </div>
  );
}
