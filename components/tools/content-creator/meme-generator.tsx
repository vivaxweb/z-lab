'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { DownloadResult } from '@/components/DownloadResult';
import { loadImage } from '@/lib/canvas-utils';

export function MemeGeneratorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [topText, setTopText] = useState<string>('WHEN THE CODE');
  const [bottomText, setBottomText] = useState<string>('COMPILES ON THE FIRST TRY');
  const [fontSize, setFontSize] = useState<number>(42);
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [strokeColor, setStrokeColor] = useState<string>('#000000');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleFiles = (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
  };

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

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Setup meme typography
      ctx.font = `bold ${fontSize}px Impact, sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillStyle = textColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = Math.max(3, fontSize / 12);
      ctx.lineJoin = 'round';

      // Top text
      if (topText.trim()) {
        ctx.textBaseline = 'top';
        ctx.strokeText(topText.toUpperCase(), canvas.width / 2, 20);
        ctx.fillText(topText.toUpperCase(), canvas.width / 2, 20);
      }

      // Bottom text
      if (bottomText.trim()) {
        ctx.textBaseline = 'bottom';
        ctx.strokeText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
        ctx.fillText(bottomText.toUpperCase(), canvas.width / 2, canvas.height - 20);
      }

      canvas.toBlob((blob) => {
        if (active && blob) setResultBlob(blob);
      }, 'image/jpeg', 0.95);
    });

    return () => {
      active = false;
    };
  }, [file, topText, bottomText, fontSize, textColor, strokeColor]);

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFiles}
        accept="image/*"
        label="Upload any photo to add meme text overlays"
      />

      {file && (
        <div className="space-y-5">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Top Caption</label>
              <input
                type="text"
                value={topText}
                onChange={(e) => setTopText(e.target.value)}
                placeholder="TOP TEXT..."
                className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm font-bold uppercase outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Bottom Caption</label>
              <input
                type="text"
                value={bottomText}
                onChange={(e) => setBottomText(e.target.value)}
                placeholder="BOTTOM TEXT..."
                className="w-full rounded-lg border border-gray-300 bg-white p-2.5 text-sm font-bold uppercase outline-none"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Font Size</span>
                <span>{fontSize}px</span>
              </div>
              <input
                type="range"
                min={20}
                max={90}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded cursor-pointer mt-1"
              />
            </div>

            <div className="flex items-center gap-4 pt-3">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Text Color</label>
                <input
                  type="color"
                  value={textColor}
                  onChange={(e) => setTextColor(e.target.value)}
                  className="h-8 w-12 cursor-pointer rounded border p-0.5"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Stroke Outline</label>
                <input
                  type="color"
                  value={strokeColor}
                  onChange={(e) => setStrokeColor(e.target.value)}
                  className="h-8 w-12 cursor-pointer rounded border p-0.5"
                />
              </div>
            </div>
          </div>

          {/* Live Meme Canvas */}
          <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-gray-50/50 p-4">
            <div className="max-h-[460px] overflow-hidden rounded-xl border bg-white shadow-sm flex items-center justify-center">
              <canvas ref={canvasRef} className="max-h-[440px] max-w-full object-contain" />
            </div>

            {resultBlob && (
              <DownloadResult
                blob={resultBlob}
                filename="meme.jpg"
                label="Download Meme Image"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
