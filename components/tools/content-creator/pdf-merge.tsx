'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadResult } from '@/components/DownloadResult';
import { mergePdfs } from '@/lib/pdf-utils';
import { FileText, Trash2, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react';

export function PdfMergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setResultBlob(null);
    setError(null);
  };

  const removeFile = (idx: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== idx));
    setResultBlob(null);
  };

  const moveFile = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= files.length) return;
    const updated = [...files];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFiles(updated);
    setResultBlob(null);
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    setError(null);
    try {
      const buffers = await Promise.all(files.map((f) => f.arrayBuffer()));
      const mergedBytes = await mergePdfs(buffers);
      const blob = new Blob([mergedBytes as BlobPart], { type: 'application/pdf' });
      setResultBlob(blob);
    } catch (err: unknown) {
      console.error('Error merging PDFs:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Could not merge documents. Ensure all files are valid and not password-locked.'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFiles}
        multiple={true}
        accept=".pdf,application/pdf"
        label="Upload two or more PDF files to combine together"
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-5 rounded-3xl bg-[#FAF7FD] border border-purple-100/60 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100/60 text-xs">
            <span className="font-bold text-[#1E1B24]">
              Documents to Merge ({files.length} PDFs)
            </span>
            <button
              type="button"
              onClick={() => {
                setFiles([]);
                setResultBlob(null);
              }}
              className="text-red-600 font-bold hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {files.map((f, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl bg-white border border-black/[0.05] p-3 text-xs shadow-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FileText className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <span className="font-extrabold text-neutral-400">#{idx + 1}</span>
                  <span className="font-bold text-[#1E1B24] truncate max-w-xs">{f.name}</span>
                  <span className="text-[10px] text-neutral-400">({(f.size / 1024).toFixed(0)} KB)</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveFile(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-neutral-400 hover:text-neutral-800 disabled:opacity-20"
                    title="Move up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFile(idx, 'down')}
                    disabled={idx === files.length - 1}
                    className="p-1 text-neutral-400 hover:text-neutral-800 disabled:opacity-20"
                    title="Move down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-1 text-neutral-400 hover:text-red-600 ml-1"
                    title="Remove"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <ProcessButton
            onClick={handleMerge}
            isLoading={isProcessing}
            disabled={files.length < 2}
            label={files.length < 2 ? 'Add at least 2 PDFs' : `Merge ${files.length} PDFs`}
            loadingLabel="Merging PDFs in browser..."
          />
        </div>
      )}

      {resultBlob && (
        <div className="rounded-3xl bg-[#F0FDF4] border border-emerald-100 p-6 sm:p-7 space-y-4 shadow-sm">
          <p className="text-sm font-extrabold text-emerald-950">PDFs merged successfully!</p>
          <DownloadResult
            blob={resultBlob}
            filename="merged_document.pdf"
            label="Download Merged PDF"
          />
        </div>
      )}
    </div>
  );
}
