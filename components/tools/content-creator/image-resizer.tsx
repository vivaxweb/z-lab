'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadResult } from '@/components/DownloadResult';
import { resizeImage, loadImage, ImageOutputFormat } from '@/lib/canvas-utils';
import { Lock, Unlock } from 'lucide-react';

export function ImageResizerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [originalWidth, setOriginalWidth] = useState<number>(0);
  const [originalHeight, setOriginalHeight] = useState<number>(0);
  const [targetWidth, setTargetWidth] = useState<number>(0);
  const [targetHeight, setTargetHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [format, setFormat] = useState<ImageOutputFormat>('image/jpeg');
  const [quality, setQuality] = useState<number>(0.9);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setResultBlob(null);

    const img = await loadImage(selected);
    setOriginalWidth(img.naturalWidth);
    setOriginalHeight(img.naturalHeight);
    setTargetWidth(img.naturalWidth);
    setTargetHeight(img.naturalHeight);
  };

  const handleWidthChange = (val: number) => {
    setTargetWidth(val);
    if (lockAspect && originalWidth > 0) {
      const ratio = originalHeight / originalWidth;
      setTargetHeight(Math.round(val * ratio));
    }
  };

  const handleHeightChange = (val: number) => {
    setTargetHeight(val);
    if (lockAspect && originalHeight > 0) {
      const ratio = originalWidth / originalHeight;
      setTargetWidth(Math.round(val * ratio));
    }
  };

  const handleResize = async () => {
    if (!file || targetWidth <= 0 || targetHeight <= 0) return;
    setIsProcessing(true);
    try {
      const blob = await resizeImage(file, {
        width: targetWidth,
        height: targetHeight,
        maintainAspectRatio: lockAspect,
        format,
        quality,
      });
      setResultBlob(blob);
    } catch (err) {
      console.error('Error resizing image', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const extension = format === 'image/png' ? 'png' : format === 'image/webp' ? 'webp' : 'jpg';

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFiles}
        accept="image/*"
        label="Upload an image to resize dimensions in your browser"
      />

      {file && (
        <div className="space-y-5 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="text-xs text-gray-500">
            Original Dimensions: <span className="font-semibold text-gray-800">{originalWidth} × {originalHeight} px</span>
          </div>

          {/* Width / Height inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 items-end">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Width (px)</label>
              <input
                type="number"
                value={targetWidth}
                onChange={(e) => handleWidthChange(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm font-semibold outline-none"
              />
            </div>

            <div className="sm:col-span-1 flex justify-center pb-2">
              <button
                type="button"
                onClick={() => setLockAspect(!lockAspect)}
                className={`p-2 rounded-lg border transition ${
                  lockAspect ? 'bg-blue-50 border-blue-300 text-blue-600' : 'bg-white border-gray-200 text-gray-400'
                }`}
                title={lockAspect ? 'Aspect Ratio Locked' : 'Aspect Ratio Unlocked'}
              >
                {lockAspect ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </button>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Target Height (px)</label>
              <input
                type="number"
                value={targetHeight}
                onChange={(e) => handleHeightChange(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm font-semibold outline-none"
              />
            </div>
          </div>

          {/* Output Format & Quality */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value as ImageOutputFormat)}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs outline-none"
              >
                <option value="image/jpeg">JPEG (.jpg)</option>
                <option value="image/png">PNG (.png)</option>
                <option value="image/webp">WebP (.webp)</option>
              </select>
            </div>

            {format !== 'image/png' && (
              <div>
                <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                  <span>Quality</span>
                  <span>{Math.round(quality * 100)}%</span>
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={quality}
                  onChange={(e) => setQuality(Number(e.target.value))}
                  className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded cursor-pointer mt-2"
                />
              </div>
            )}
          </div>

          <ProcessButton
            onClick={handleResize}
            isLoading={isProcessing}
            label="Resize Image"
            loadingLabel="Resizing in browser..."
          />
        </div>
      )}

      {resultBlob && (
        <div className="rounded-xl border border-green-200 bg-green-50/60 p-5 space-y-3">
          <p className="text-sm font-semibold text-green-900">Image resized successfully!</p>
          <DownloadResult
            blob={resultBlob}
            filename={`resized_${targetWidth}x${targetHeight}.${extension}`}
            label="Download Resized Image"
          />
        </div>
      )}
    </div>
  );
}
