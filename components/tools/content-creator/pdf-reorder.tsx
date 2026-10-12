'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadResult } from '@/components/DownloadResult';
import { reorderPdfPages, getPdfPageCount } from '@/lib/pdf-utils';
import { FileText, ArrowUp, ArrowDown } from 'lucide-react';

export function PdfReorderTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageOrder, setPageOrder] = useState<number[]>([]); // 0-indexed original page indexes
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFile = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setResultBlob(null);

    const buffer = await selected.arrayBuffer();
    const count = await getPdfPageCount(buffer);
    setPageOrder(Array.from({ length: count }, (_, i) => i));
  };

  const movePage = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= pageOrder.length) return;
    const updated = [...pageOrder];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setPageOrder(updated);
  };

  const handleReorder = async () => {
    if (!file || pageOrder.length === 0) return;
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const reorderedBytes = await reorderPdfPages(buffer, pageOrder);
      const blob = new Blob([reorderedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResultBlob(blob);
    } catch (err) {
      console.error('Error reordering PDF', err);
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

      {file && pageOrder.length > 0 && (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-center gap-2 text-sm text-gray-800 font-semibold">
            <FileText className="h-5 w-5 text-red-600" />
            <span>{file.name}</span>
            <span className="text-xs font-normal text-gray-500">({pageOrder.length} pages)</span>
          </div>

          <p className="text-xs text-gray-600">
            Arrange pages in your preferred order:
          </p>

          <div className="space-y-1.5 max-h-72 overflow-y-auto">
            {pageOrder.map((origIdx, currentPosition) => (
              <div
                key={currentPosition}
                className="flex items-center justify-between rounded-lg bg-white border border-gray-200 p-2.5 text-xs text-gray-800"
              >
                <div className="flex items-center gap-3">
                  <span className="font-bold text-blue-600 w-6">#{currentPosition + 1}</span>
                  <span className="font-medium text-gray-700">Original Page {origIdx + 1}</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => movePage(currentPosition, 'up')}
                    disabled={currentPosition === 0}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => movePage(currentPosition, 'down')}
                    disabled={currentPosition === pageOrder.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20"
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
        <div className="rounded-xl border border-green-200 bg-green-50/60 p-5 space-y-3">
          <p className="text-sm font-semibold text-green-900">Reordered PDF ready!</p>
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
