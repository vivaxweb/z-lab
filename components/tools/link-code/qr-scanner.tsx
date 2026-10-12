'use client';

import React, { useState } from 'react';
import { FileDropzone } from '@/components/FileDropzone';
import { Copy, Check, ExternalLink, QrCode } from 'lucide-react';
import { loadImage } from '@/lib/canvas-utils';

export function QrScannerTool() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    const selected = files[0];
    setFile(selected);
    setError(null);
    setScanResult(null);

    const url = URL.createObjectURL(selected);
    setPreviewUrl(url);

    setIsScanning(true);
    try {
      const img = await loadImage(selected);

      // Check if native BarcodeDetector is available
      if ('BarcodeDetector' in window) {
        // @ts-expect-error BarcodeDetector browser API
        const detector = new window.BarcodeDetector({ formats: ['qr_code', 'barcode'] });
        const barcodes = await detector.detect(img);
        if (barcodes.length > 0) {
          setScanResult(barcodes[0].rawValue);
        } else {
          setError('No QR code detected in this image. Try an image with higher contrast or closer crop.');
        }
      } else {
        // Fallback message for older browsers without native BarcodeDetector
        setError('Your browser does not have the native BarcodeDetector enabled. Ensure you are on modern Chrome, Edge, or Safari.');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error decoding image.');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCopy = () => {
    if (!scanResult) return;
    navigator.clipboard.writeText(scanResult);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isUrl = scanResult && (scanResult.startsWith('http://') || scanResult.startsWith('https://'));

  return (
    <div className="space-y-6">
      <FileDropzone
        onFilesSelected={handleFiles}
        accept="image/*"
        label="Upload or drop an image containing a QR code"
      />

      {isScanning && (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-blue-600 font-medium">
          <QrCode className="h-5 w-5 animate-pulse" /> Scanning image locally...
        </div>
      )}

      {previewUrl && (
        <div className="flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
          <div className="h-28 w-28 overflow-hidden rounded-lg border bg-white flex-shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={previewUrl} alt="Uploaded QR" className="h-full w-full object-contain" />
          </div>
          <div className="flex-1 text-sm space-y-1">
            <p className="font-semibold text-gray-900">{file?.name}</p>
            <p className="text-xs text-gray-500">Processed 100% locally in your browser memory.</p>
          </div>
        </div>
      )}

      {scanResult && (
        <div className="rounded-xl border border-green-200 bg-green-50/60 p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-green-800">
              Decoded QR Content
            </span>
            <div className="flex items-center gap-2">
              {isUrl && (
                <a
                  href={scanResult}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Open URL
                </a>
              )}
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex items-center gap-1 rounded bg-white px-2.5 py-1 text-xs font-semibold text-gray-700 border hover:bg-gray-50 shadow-sm"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>
          <p className="font-mono text-sm text-gray-900 bg-white p-3 rounded-lg border border-green-200 break-all select-all">
            {scanResult}
          </p>
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-800">
          {error}
        </div>
      )}
    </div>
  );
}
