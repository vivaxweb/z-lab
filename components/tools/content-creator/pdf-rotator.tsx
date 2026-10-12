'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadResult } from '@/components/DownloadResult';
import { rotatePdfPages, getPdfPageCount } from '@/lib/pdf-utils';
import { FileText, RotateCw, RotateCcw, RefreshCw, CheckCircle2 } from 'lucide-react';

export function PdfRotatorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [rotations, setRotations] = useState<number[]>([]); // rotation angle in degrees for each page (0, 90, 180, 270)
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFile = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setResultBlob(null);

    try {
      const buffer = await selected.arrayBuffer();
      const count = await getPdfPageCount(buffer);
      setPageCount(count);
      setRotations(new Array(count).fill(0));
    } catch (err) {
      console.error('Failed to read PDF page count', err);
    }
  };

  const rotatePage = (index: number, angleDelta: number) => {
    setRotations((prev) => {
      const updated = [...prev];
      const nextAngle = (updated[index] + angleDelta + 360) % 360;
      updated[index] = nextAngle;
      return updated;
    });
    setResultBlob(null);
  };

  const rotateAll = (angleDelta: number) => {
    setRotations((prev) => prev.map((angle) => (angle + angleDelta + 360) % 360));
    setResultBlob(null);
  };

  const resetAll = () => {
    setRotations(new Array(pageCount).fill(0));
    setResultBlob(null);
  };

  const handleProcess = async () => {
    if (!file || pageCount === 0) return;
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const rotatedBytes = await rotatePdfPages(buffer, rotations);
      const blob = new Blob([rotatedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResultBlob(blob);
    } catch (err) {
      console.error('Failed to rotate PDF', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const hasAnyRotation = rotations.some((r) => r !== 0);

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFile}
        accept=".pdf,application/pdf"
        label="Upload a PDF to permanently rotate pages"
      />

      {file && pageCount > 0 && (
        <div className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-4 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-50 text-red-600 rounded-xl dark:bg-red-950/30 dark:text-red-400">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate max-w-xs sm:max-w-md">
                  {file.name}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {pageCount} {pageCount === 1 ? 'page' : 'pages'} total
                </p>
              </div>
            </div>

            {/* Batch actions */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => rotateAll(90)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
              >
                <RotateCw className="w-3.5 h-3.5" />
                All +90°
              </button>
              <button
                type="button"
                onClick={() => rotateAll(180)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                All 180°
              </button>
              <button
                type="button"
                onClick={() => rotateAll(-90)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                All -90°
              </button>
              {hasAnyRotation && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 hover:underline dark:text-red-400"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Grid of pages */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-[460px] overflow-y-auto p-2">
            {rotations.map((angle, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center justify-between p-3.5 rounded-xl border border-gray-200 bg-gray-50/70 hover:border-violet-300 dark:border-gray-800 dark:bg-gray-800/40 transition"
              >
                <div className="flex items-center justify-between w-full mb-2">
                  <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
                    p. {idx + 1}
                  </span>
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                      angle !== 0
                        ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 font-bold'
                        : 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                    }`}
                  >
                    {angle}°
                  </span>
                </div>

                {/* Visual miniature representation */}
                <div className="my-3 flex items-center justify-center h-20 w-16 bg-white dark:bg-gray-900 rounded border border-gray-300 dark:border-gray-700 shadow-xs relative overflow-hidden transition-transform duration-300">
                  <div
                    className="w-full h-full flex flex-col items-center justify-center p-2 text-gray-400 transition-transform duration-300"
                    style={{ transform: `rotate(${angle}deg)` }}
                  >
                    <div className="w-8 h-1 bg-gray-200 dark:bg-gray-700 rounded mb-1.5" />
                    <div className="w-10 h-1 bg-gray-200 dark:bg-gray-700 rounded mb-1.5" />
                    <div className="w-6 h-1 bg-gray-200 dark:bg-gray-700 rounded" />
                    <span className="text-[9px] font-bold text-gray-500 mt-2 select-none">
                      TOP
                    </span>
                  </div>
                </div>

                {/* Per-page rotation controls */}
                <div className="flex items-center gap-1.5 w-full justify-center">
                  <button
                    type="button"
                    title="Rotate 90° counter-clockwise"
                    onClick={() => rotatePage(idx, -90)}
                    className="p-1.5 rounded-md hover:bg-white text-gray-600 hover:text-gray-900 border border-transparent hover:border-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100 transition shadow-2xs"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    title="Rotate 90° clockwise"
                    onClick={() => rotatePage(idx, 90)}
                    className="p-1.5 rounded-md hover:bg-white text-gray-600 hover:text-gray-900 border border-transparent hover:border-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-100 transition shadow-2xs"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <ProcessButton
              onClick={handleProcess}
              isLoading={isProcessing}
              label="Save Rotated PDF"
              className="w-full sm:w-auto px-8"
            />
            {hasAnyRotation && !resultBlob && (
              <span className="text-xs text-amber-600 dark:text-amber-400">
                You have unsaved rotation changes. Click &quot;Save Rotated PDF&quot; to apply.
              </span>
            )}
          </div>
        </div>
      )}

      {resultBlob && file && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>PDF successfully rotated and ready for download!</span>
          </div>
          <DownloadResult
            blob={resultBlob}
            filename={`${file.name.replace(/\.[^/.]+$/, '')}-rotated.pdf`}
          />
        </div>
      )}
    </div>
  );
}
