'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { DownloadResult } from '@/components/DownloadResult';
import { loadImage } from '@/lib/canvas-utils';

export function ImageFiltersTool() {
  const [file, setFile] = useState<File | null>(null);
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [sepia, setSepia] = useState<number>(0);
  const [blur, setBlur] = useState<number>(0);
  const [invert, setInvert] = useState<number>(0);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
  };

  const filterString = `brightness(${brightness}%) contrast(${contrast}%) grayscale(${grayscale}%) sepia(${sepia}%) blur(${blur}px) invert(${invert}%)`;

  useEffect(() => {
    if (!file || !canvasRef.current) return;
    let active = true;

    loadImage(file).then((img) => {
      if (!active || !canvasRef.current) return;
      const canvas = canvasRef.current;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.filter = filterString;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (active && blob) setResultBlob(blob);
      }, 'image/jpeg', 0.92);
    });

    return () => {
      active = false;
    };
  }, [file, filterString]);

  const applyPreset = (preset: string) => {
    switch (preset) {
      case 'reset':
        setBrightness(100);
        setContrast(100);
        setGrayscale(0);
        setSepia(0);
        setBlur(0);
        setInvert(0);
        break;
      case 'noir':
        setGrayscale(100);
        setContrast(140);
        setBrightness(95);
        setSepia(0);
        setInvert(0);
        break;
      case 'vintage':
        setSepia(60);
        setContrast(90);
        setBrightness(110);
        setGrayscale(0);
        break;
      case 'dramatic':
        setContrast(160);
        setBrightness(90);
        setGrayscale(20);
        break;
    }
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFiles}
        accept="image/*"
        label="Upload photo to apply live filters and effects"
      />

      {file && (
        <div className="space-y-6">
          {/* Preset Buttons */}
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => applyPreset('reset')}
              className="rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Reset Normal
            </button>
            <button
              type="button"
              onClick={() => applyPreset('noir')}
              className="rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Film Noir
            </button>
            <button
              type="button"
              onClick={() => applyPreset('vintage')}
              className="rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Vintage Warm
            </button>
            <button
              type="button"
              onClick={() => applyPreset('dramatic')}
              className="rounded-lg border bg-white px-3 py-1.5 text-xs font-semibold text-gray-700 hover:bg-gray-50"
            >
              Dramatic Contrast
            </button>
          </div>

          {/* Filter Sliders */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4 text-xs font-medium text-gray-700">
            <div>
              <div className="flex justify-between mb-1">
                <span>Brightness</span>
                <span>{brightness}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={200}
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Contrast</span>
                <span>{contrast}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={200}
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Grayscale</span>
                <span>{grayscale}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={grayscale}
                onChange={(e) => setGrayscale(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Sepia</span>
                <span>{sepia}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={sepia}
                onChange={(e) => setSepia(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Blur</span>
                <span>{blur}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={15}
                value={blur}
                onChange={(e) => setBlur(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span>Invert Colors</span>
                <span>{invert}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={invert}
                onChange={(e) => setInvert(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Canvas Live Preview */}
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-gray-50/50 p-4">
            <div className="max-h-[460px] overflow-hidden rounded-xl border bg-white shadow-sm flex items-center justify-center">
              <canvas ref={canvasRef} className="max-h-[440px] max-w-full object-contain" />
            </div>

            {resultBlob && (
              <DownloadResult
                blob={resultBlob}
                filename="filtered_photo.jpg"
                label="Download Filtered Photo"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
