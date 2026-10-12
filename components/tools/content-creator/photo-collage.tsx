'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadResult } from '@/components/DownloadResult';
import { makeCollage } from '@/lib/canvas-utils';

export function PhotoCollageTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [columns, setColumns] = useState<number>(2);
  const [gap, setGap] = useState<number>(8);
  const [cellSize, setCellSize] = useState<number>(400);
  const [collageBlob, setCollageBlob] = useState<Blob | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const handleFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setCollageBlob(null);
  };

  const handleGenerate = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const blob = await makeCollage(files, columns, gap, cellSize);
      setCollageBlob(blob);
    } catch (err) {
      console.error('Error generating collage', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFiles}
        multiple={true}
        accept="image/*"
        label="Drop multiple photos to combine into a photo collage"
      />

      {files.length > 0 && (
        <div className="space-y-5 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-center justify-between text-xs text-gray-700">
            <span>Selected Photos: <strong>{files.length}</strong></span>
            <button
              type="button"
              onClick={() => {
                setFiles([]);
                setCollageBlob(null);
              }}
              className="text-red-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Columns</label>
              <select
                value={columns}
                onChange={(e) => setColumns(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs outline-none"
              >
                <option value={2}>2 Columns</option>
                <option value={3}>3 Columns</option>
                <option value={4}>4 Columns</option>
              </select>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Spacing Gap</span>
                <span>{gap}px</span>
              </div>
              <input
                type="range"
                min={0}
                max={32}
                value={gap}
                onChange={(e) => setGap(Number(e.target.value))}
                className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded cursor-pointer mt-2"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Photo Cell Size (px)</label>
              <input
                type="number"
                min={200}
                max={800}
                step={50}
                value={cellSize}
                onChange={(e) => setCellSize(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs outline-none"
              />
            </div>
          </div>

          <ProcessButton
            onClick={handleGenerate}
            isLoading={isProcessing}
            label={`Create Collage (${files.length} photos)`}
            loadingLabel="Stitching photos together..."
          />
        </div>
      )}

      {collageBlob && (
        <div className="rounded-xl border border-green-200 bg-green-50/60 p-5 space-y-3">
          <p className="text-sm font-semibold text-green-900">Collage ready to download!</p>
          <DownloadResult
            blob={collageBlob}
            filename="collage.jpg"
            label="Download Photo Collage"
          />
        </div>
      )}
    </div>
  );
}
