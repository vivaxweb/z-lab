'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadResult } from '@/components/DownloadResult';
import { reorderPdfPages, getPdfPageCount } from '@/lib/pdf-utils';
import { FileText, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';

export function PdfReorderTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageOrder, setPageOrder] = useState<number[]>([]); // 0-indexed original page indexes
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setResultBlob(null);
    setError(null);

    try {
      const buffer = await selected.arrayBuffer();
      const count = await getPdfPageCount(buffer);
      setPageOrder(Array.from({ length: count }, (_, i) => i));
    } catch (err: unknown) {
      console.error('Failed to read PDF page count:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Could not inspect PDF. Document may be password-protected or corrupt.'
      );
    }
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= pageOrder.length) return;
    const updated = [...pageOrder];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setPageOrder(updated);
    setResultBlob(null);
  };

  const handleReorder = async () => {
    if (!file || pageOrder.length === 0) return;
    setIsProcessing(true);
    setError(null);
    try {
      const buffer = await file.arrayBuffer();
      const reorderedBytes = await reorderPdfPages(buffer, pageOrder);
      const blob = new Blob([reorderedBytes as BlobPart], { type: 'application/pdf' });
      setResultBlob(blob);
    } catch (err: unknown) {
      console.error('Error reordering PDF:', err);
      setError(err instanceof Error ? err.message : 'Error rebuilding reordered PDF.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFile}
        accept=".pdf,application/pdf"
        label="Upload a PDF to reorder page sequence"
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {file && pageOrder.length > 0 && (
        <div className="space-y-5 rounded-3xl bg-[#FAF7FD] border border-purple-100/60 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100/60 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#1E1B24]">
              <FileText className="h-4 w-4 text-red-600" />
              <span className="truncate max-w-xs">{file.name}</span>
            </div>
            <span className="rounded-full bg-white px-3 py-1 font-mono font-bold text-neutral-600 shadow-sm border border-black/[0.04]">
              {pageOrder.length} Pages
            </span>
          </div>

          <p className="text-xs font-bold text-neutral-500">
            Use the arrows to adjust page positions:
          </p>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {pageOrder.map((origIdx, currentPosition) => (
              <div
                key={currentPosition}
                className="flex items-center justify-between rounded-2xl bg-white border border-black/[0.05] p-3 text-xs shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-purple-700 w-8">#{currentPosition + 1}</span>
                  <span className="font-bold text-[#1E1B24]">Original Page {origIdx + 1}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => movePage(currentPosition, 'up')}
                    disabled={currentPosition === 0}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 disabled:opacity-20"
                    title="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => movePage(currentPosition, 'down')}
                    disabled={currentPosition === pageOrder.length - 1}
                    className="p-1.5 rounded-lg text-neutral-400 hover:text-neutral-800 hover:bg-neutral-100 disabled:opacity-20"
                    title="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <ProcessButton
            onClick={handleReorder}
            isLoading={isProcessing}
            label="Save Reordered PDF"
            loadingLabel="Rebuilding PDF structure..."
          />
        </div>
      )}

      {resultBlob && (
        <div className="rounded-3xl bg-[#F0FDF4] border border-emerald-100 p-6 sm:p-7 space-y-4 shadow-sm">
          <p className="text-sm font-extrabold text-emerald-950">Reordered PDF ready!</p>
          <DownloadResult
            blob={resultBlob}
            filename={`reordered_${file?.name || 'document.pdf'}`}
            label="Download Reordered PDF"
          />
        </div>
      )}
    </div>
  );
}
