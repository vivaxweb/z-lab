'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadResult } from '@/components/DownloadResult';
import { imagesToPdf } from '@/lib/pdf-utils';
import { FileImage, Trash2, ArrowUp, ArrowDown, AlertTriangle, Settings2 } from 'lucide-react';

export function ImageToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [pageSize, setPageSize] = useState<'fit' | 'a4'>('a4');
  const [orientation, setOrientation] = useState<'auto' | 'portrait' | 'landscape'>('auto');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setResultBlob(null);
    setError(null);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResultBlob(null);
  };

  const moveFile = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= files.length) return;
    const updated = [...files];
    const temp = updated[index];
    updated[index] = updated[targetIdx];
    updated[targetIdx] = temp;
    setFiles(updated);
    setResultBlob(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    setError(null);
    try {
      const pdfBytes = await imagesToPdf(files, { pageSize, orientation });
      const blob = new Blob([pdfBytes as BlobPart], { type: 'application/pdf' });
      setResultBlob(blob);
    } catch (err: unknown) {
      console.error('Error converting images to PDF:', err);
      setError(err instanceof Error ? err.message : 'Failed to generate PDF from images.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFiles}
        multiple={true}
        accept="image/jpeg,image/png,image/webp,image/avif,image/gif"
        label="Select JPG, PNG, or WebP images to compile into a multi-page PDF"
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-5 rounded-3xl bg-[#FAF7FD] border border-purple-100/60 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between text-xs pb-3 border-b border-purple-100/60">
            <span className="font-bold text-[#1E1B24]">
              Pages to Compile ({files.length} {files.length === 1 ? 'image' : 'images'})
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

          {/* Page Layout Settings */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-2 flex items-center gap-1.5">
                <Settings2 className="h-3.5 w-3.5 text-purple-600" />
                <span>Page Size Layout</span>
              </label>
              <select
                value={pageSize}
                onChange={(e) => setPageSize(e.target.value as 'fit' | 'a4')}
                className="w-full rounded-2xl border border-black/[0.06] bg-white p-3 text-xs font-bold text-[#1E1B24] outline-none shadow-sm focus:border-purple-300"
              >
                <option value="a4">Standard A4 Document (Centered with margins)</option>
                <option value="fit">Match Original Photo Dimensions</option>
              </select>
            </div>

            {pageSize === 'a4' && (
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-2">
                  Page Orientation
                </label>
                <select
                  value={orientation}
                  onChange={(e) => setOrientation(e.target.value as 'auto' | 'portrait' | 'landscape')}
                  className="w-full rounded-2xl border border-black/[0.06] bg-white p-3 text-xs font-bold text-[#1E1B24] outline-none shadow-sm focus:border-purple-300"
                >
                  <option value="auto">Auto (Match photo orientation)</option>
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            )}
          </div>

          {/* File list with reordering */}
          <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-2xl bg-white border border-black/[0.05] p-3 text-xs shadow-xs"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FileImage className="h-4 w-4 text-purple-600 flex-shrink-0" />
                  <span className="font-extrabold text-neutral-400">#{idx + 1}</span>
                  <span className="font-bold text-[#1E1B24] truncate max-w-xs">{file.name}</span>
                  <span className="text-[10px] text-neutral-400">({(file.size / 1024).toFixed(0)} KB)</span>
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
                    title="Remove page"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <ProcessButton
            onClick={handleConvert}
            isLoading={isProcessing}
            label={`Generate PDF (${files.length} Pages)`}
            loadingLabel="Compiling PDF on device..."
          />
        </div>
      )}

      {resultBlob && (
        <div className="rounded-3xl bg-[#F0FDF4] border border-emerald-100 p-6 sm:p-7 space-y-4 shadow-sm">
          <p className="text-sm font-extrabold text-emerald-950">PDF Document Ready!</p>
          <DownloadResult
            blob={resultBlob}
            filename="images_document.pdf"
            label="Download PDF Document"
          />
        </div>
      )}
    </div>
  );
}
