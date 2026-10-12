'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadResult } from '@/components/DownloadResult';
import { compressPdf } from '@/lib/pdf-utils';
import { FileText } from 'lucide-react';

export function PdfCompressorTool() {
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFile = (files: File[]) => {
    if (files.length === 0) return;
    setFile(files[0]);
    setResultBlob(null);
  };

  const handleCompress = async () => {
    if (!file) return;
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const compressedBytes = await compressPdf(buffer);
      const blob = new Blob([compressedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResultBlob(blob);
    } catch (err) {
      console.error('Error compressing PDF', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const originalKb = file ? file.size / 1024 : 0;
  const compressedKb = resultBlob ? resultBlob.size / 1024 : 0;

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFile}
        accept=".pdf,application/pdf"
        label="Upload a PDF file to compress and optimize structure"
      />

      {file && (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-red-600" />
              <span className="font-semibold text-gray-800">{file.name}</span>
            </div>
            <span className="text-xs text-gray-500">
              Original: <strong>{originalKb.toFixed(1)} KB</strong>
            </span>
          </div>

          <p className="text-xs text-gray-500">
            Compresses internal object streams and strips unnecessary document metadata without uploading to any server.
          </p>

          <ProcessButton
            onClick={handleCompress}
            isLoading={isProcessing}
            label="Optimize & Compress PDF"
            loadingLabel="Compressing PDF in browser..."
          />
        </div>
      )}

      {resultBlob && (
        <div className="rounded-xl border border-green-200 bg-green-50/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-green-900">PDF Optimization Complete!</span>
            <span className="text-xs text-gray-500">
              {originalKb.toFixed(1)} KB → {compressedKb.toFixed(1)} KB
            </span>
          </div>
          <DownloadResult
            blob={resultBlob}
            filename={`compressed_${file?.name || 'document.pdf'}`}
            label="Download Compressed PDF"
          />
        </div>
      )}
    </div>
  );
}
