'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadResult } from '@/components/DownloadResult';
import { imagesToPdf } from '@/lib/pdf-utils';
import { FileImage, Trash2 } from 'lucide-react';

export function ImageToPdfTool() {
  const [files, setFiles] = useState<File[]>([]);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFiles = (newFiles: File[]) => {
    setFiles((prev) => [...prev, ...newFiles]);
    setResultBlob(null);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    setResultBlob(null);
  };

  const handleConvert = async () => {
    if (files.length === 0) return;
    setIsProcessing(true);
    try {
      const pdfBytes = await imagesToPdf(files);
      const blob = new Blob([pdfBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResultBlob(blob);
    } catch (err) {
      console.error('Error converting images to PDF', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFiles}
        multiple={true}
        accept="image/jpeg,image/png"
        label="Select JPEG or PNG images to assemble into a multi-page PDF"
      />

      {files.length > 0 && (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="flex items-center justify-between text-xs text-gray-700">
            <span>Pages ({files.length} images)</span>
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

          <div className="space-y-2 max-h-60 overflow-y-auto">
            {files.map((file, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-lg bg-white border border-gray-200 p-2.5 text-xs text-gray-800"
              >
                <div className="flex items-center gap-2 truncate">
                  <FileImage className="h-4 w-4 text-blue-600 flex-shrink-0" />
                  <span className="font-semibold text-gray-500">Page {idx + 1}:</span>
                  <span className="truncate">{file.name}</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="text-gray-400 hover:text-red-600 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>

          <ProcessButton
            onClick={handleConvert}
            isLoading={isProcessing}
            label={`Generate PDF (${files.length} Pages)`}
            loadingLabel="Compiling PDF in browser..."
          />
        </div>
      )}

      {resultBlob && (
        <div className="rounded-xl border border-green-200 bg-green-50/60 p-5 space-y-3">
          <p className="text-sm font-semibold text-green-900">PDF successfully created!</p>
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
