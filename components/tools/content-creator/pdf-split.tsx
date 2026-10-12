'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadResult } from '@/components/DownloadResult';
import { extractPageRange, getPdfPageCount } from '@/lib/pdf-utils';
import { FileText } from 'lucide-react';

export function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);

  const handleFile = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setResultBlob(null);

    const buffer = await selected.arrayBuffer();
    const count = await getPdfPageCount(buffer);
    setPageCount(count);
    setStartPage(1);
    setEndPage(count);
  };

  const handleExtract = async () => {
    if (!file || startPage < 1 || endPage > pageCount || startPage > endPage) return;
    setIsProcessing(true);
    try {
      const buffer = await file.arrayBuffer();
      const extractedBytes = await extractPageRange(buffer, startPage, endPage);
      const blob = new Blob([extractedBytes.buffer as ArrayBuffer], { type: 'application/pdf' });
      setResultBlob(blob);
    } catch (err) {
      console.error('Error extracting PDF pages', err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFile}
        accept=".pdf,application/pdf"
        label="Upload a PDF to split and extract specific pages"
      />

      {file && pageCount > 0 && (
        <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-5">
          <div className="flex items-center gap-2 text-sm text-gray-800 font-semibold">
            <FileText className="h-5 w-5 text-red-600" />
            <span>{file.name}</span>
            <span className="text-xs font-normal text-gray-500">({pageCount} total pages)</span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">From Page</label>
              <input
                type="number"
                min={1}
                max={pageCount}
                value={startPage}
                onChange={(e) => setStartPage(Math.max(1, Math.min(pageCount, Number(e.target.value))))}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">To Page</label>
              <input
                type="number"
                min={startPage}
                max={pageCount}
                value={endPage}
                onChange={(e) => setEndPage(Math.max(startPage, Math.min(pageCount, Number(e.target.value))))}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-sm outline-none"
              />
            </div>
          </div>

          <ProcessButton
            onClick={handleExtract}
            isLoading={isProcessing}
            label={`Extract Pages ${startPage} - ${endPage}`}
            loadingLabel="Extracting pages in browser..."
          />
        </div>
      )}

      {resultBlob && (
        <div className="rounded-xl border border-green-200 bg-green-50/60 p-5 space-y-3">
          <p className="text-sm font-semibold text-green-900">Extracted PDF ready!</p>
          <DownloadResult
            blob={resultBlob}
            filename={`pages_${startPage}_to_${endPage}_${file?.name || 'document.pdf'}`}
            label="Download Extracted PDF"
          />
        </div>
      )}
    </div>
  );
}
