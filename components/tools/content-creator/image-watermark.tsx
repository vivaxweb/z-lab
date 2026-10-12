'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { DownloadResult } from '@/components/DownloadResult';
import { loadImage } from '@/lib/canvas-utils';

type WatermarkPosition = 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left' | 'center';

export function ImageWatermarkTool() {
  const [file, setFile] = useState<File | null>(null);
  const [watermarkText, setWatermarkText] = useState<string>('© Z Lab');
  const [position, setPosition] = useState<WatermarkPosition>('bottom-right');
  const [fontSize, setFontSize] = useState<number>(36);
  const [opacity, setOpacity] = useState<number>(0.6);
  const [color, setColor] = useState<string>('#ffffff');
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

      // Draw base image
      ctx.drawImage(img, 0, 0);

      if (watermarkText.trim()) {
        ctx.save();
        ctx.font = `bold ${fontSize}px sans-serif`;
        ctx.globalAlpha = opacity;
        ctx.fillStyle = color;
        ctx.shadowColor = 'rgba(0,0,0,0.5)';
        ctx.shadowBlur = 4;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;

        const padding = 30;
        let x = canvas.width - padding;
        let y = canvas.height - padding;

        if (position === 'bottom-right') {
          ctx.textAlign = 'right';
          ctx.textBaseline = 'bottom';
          x = canvas.width - padding;
          y = canvas.height - padding;
        } else if (position === 'bottom-left') {
          ctx.textAlign = 'left';
          ctx.textBaseline = 'bottom';
          x = padding;
          y = canvas.height - padding;
        } else if (position === 'top-right') {
          ctx.textAlign = 'right';
          ctx.textBaseline = 'top';
          x = canvas.width - padding;
          y = padding;
        } else if (position === 'top-left') {
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          x = padding;
          y = padding;
        } else if (position === 'center') {
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          x = canvas.width / 2;
          y = canvas.height / 2;
        }

        ctx.fillText(watermarkText, x, y);
        ctx.restore();
      }

      canvas.toBlob((blob) => {
        if (active && blob) setResultBlob(blob);
      }, 'image/jpeg', 0.95);
    });

    return () => {
      active = false;
    };
  }, [file, watermarkText, position, fontSize, opacity, color]);

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFiles}
        accept="image/*"
        label="Upload photo to add a copyright watermark"
      />

      {file && (
        <div className="space-y-6">
          {/* Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Watermark Text</label>
              <input
                type="text"
                value={watermarkText}
                onChange={(e) => setWatermarkText(e.target.value)}
                placeholder="© Your Name"
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Position</label>
              <select
                value={position}
                onChange={(e) => setPosition(e.target.value as WatermarkPosition)}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs outline-none"
              >
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
                <option value="top-right">Top Right</option>
                <option value="top-left">Top Left</option>
                <option value="center">Center</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Font Size</span>
                <span>{fontSize}px</span>
              </div>
              <input
                type="range"
                min={16}
                max={90}
                value={fontSize}
                onChange={(e) => setFontSize(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded cursor-pointer mt-1"
              />
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Opacity</span>
                <span>{Math.round(opacity * 100)}%</span>
              </div>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.05}
                value={opacity}
                onChange={(e) => setOpacity(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded cursor-pointer mt-1"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-8 w-12 cursor-pointer rounded border p-0.5"
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
                filename="watermarked.jpg"
                label="Download Watermarked Image"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
