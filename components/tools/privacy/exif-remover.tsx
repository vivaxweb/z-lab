'use client';

import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadResult } from '@/components/DownloadResult';
import { loadImage } from '@/lib/canvas-utils';

export function ExifRemoverTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [cleanedBlob, setCleanedBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [originalSize, setOriginalSize] = useState<number>(0);

  const handleFile = (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setOriginalSize(selected.size);
    setCleanedBlob(null);

    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);
  };

  const handleStrip = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const img = await loadImage(file);
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas not available');

      // Drawing to canvas strips all EXIF, GPS coordinates, and camera metadata
      ctx.drawImage(img, 0, 0);

      const mimeType = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      canvas.toBlob(
        (blob) => {
          if (blob) {
            setCleanedBlob(blob);
          }
          setIsProcessing(false);
        },
        mimeType,
        0.95
      );
    } catch (err) {
      console.error('Failed to strip metadata', err);
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFile}
        accept="image/jpeg,image/png,image/webp"
        label="Upload a JPEG or PNG photo to sanitize all EXIF and GPS location data"
      />

      {file && previewUrl && (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative h-32 w-32 flex-shrink-0 overflow-hidden rounded-lg border bg-white shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 space-y-1 text-sm">
              <p className="font-semibold text-gray-900">{file.name}</p>
              <p className="text-gray-500">Original Size: {(originalSize / 1024).toFixed(1)} KB</p>
              <p className="text-xs text-amber-700 bg-amber-50 rounded px-2 py-1 inline-block border border-amber-200">
                May contain camera model, exposure settings, and GPS geolocation coordinates.
              </p>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-4">
            <ProcessButton
              onClick={handleStrip}
              isLoading={isProcessing}
              label="Strip EXIF Metadata"
              loadingLabel="Sanitizing image..."
            />
          </div>
        </div>
      )}

      {cleanedBlob && (
        <div className="rounded-xl border border-green-200 bg-green-50/50 p-5 space-y-3">
          <div className="flex items-center gap-2 text-green-800 font-semibold text-sm">
            <ShieldCheck className="h-5 w-5 text-green-600" />
            <span>Metadata successfully removed!</span>
          </div>
          <p className="text-xs text-gray-600">
            GPS coordinates, timestamp, camera serial number, and EXIF tags were permanently erased on your device.
          </p>
          <DownloadResult
            blob={cleanedBlob}
            filename={`clean_${file?.name || 'sanitized.jpg'}`}
            label="Download Sanitized Photo"
          />
        </div>
      )}
    </div>
  );
}
