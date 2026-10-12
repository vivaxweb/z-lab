'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { ProcessButton } from '@/components/ProcessButton';
import { DownloadResult } from '@/components/DownloadResult';
import { extractPageRange, extractSpecificPages, splitPdf, getPdfPageCount } from '@/lib/pdf-utils';
import { downloadBytes } from '@/lib/download-utils';
import { FileText, AlertTriangle, Download } from 'lucide-react';

export function PdfSplitTool() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState<number>(0);
  const [splitMode, setSplitMode] = useState<'range' | 'custom' | 'all'>('range');
  const [startPage, setStartPage] = useState<number>(1);
  const [endPage, setEndPage] = useState<number>(1);
  const [customPages, setCustomPages] = useState<string>('1');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [splitAllPages, setSplitAllPages] = useState<Uint8Array[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFile = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setResultBlob(null);
    setSplitAllPages(null);
    setError(null);

    try {
      const buffer = await selected.arrayBuffer();
      const count = await getPdfPageCount(buffer);
      setPageCount(count);
      setStartPage(1);
      setEndPage(count);
      setCustomPages(count > 1 ? `1, ${count}` : '1');
    } catch (err: unknown) {
      console.error('Failed to read PDF pages:', err);
      setError(
        err instanceof Error
          ? err.message
          : 'Could not read PDF. Document may be encrypted or corrupted.'
      );
    }
  };

  const parseCustomPageList = (input: string, max: number): number[] => {
    const list: number[] = [];
    const parts = input.split(/[,;\s]+/);
    for (const part of parts) {
      if (!part.trim()) continue;
      if (part.includes('-')) {
        const [sStr, eStr] = part.split('-');
        const s = parseInt(sStr, 10);
        const e = parseInt(eStr, 10);
        if (!isNaN(s) && !isNaN(e)) {
          const from = Math.max(1, Math.min(s, e));
          const to = Math.min(max, Math.max(s, e));
          for (let i = from; i <= to; i++) list.push(i);
        }
      } else {
        const n = parseInt(part, 10);
        if (!isNaN(n) && n >= 1 && n <= max) list.push(n);
      }
    }
    return Array.from(new Set(list)).sort((a, b) => a - b);
  };

  const handleExtract = async () => {
    if (!file || pageCount === 0) return;
    setIsProcessing(true);
    setError(null);
    setResultBlob(null);
    setSplitAllPages(null);

    try {
      const buffer = await file.arrayBuffer();

      if (splitMode === 'all') {
        const pages = await splitPdf(buffer);
        setSplitAllPages(pages);
      } else if (splitMode === 'custom') {
        const pagesToExtract = parseCustomPageList(customPages, pageCount);
        if (pagesToExtract.length === 0) {
          throw new Error('Please enter valid page numbers (e.g. 1, 3, 5-8)');
        }
        const extractedBytes = await extractSpecificPages(buffer, pagesToExtract);
        const blob = new Blob([extractedBytes as BlobPart], { type: 'application/pdf' });
        setResultBlob(blob);
      } else {
        // Range
        if (startPage < 1 || endPage > pageCount || startPage > endPage) {
          throw new Error('Invalid page range.');
        }
        const extractedBytes = await extractPageRange(buffer, startPage, endPage);
        const blob = new Blob([extractedBytes as BlobPart], { type: 'application/pdf' });
        setResultBlob(blob);
      }
    } catch (err: unknown) {
      console.error('Error extracting PDF pages:', err);
      setError(err instanceof Error ? err.message : 'Error extracting pages.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFile}
        accept=".pdf,application/pdf"
        label="Upload a PDF to split or extract specific pages"
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-xs font-bold text-red-700 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 shrink-0 text-red-500" />
          <span>{error}</span>
        </div>
      )}

      {file && pageCount > 0 && (
        <div className="space-y-5 rounded-3xl bg-[#FAF7FD] border border-purple-100/60 p-6 sm:p-7 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-purple-100/60 text-xs">
            <div className="flex items-center gap-2 font-bold text-[#1E1B24]">
              <FileText className="h-4 w-4 text-red-600" />
              <span className="truncate max-w-xs">{file.name}</span>
            </div>
            <span className="rounded-full bg-white px-3 py-1 font-mono font-bold text-neutral-600 shadow-sm border border-black/[0.04]">
              {pageCount} {pageCount === 1 ? 'Page' : 'Pages'} Total
            </span>
          </div>

          {/* Split Mode Choice */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2">
              Split Mode
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSplitMode('range')}
                className={`p-3 rounded-2xl text-left border transition-all text-xs font-extrabold ${
                  splitMode === 'range'
                    ? 'border-purple-600 bg-white shadow-sm ring-2 ring-purple-100 text-[#1E1B24]'
                    : 'border-black/[0.06] bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                Page Range (From &rarr; To)
              </button>
              <button
                type="button"
                onClick={() => setSplitMode('custom')}
                className={`p-3 rounded-2xl text-left border transition-all text-xs font-extrabold ${
                  splitMode === 'custom'
                    ? 'border-purple-600 bg-white shadow-sm ring-2 ring-purple-100 text-[#1E1B24]'
                    : 'border-black/[0.06] bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                Specific Pages (e.g. 1, 3, 5-8)
              </button>
              <button
                type="button"
                onClick={() => setSplitMode('all')}
                className={`p-3 rounded-2xl text-left border transition-all text-xs font-extrabold ${
                  splitMode === 'all'
                    ? 'border-purple-600 bg-white shadow-sm ring-2 ring-purple-100 text-[#1E1B24]'
                    : 'border-black/[0.06] bg-white text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                Extract All ({pageCount} Separate PDFs)
              </button>
            </div>
          </div>

          {/* Range Inputs */}
          {splitMode === 'range' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">From Page</label>
                <input
                  type="number"
                  min={1}
                  max={pageCount}
                  value={startPage}
                  onChange={(e) => setStartPage(Math.max(1, Math.min(pageCount, Number(e.target.value))))}
                  className="w-full rounded-2xl border border-black/[0.06] bg-white p-3 text-xs font-bold text-[#1E1B24] outline-none shadow-sm focus:border-purple-300"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-neutral-600 mb-1">To Page</label>
                <input
                  type="number"
                  min={startPage}
                  max={pageCount}
                  value={endPage}
                  onChange={(e) => setEndPage(Math.max(startPage, Math.min(pageCount, Number(e.target.value))))}
                  className="w-full rounded-2xl border border-black/[0.06] bg-white p-3 text-xs font-bold text-[#1E1B24] outline-none shadow-sm focus:border-purple-300"
                />
              </div>
            </div>
          )}

          {/* Specific Pages Input */}
          {splitMode === 'custom' && (
            <div>
              <label className="block text-xs font-bold text-neutral-600 mb-1">
                Enter Pages & Ranges (1 to {pageCount})
              </label>
              <input
                type="text"
                placeholder="e.g. 1, 3, 5-8"
                value={customPages}
                onChange={(e) => setCustomPages(e.target.value)}
                className="w-full rounded-2xl border border-black/[0.06] bg-white p-3 text-xs font-mono font-bold text-[#1E1B24] outline-none shadow-sm focus:border-purple-300"
              />
              <span className="text-[11px] text-neutral-400 mt-1 block">
                Separate with commas or hyphens (e.g. &quot;1, 2, 4-6&quot;)
              </span>
            </div>
          )}

          <ProcessButton
            onClick={handleExtract}
            isLoading={isProcessing}
            label={
              splitMode === 'all'
                ? `Split into ${pageCount} Separate PDFs`
                : splitMode === 'custom'
                ? 'Extract Specific Pages'
                : `Extract Pages ${startPage} - ${endPage}`
            }
            loadingLabel="Processing PDF in browser..."
          />
        </div>
      )}

      {/* Result Card for Single Range / Custom */}
      {resultBlob && (
        <div className="rounded-3xl bg-[#F0FDF4] border border-emerald-100 p-6 sm:p-7 space-y-4 shadow-sm">
          <p className="text-sm font-extrabold text-emerald-950">Extracted PDF Ready!</p>
          <DownloadResult
            blob={resultBlob}
            filename={`extracted_${file?.name || 'document.pdf'}`}
            label="Download Extracted PDF"
          />
        </div>
      )}

      {/* Result Card for Split All Pages */}
      {splitAllPages && (
        <div className="rounded-3xl bg-[#F0FDF4] border border-emerald-100 p-6 sm:p-7 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-emerald-950">
              Successfully split into {splitAllPages.length} individual pages!
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-60 overflow-y-auto p-1">
            {splitAllPages.map((bytes, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() =>
                  downloadBytes(bytes, `page_${idx + 1}_${file?.name || 'doc.pdf'}`, 'application/pdf')
                }
                className="p-2.5 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold flex flex-col items-center gap-1 shadow-xs transition"
              >
                <Download className="h-3.5 w-3.5 text-emerald-600" />
                <span>Page {idx + 1}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
