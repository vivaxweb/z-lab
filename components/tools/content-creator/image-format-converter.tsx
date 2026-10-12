'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadResult } from '@/components/DownloadResult';
import { loadImage, canvasToBlob, ImageOutputFormat } from '@/lib/canvas-utils';
import { Image as ImageIcon, ArrowRight, CheckCircle2, Sliders } from 'lucide-react';

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

interface TargetFormatOption {
  value: ImageOutputFormat;
  label: string;
  ext: string;
  desc: string;
}

const FORMAT_OPTIONS: TargetFormatOption[] = [
  { value: 'image/webp', label: 'WebP', ext: 'webp', desc: 'Modern high-compression web format (smallest file size)' },
  { value: 'image/png', label: 'PNG', ext: 'png', desc: 'Lossless format preserving crisp graphics & transparency' },
  { value: 'image/jpeg', label: 'JPG / JPEG', ext: 'jpg', desc: 'Universally compatible photographic format' },
];

export function ImageFormatConverterTool() {
  const [file, setFile] = useState<File | null>(null);
  const [targetFormat, setTargetFormat] = useState<ImageOutputFormat>('image/webp');
  const [quality, setQuality] = useState<number>(0.85); // 0.1 to 1.0
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setResultBlob(null);

    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
  };

  const handleConvert = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const img = await loadImage(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not get canvas context');

      // If target is JPEG and original had alpha/transparency, fill white background
      if (targetFormat === 'image/jpeg') {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const blob = await canvasToBlob(canvas, targetFormat, quality);
      setResultBlob(blob);
    } catch (err) {
      console.error('Image conversion error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const selectedOpt = FORMAT_OPTIONS.find((f) => f.value === targetFormat) || FORMAT_OPTIONS[0];
  const targetExtension = selectedOpt.ext;
  const newFilename = file ? `${file.name.replace(/\.[^/.]+$/, '')}.${targetExtension}` : `converted.${targetExtension}`;

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFiles}
        accept="image/*"
        label="Upload an image to convert format (PNG, JPG, WebP, SVG, BMP)"
      />

      {file && (
        <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-3">
              {previewUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded-xl border border-gray-200 dark:border-gray-700 shrink-0"
                />
              )}
              <div className="truncate">
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-xs sm:max-w-md">
                  {file.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Original: {formatBytes(file.size)} • {file.type || 'image'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto text-xs font-semibold px-3 py-1.5 rounded-full bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300">
              <span>{file.name.split('.').pop()?.toUpperCase() || 'SRC'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
              <span>{selectedOpt.label}</span>
            </div>
          </div>

          {/* Configuration controls */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-xs font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-violet-600" />
                Target Output Format
              </label>
              <div className="space-y-2">
                {FORMAT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => {
                      setTargetFormat(opt.value);
                      setResultBlob(null);
                    }}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-start justify-between ${
                      targetFormat === opt.value
                        ? 'border-violet-600 bg-violet-50/60 dark:bg-violet-950/40 text-violet-950 dark:text-violet-200 shadow-2xs'
                        : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-850 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div>
                      <div className="font-bold flex items-center gap-1.5">
                        {opt.label}
                        <span className="text-[10px] font-mono opacity-70">.{opt.ext}</span>
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">
                        {opt.desc}
                      </div>
                    </div>
                    {targetFormat === opt.value && (
                      <div className="w-2 h-2 rounded-full bg-violet-600 mt-1 shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-700 dark:text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-violet-600" />
                    Compression Quality: {Math.round(quality * 100)}%
                  </span>
                  <span className="text-gray-400 font-normal">
                    {targetFormat === 'image/png' ? '(PNG is lossless)' : quality > 0.8 ? 'High' : quality > 0.5 ? 'Balanced' : 'High Compression'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.05"
                  disabled={targetFormat === 'image/png'}
                  value={quality}
                  onChange={(e) => {
                    setQuality(parseFloat(e.target.value));
                    setResultBlob(null);
                  }}
                  className="w-full accent-violet-600 h-2 bg-gray-200 rounded-lg cursor-pointer dark:bg-gray-700 disabled:opacity-40"
                />
                <div className="flex justify-between text-[11px] text-gray-400">
                  <span>Smallest File (10%)</span>
                  <span>Default (85%)</span>
                  <span>Maximum (100%)</span>
                </div>
              </div>

              <div className="p-4 bg-gray-50 dark:bg-gray-800/40 rounded-xl border border-gray-100 dark:border-gray-800 text-xs text-gray-600 dark:text-gray-400 space-y-1">
                <p className="font-semibold text-gray-800 dark:text-gray-200">
                  Format Guide:
                </p>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  <li><strong>WebP:</strong> Up to 35% smaller than JPEG with identical visual quality.</li>
                  <li><strong>PNG:</strong> Best for logos, screenshots, and graphics requiring transparent backgrounds.</li>
                  <li><strong>JPEG:</strong> Best for photos and general web compatibility across older devices.</li>
                </ul>
              </div>

              <ProcessButton
                onClick={handleConvert}
                isLoading={isProcessing}
                label={`Convert to ${selectedOpt.label}`}
                className="w-full"
              />
            </div>
          </div>
        </div>
      )}

      {resultBlob && file && (
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Conversion successful!</span>
            </div>
            <div className="font-mono text-emerald-700 dark:text-emerald-400">
              {formatBytes(file.size)} &rarr; {formatBytes(resultBlob.size)}{' '}
              {resultBlob.size < file.size ? (
                <span className="font-bold text-emerald-600">
                  ({Math.round(((file.size - resultBlob.size) / file.size) * 100)}% smaller)
                </span>
              ) : null}
            </div>
          </div>

          <DownloadResult
            blob={resultBlob}
            filename={newFilename}
          />
        </div>
      )}
    </div>
  );
}
