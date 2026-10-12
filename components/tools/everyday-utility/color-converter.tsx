'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check } from 'lucide-react';

export function ColorConverterTool() {
  const [hex, setHex] = useState<string>('#6366f1');
  const [copiedFormat, setCopiedFormat] = useState<string | null>(null);

  // Parse HEX to RGB
  const rgb = useMemo(() => {
    let cleanHex = hex.replace('#', '');
    if (cleanHex.length === 3) {
      cleanHex = cleanHex.split('').map((c) => c + c).join('');
    }
    if (cleanHex.length !== 6) return { r: 99, g: 102, b: 241 };
    const num = parseInt(cleanHex, 16);
    return {
      r: (num >> 16) & 255,
      g: (num >> 8) & 255,
      b: num & 255,
    };
  }, [hex]);

  // Convert RGB to HSL
  const hsl = useMemo(() => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }
    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
    };
  }, [rgb]);

  // Convert RGB to CMYK
  const cmyk = useMemo(() => {
    const r = rgb.r / 255;
    const g = rgb.g / 255;
    const b = rgb.b / 255;
    const k = 1 - Math.max(r, g, b);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    const c = Math.round(((1 - r - k) / (1 - k)) * 100);
    const m = Math.round(((1 - g - k) / (1 - k)) * 100);
    const y = Math.round(((1 - b - k) / (1 - k)) * 100);
    return { c, m, y, k: Math.round(k * 100) };
  }, [rgb]);

  const formats = [
    { label: 'HEX', value: hex.toUpperCase() },
    { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
    { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
    { label: 'CMYK', value: `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` },
  ];

  const copyValue = (label: string, val: string) => {
    navigator.clipboard.writeText(val);
    setCopiedFormat(label);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Visual swatch & Picker */}
      <div className="flex flex-col sm:flex-row items-center gap-6 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <div
          className="h-28 w-28 sm:h-36 sm:w-36 rounded-2xl shadow-inner border border-black/10 flex-shrink-0"
          style={{ backgroundColor: hex }}
        />
        <div className="flex-1 space-y-4 w-full">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Pick Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                className="h-10 w-12 cursor-pointer rounded-lg border border-gray-300 bg-white p-1"
              />
              <input
                type="text"
                value={hex}
                onChange={(e) => setHex(e.target.value)}
                placeholder="#6366f1"
                className="w-36 rounded-lg border border-gray-300 bg-white p-2 text-sm font-mono uppercase focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Formats list */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {formats.map((fmt) => (
          <div
            key={fmt.label}
            className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-3.5 shadow-sm"
          >
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">
                {fmt.label}
              </span>
              <span className="font-mono text-sm font-medium text-gray-800">{fmt.value}</span>
            </div>
            <button
              type="button"
              onClick={() => copyValue(fmt.label, fmt.value)}
              className="inline-flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50"
            >
              {copiedFormat === fmt.label ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-600" /> Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" /> Copy
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
