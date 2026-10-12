'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadResult } from '@/components/DownloadResult';
import { compressPdf, CompressPdfResult } from '@/lib/pdf-utils';
import { FileText, CheckCircle2, AlertTriangle, Sparkles, Layers } from 'lucide-react';

export function PdfCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [level, setLevel] = useState<'balanced' | 'extreme' | 'light'>('balanced');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [compressResult, setCompressResult] = useState<CompressPdfResult | null>(null);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    setResultBlob(null);
    setCompressResult(null);
    setError(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      const res = await compressPdf(buffer, { level });
      setCompressResult(res);
      const blob = new Blob([res.bytes as BlobPart], { type: 'application/pdf' });
      setResultBlob(blob);
    } catch (err: unknown) {
      console.error('Error compressing PDF:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Could not compress this PDF. The document may be password-protected or corrupt.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) {
      return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    }
    return `${(bytes / 1024).toFixed(1)} KB`;
  };

  const originalSizeLabel = file ? formatSize(file.size) : '0 KB';
  const compressedSizeLabel = compressResult ? formatSize(compressResult.compressedSize) : '0 KB';

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFile}
        accept=".pdf,application/pdf"
        label="Upload a PDF file to compress images and optimize structure"
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {file && (
        <div className="space-y-6 rounded-3xl bg-[#FAF7FD] border border-purple-100/60 p-6 sm:p-7 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-purple-100/60 text-xs">
            <span className="flex items-center gap-2 font-bold text-[#1E1B24]">
              <FileText className="h-4 w-4 text-red-600" />
              <span className="truncate max-w-xs">{file.name}</span>
            </span>
            <span className="rounded-full bg-white px-3 py-1 font-mono font-bold text-neutral-600 shadow-sm border border-black/[0.04]">
              Original: {originalSizeLabel}
            </span>
          </div>

          {/* Compression Level Selector */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              <span>Compression Level</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setLevel('balanced')}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  level === 'balanced'
                    ? 'border-purple-600 bg-white shadow-sm ring-2 ring-purple-100'
                    : 'border-black/[0.06] bg-white hover:bg-neutral-50'
                }`}
              >
                <div className="font-extrabold text-xs text-[#1E1B24]">Balanced (Recommended)</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Optimal quality with ~50-70% file size reduction.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLevel('extreme')}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  level === 'extreme'
                    ? 'border-purple-600 bg-white shadow-sm ring-2 ring-purple-100'
                    : 'border-black/[0.06] bg-white hover:bg-neutral-50'
                }`}
              >
                <div className="font-extrabold text-xs text-[#1E1B24]">Extreme Compression</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  Smallest possible file size for email & web uploads.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setLevel('light')}
                className={`p-3 rounded-2xl text-left border transition-all ${
                  level === 'light'
                    ? 'border-purple-600 bg-white shadow-sm ring-2 ring-purple-100'
                    : 'border-black/[0.06] bg-white hover:bg-neutral-50'
                }`}
              >
                <div className="font-extrabold text-xs text-[#1E1B24]">Light Compression</div>
                <div className="text-[11px] text-neutral-500 mt-0.5">
                  High print quality while stripping excess metadata.
                </div>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 bg-white p-3 rounded-2xl border border-black/[0.04]">
            <Layers className="h-4 w-4 text-purple-600 shrink-0" />
            <span>
              All PDF streams, objects, and embedded images are compressed directly on your device. Zero data is uploaded to any server.
            </span>
          </div>

          <ProcessButton
            onClick={handleCompress}
            isLoading={isProcessing}
            label="Optimize & Compress PDF"
            loadingLabel="Compressing PDF on device..."
          />
        </div>
      )}

      {compressResult && resultBlob && (
        <div className="space-y-4">
          {!compressResult.isSmaller ? (
            <div className="rounded-3xl bg-amber-50/80 border border-amber-200 p-5 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <CheckCircle2 className="h-4 w-4 text-amber-600" />
                <span>PDF is Already Fully Optimized</span>
              </div>
              <p className="leading-relaxed">
                This document ({originalSizeLabel}) is already heavily compressed. We kept your original file intact so it doesn&apos;t lose quality or increase in size.
              </p>
              <DownloadResult
                blob={resultBlob}
                filename={`optimized_${file?.name || 'document.pdf'}`}
                label="Download Optimized PDF"
              />
            </div>
          ) : (
            <div className="rounded-3xl bg-[#F0FDF4] border border-emerald-100 p-6 sm:p-7 space-y-4 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="flex items-center gap-1.5 text-sm font-extrabold text-emerald-950">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>PDF Compression Complete!</span>
                  </span>
                  <p className="text-xs font-semibold text-emerald-800">
                    {originalSizeLabel} → {compressedSizeLabel}
                    {compressResult.imageCount > 0 && (
                      <span className="ml-1 text-[11px] font-normal text-emerald-600">
                        ({compressResult.imageCount} image{compressResult.imageCount === 1 ? '' : 's'} compressed)
                      </span>
                    )}
                  </p>
                </div>
                {compressResult.savedPercent > 0 && (
                  <span className="rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-black text-white shadow-sm">
                    Saved {compressResult.savedPercent}%
                  </span>
                )}
              </div>

              <DownloadResult
                blob={resultBlob}
                filename={`compressed_${file?.name || 'document.pdf'}`}
                label="Download Compressed PDF"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
