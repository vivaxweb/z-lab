'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadResult } from '@/components/DownloadResult';
import { mergePdfs } from '@/lib/pdf-utils';
import { FileText, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export function PdfMergeTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setResultBlob(null);
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
  };

  const handleMerge = async () => {
    if (files.length < 2) return;
    setIsProcessing(true);
    try {
      const buffers = await Promise.all(files.map((f) => f.arrayBuffer()));
      const mergedBytes = await mergePdfs(buffers);
      const blob = new Blob([mergedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResultBlob(blob);
    } catch (err) {
      console.error('Error merging PDFs', err);
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

      {files.length > 0 && (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between text-xs text-gray-700">
            <span>Documents to Merge ({files.length} PDFs)</span>
            <button
              type="button"
              onClick={() => {
                setFiles([]);
                setResultBlob(null);
              }}
              className="text-red-600 hover:underline"
            >
              Clear All
            </button>
          </div>

          <div className="space-y-2">
            {files.map((f, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg bg-white border border-gray-200 p-2.5 text-xs text-gray-800"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileText className="h-4 w-4 text-red-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-400">#{idx + 1}</span>
                  <span className="truncate">{f.name}</span>
                  <span className="text-[10px] text-gray-400">({(f.size / 1024).toFixed(0)} KB)</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => moveFile(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveFile(idx, 'down')}
                    disabled={idx === files.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-700 disabled:opacity-20"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-1 text-gray-400 hover:text-red-600 ml-1"
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
        <div className="rounded-xl border border-green-200 bg-green-50/60 p-5 space-y-3">
          <p className="text-sm font-semibold text-green-900">PDFs merged successfully!</p>
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
