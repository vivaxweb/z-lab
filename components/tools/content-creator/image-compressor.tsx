'use client';

import React, { useState, useEffect } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadResult } from '@/components/DownloadResult';
import { smartCompressImage, ImageOutputFormat, SmartCompressResult } from '@/lib/canvas-utils';
import { Sparkles, FileImage, CheckCircle2, AlertTriangle, ArrowRight, Sliders, Target } from 'lucide-react';

export function ImageCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<'auto' | ImageOutputFormat>('auto');
  const [preset, setPreset] = useState<'smart' | 'high' | 'balanced' | 'light' | 'custom'>('smart');
  const [quality, setQuality] = useState<number>(0.72);
  const [maxWidth, setMaxWidth] = useState<number>(1920);
  const [targetKb, setTargetKb] = useState<string>('');
  const [result, setResult] = useState<SmartCompressResult | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultPreviewUrl, setResultPreviewUrl] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setResult(null);
    setError(null);

    if (previewUrl) URL.revokeObjectURL(previewUrl);
    if (resultPreviewUrl) URL.revokeObjectURL(resultPreviewUrl);
    setResultPreviewUrl(null);

    setPreviewUrl(URL.createObjectURL(selected));
  };

  const handlePresetSelect = (p: 'smart' | 'high' | 'balanced' | 'light') => {
    setPreset(p);
    setTargetKb('');
    if (p === 'smart') {
      setQuality(0.72);
      setFormat('auto');
    } else if (p === 'high') {
      setQuality(0.5);
    } else if (p === 'balanced') {
      setQuality(0.7);
    } else if (p === 'light') {
      setQuality(0.85);
    }
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    setError(null);

    try {
      const parsedTargetKb = targetKb.trim() ? Number(targetKb) : undefined;
      const res = await smartCompressImage(file, {
        quality,
        format,
        maxWidth: maxWidth > 0 ? maxWidth : undefined,
        targetSizeKb: parsedTargetKb && parsedTargetKb > 0 ? parsedTargetKb : undefined,
      });

      setResult(res);
      if (resultPreviewUrl) URL.revokeObjectURL(resultPreviewUrl);
      setResultPreviewUrl(URL.createObjectURL(res.blob));
    } catch (err: unknown) {
      console.error('Error compressing image:', err);
      setError(err instanceof Error ? err.message : 'Failed to compress image.');
    } finally {
      setIsProcessing(false);
    }
  };

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultPreviewUrl) URL.revokeObjectURL(resultPreviewUrl);
    };
  }, [previewUrl, resultPreviewUrl]);

  const originalKb = file ? file.size / 1024 : 0;
  const compressedKb = result ? result.size / 1024 : 0;

  const extMap: Record<string, string> = {
    'image/webp': 'webp',
    'image/jpeg': 'jpg',
    'image/png': 'png',
  };
  const outputExt = result ? extMap[result.format] || 'jpg' : 'jpg';
  const baseName = file ? file.name.replace(/\.[^/.]+$/, '') : 'compressed';
  const downloadFilename = `compressed_${baseName}.${outputExt}`;

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFiles}
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        label="Select or drop a photo to compress file size inside browser memory"
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {file && (
        <div className="space-y-6 rounded-3xl bg-[#FAF7FD] border border-purple-100/60 p-6 sm:p-7 shadow-sm">
          {/* File details banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-purple-100/60 text-xs">
            <span className="flex items-center gap-2 font-bold text-[#1E1B24]">
              <FileImage className="h-4 w-4 text-purple-600" />
              <span className="truncate max-w-xs">{file.name}</span>
            </span>
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-white px-3 py-1 font-mono font-bold text-neutral-600 shadow-sm border border-black/[0.04]">
                Original: {originalKb.toFixed(1)} KB
              </span>
              <span className="rounded-full bg-purple-100/70 px-2.5 py-1 font-semibold text-purple-700 text-[11px]">
                {file.type ? file.type.split('/')[1]?.toUpperCase() : 'IMG'}
              </span>
            </div>
          </div>

          {/* Presets Row */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-purple-600" />
              <span>Compression Preset</span>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handlePresetSelect('smart')}
                className={`py-2 px-3 rounded-2xl text-xs font-extrabold transition-all border ${
                  preset === 'smart'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm scale-102'
                    : 'bg-white text-neutral-700 border-black/[0.06] hover:bg-neutral-50'
                }`}
              >
                Smart Auto ✨
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('balanced')}
                className={`py-2 px-3 rounded-2xl text-xs font-extrabold transition-all border ${
                  preset === 'balanced'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm scale-102'
                    : 'bg-white text-neutral-700 border-black/[0.06] hover:bg-neutral-50'
                }`}
              >
                Balanced (70%)
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('high')}
                className={`py-2 px-3 rounded-2xl text-xs font-extrabold transition-all border ${
                  preset === 'high'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm scale-102'
                    : 'bg-white text-neutral-700 border-black/[0.06] hover:bg-neutral-50'
                }`}
              >
                High Savings (50%)
              </button>
              <button
                type="button"
                onClick={() => handlePresetSelect('light')}
                className={`py-2 px-3 rounded-2xl text-xs font-extrabold transition-all border ${
                  preset === 'light'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-sm scale-102'
                    : 'bg-white text-neutral-700 border-black/[0.06] hover:bg-neutral-50'
                }`}
              >
                Best Quality (85%)
              </button>
            </div>
          </div>

          {/* Advanced options grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
            {/* Output format */}
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-2">
                Output Format
              </label>
              <select
                value={format}
                onChange={(e) => {
                  setFormat(e.target.value as 'auto' | ImageOutputFormat);
                  setPreset('custom');
                }}
                className="w-full rounded-2xl border border-black/[0.06] bg-white p-3 text-xs font-bold text-[#1E1B24] outline-none shadow-sm focus:border-purple-300"
              >
                <option value="auto">Auto (Smallest & Sharpest)</option>
                <option value="image/webp">WebP (.webp - Maximum compression)</option>
                <option value="image/jpeg">JPEG (.jpg - Universal compatibility)</option>
                <option value="image/png">PNG (.png - Lossless)</option>
              </select>
            </div>

            {/* Target KB (optional) */}
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-2 flex items-center justify-between">
                <span className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-purple-600" /> Target Size (KB)
                </span>
                <span className="text-[10px] text-neutral-400 font-normal">Optional</span>
              </label>
              <input
                type="number"
                placeholder="e.g. 50 or 100"
                value={targetKb}
                onChange={(e) => {
                  setTargetKb(e.target.value);
                  setPreset('custom');
                }}
                className="w-full rounded-2xl border border-black/[0.06] bg-white p-3 text-xs font-bold text-[#1E1B24] outline-none shadow-sm focus:border-purple-300"
              />
            </div>

            {/* Max Width */}
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-2">
                Max Width (px, 0 = keep original)
              </label>
              <input
                type="number"
                value={maxWidth}
                onChange={(e) => setMaxWidth(Number(e.target.value))}
                className="w-full rounded-2xl border border-black/[0.06] bg-white p-3 text-xs font-bold text-[#1E1B24] outline-none shadow-sm focus:border-purple-300"
              />
            </div>
          </div>

          {/* Quality Slider (when targetKb is empty) */}
          {!targetKb && (
            <div className="pt-2">
              <div className="flex justify-between text-xs font-bold text-neutral-600 mb-2">
                <span className="flex items-center gap-1.5">
                  <Sliders className="h-3.5 w-3.5 text-purple-600" />
                  Compression Quality
                </span>
                <span className="font-extrabold text-purple-700 font-mono">
                  {Math.round(quality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min={0.1}
                max={0.95}
                step={0.05}
                value={quality}
                onChange={(e) => {
                  setQuality(Number(e.target.value));
                  setPreset('custom');
                }}
                className="w-full accent-purple-600 h-2 bg-purple-100 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-400 font-medium pt-1">
                <span>Smaller size (10%)</span>
                <span>Balanced (70%)</span>
                <span>High quality (95%)</span>
              </div>
            </div>
          )}

          <div className="pt-2">
            <ProcessButton
              onClick={handleCompress}
              isLoading={isProcessing}
              label="Compress Image"
              loadingLabel="Optimizing photo on device..."
            />
          </div>
        </div>
      )}

      {/* Result Card */}
      {result && (
        <div className="space-y-4">
          {result.isLargerThanOriginal ? (
            <div className="rounded-3xl bg-amber-50/80 border border-amber-200 p-5 text-xs text-amber-900 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-800">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <span>Source Image is Already Heavily Compressed</span>
              </div>
              <p className="leading-relaxed">
                The original file is already at minimal size ({originalKb.toFixed(1)} KB). Re-encoding at
                this quality resulted in {compressedKb.toFixed(1)} KB. We recommend choosing a lower quality preset (e.g. 50%)
                or downscaling the image resolution to reduce file size further.
              </p>
            </div>
          ) : (
            <div className="rounded-3xl bg-[#F0FDF4] border border-emerald-100 p-6 sm:p-7 space-y-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="flex items-center gap-1.5 text-sm font-extrabold text-emerald-950">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span>Compression Finished!</span>
                  </span>
                  <p className="text-xs font-semibold text-emerald-800">
                    {originalKb.toFixed(1)} KB → {compressedKb.toFixed(1)} KB
                    {result.wasAdapted && (
                      <span className="ml-1 text-[11px] font-normal text-emerald-600">
                        (optimized for genuine size reduction)
                      </span>
                    )}
                  </p>
                </div>

                {result.savedPercent > 0 && (
                  <span className="rounded-full bg-emerald-600 px-3.5 py-1 text-xs font-black text-white shadow-sm">
                    Saved {result.savedPercent}%
                  </span>
                )}
              </div>

              {/* Preview thumbnails */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                {previewUrl && (
                  <div className="rounded-2xl bg-white p-3 border border-emerald-100 space-y-1.5 text-center">
                    <span className="text-[11px] font-bold text-neutral-500 uppercase">Original</span>
                    <div className="h-36 w-full flex items-center justify-center overflow-hidden rounded-xl bg-neutral-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Original" className="h-full w-full object-contain" />
                    </div>
                    <span className="text-xs font-mono font-bold text-neutral-600 block">
                      {originalKb.toFixed(1)} KB
                    </span>
                  </div>
                )}

                {resultPreviewUrl && (
                  <div className="rounded-2xl bg-white p-3 border border-emerald-200 space-y-1.5 text-center shadow-xs">
                    <span className="text-[11px] font-bold text-emerald-700 uppercase">Compressed ({outputExt.toUpperCase()})</span>
                    <div className="h-36 w-full flex items-center justify-center overflow-hidden rounded-xl bg-neutral-50">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={resultPreviewUrl} alt="Compressed" className="h-full w-full object-contain" />
                    </div>
                    <span className="text-xs font-mono font-bold text-emerald-800 block">
                      {compressedKb.toFixed(1)} KB ({result.width} × {result.height} px)
                    </span>
                  </div>
                )}
              </div>

              <DownloadResult
                blob={result.blob}
                filename={downloadFilename}
                label="Download Compressed Image"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
