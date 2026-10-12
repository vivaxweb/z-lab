'use client';

import React, { useState, useEffect, useRef } from 'react';
import JsBarcode from 'jsbarcode';
import { Download } from 'lucide-react';
import { downloadDataUrl } from '@/lib/download-utils';

export function BarcodeGeneratorTool() {
  const [value, setValue] = useState<string>('Z-LAB-2026');
  const [format, setFormat] = useState<string>('CODE128');
  const [width, setWidth] = useState<number>(2);
  const [height, setHeight] = useState<number>(80);
  const [displayValue, setDisplayValue] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!value.trim() || !canvasRef.current) return;
    try {
      JsBarcode(canvasRef.current, value, {
        format,
        width,
        height,
        displayValue,
        fontSize: 14,
        margin: 10,
        background: '#ffffff',
        lineColor: '#000000',
      });
      queueMicrotask(() => setError(null));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid code format for this barcode standard.';
      queueMicrotask(() => setError(msg));
    }
  }, [value, format, width, height, displayValue]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    downloadDataUrl(dataUrl, `barcode_${value}.png`);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Settings */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider mb-1">
              Barcode Value
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder="Enter text or number..."
              className="w-full rounded-xl border border-gray-300 p-3 text-sm font-mono focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs outline-none"
              >
                <option value="CODE128">CODE128 (Standard)</option>
                <option value="EAN13">EAN-13</option>
                <option value="UPC">UPC-A</option>
                <option value="CODE39">CODE39</option>
                <option value="ITF14">ITF-14</option>
                <option value="MSI">MSI</option>
                <option value="pharmacode">Pharmacode</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Bar Width</label>
              <select
                value={width}
                onChange={(e) => setWidth(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs outline-none"
              >
                <option value={1}>1px (Narrow)</option>
                <option value={2}>2px (Standard)</option>
                <option value={3}>3px (Wide)</option>
                <option value={4}>4px (Extra Wide)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">Height (px)</label>
              <input
                type="number"
                min={30}
                max={200}
                value={height}
                onChange={(e) => setHeight(Number(e.target.value))}
                className="w-full rounded-lg border border-gray-300 p-2 text-xs outline-none"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <label className="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
              <input
                type="checkbox"
                checked={displayValue}
                onChange={(e) => setDisplayValue(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600"
              />
              Show Text Label Below Barcode
            </label>
          </div>

          {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
        </div>

        {/* Live Preview & Download */}
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-gray-200 bg-gray-50/50 p-6 text-center">
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm overflow-x-auto max-w-full">
            <canvas ref={canvasRef} />
          </div>

          <button
            type="button"
            onClick={handleDownload}
            disabled={!!error || !value}
            className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-50 shadow-sm transition"
          >
            <Download className="h-4 w-4" /> Download Barcode PNG
          </button>
        </div>
      </div>
    </div>
  );
}
