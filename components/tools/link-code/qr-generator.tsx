'use client';

import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { Download, Copy, Check, Palette, Sparkles, QrCode } from 'lucide-react';
import { downloadDataUrl } from '@/lib/download-utils';

export function QrGeneratorTool() {
  const [text, setText] = useState<string>('https://zlab.app');
  const [darkColor, setDarkColor] = useState<string>('#1E1B24');
  const [lightColor, setLightColor] = useState<string>('#FFFFFF');
  const [errorLevel, setErrorLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [dataUrl, setDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const presets = [
    { label: 'Classic Dark', dark: '#1E1B24', light: '#FFFFFF' },
    { label: 'Lavender Ink', dark: '#4C1D95', light: '#F5EEFB' },
    { label: 'Matcha Forest', dark: '#14532D', light: '#F0FDF4' },
    { label: 'Sunset Coral', dark: '#831843', light: '#FFF1F2' },
    { label: 'Midnight Ocean', dark: '#0F172A', light: '#F0F9FF' },
  ];

  useEffect(() => {
    if (!text.trim()) {
      queueMicrotask(() => setDataUrl(''));
      return;
    }

    QRCode.toDataURL(
      text,
      {
        errorCorrectionLevel: errorLevel,
        margin: 2,
        width: 360,
        color: {
          dark: darkColor,
          light: lightColor,
        },
      },
      (err, url) => {
        if (!err && url) {
          setDataUrl(url);
        }
      }
    );
  }, [text, darkColor, lightColor, errorLevel]);

  const handleDownload = () => {
    if (!dataUrl) return;
    downloadDataUrl(dataUrl, 'zlab-qr.png');
  };

  const handleCopy = () => {
    if (!dataUrl) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Controls Column */}
        <div className="md:col-span-7 space-y-5">
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2">
              Content (URL or Text)
            </label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="Enter any website URL or text to encode..."
              className="w-full rounded-2xl border border-black/[0.06] bg-neutral-50/70 p-4 text-sm font-semibold text-[#1E1B24] placeholder-neutral-400 outline-none focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-100/50 transition-all shadow-sm"
            />
          </div>

          {/* Color Presets */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2 flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5 text-purple-600" />
              <span>Color Palettes</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {presets.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => {
                    setDarkColor(p.dark);
                    setLightColor(p.light);
                  }}
                  className="rounded-full px-3.5 py-1.5 text-xs font-bold shadow-sm hover:scale-105 active:scale-95 transition-all flex items-center gap-2 border border-black/[0.04]"
                  style={{ backgroundColor: p.light, color: p.dark }}
                >
                  <span
                    className="h-3 w-3 rounded-full shadow-inner"
                    style={{ backgroundColor: p.dark }}
                  />
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Pickers */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-black/[0.05] bg-neutral-50/70 p-3 shadow-sm">
              <label className="block text-[11px] font-extrabold text-neutral-500 mb-1.5">
                Dots Color
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded-xl border border-black/10 p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={darkColor}
                  onChange={(e) => setDarkColor(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.06] bg-white px-2.5 py-1 text-xs font-mono font-bold uppercase text-[#1E1B24] outline-none"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-black/[0.05] bg-neutral-50/70 p-3 shadow-sm">
              <label className="block text-[11px] font-extrabold text-neutral-500 mb-1.5">
                Background
              </label>
              <div className="flex items-center gap-2.5">
                <input
                  type="color"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="h-8 w-10 cursor-pointer rounded-xl border border-black/10 p-0.5 bg-white"
                />
                <input
                  type="text"
                  value={lightColor}
                  onChange={(e) => setLightColor(e.target.value)}
                  className="w-full rounded-xl border border-black/[0.06] bg-white px-2.5 py-1 text-xs font-mono font-bold uppercase text-[#1E1B24] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Error Correction Level */}
          <div>
            <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-500 mb-2">
              Error Correction Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(['L', 'M', 'Q', 'H'] as const).map((lvl) => (
                <button
                  key={lvl}
                  type="button"
                  onClick={() => setErrorLevel(lvl)}
                  className={`rounded-2xl py-2 text-xs font-extrabold transition-all ${
                    errorLevel === lvl
                      ? 'bg-[#1E1B24] text-white shadow-sm'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/70'
                  }`}
                >
                  {lvl} ({lvl === 'L' ? '7%' : lvl === 'M' ? '15%' : lvl === 'Q' ? '25%' : '30%'})
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visual Live QR Code Preview Card */}
        <div className="md:col-span-5 flex flex-col items-center justify-center gap-5 rounded-3xl bg-[#FAF7FD] p-6 sm:p-8 text-center border border-purple-100/60 shadow-sm">
          {dataUrl ? (
            <div className="overflow-hidden rounded-3xl bg-white p-4 shadow-[0_12px_28px_rgba(100,50,130,0.08)] border border-black/[0.04] transition-all hover:scale-102">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={dataUrl} alt="Generated QR Code" className="h-56 w-56 object-contain rounded-2xl" />
            </div>
          ) : (
            <div className="flex h-56 w-56 flex-col items-center justify-center rounded-3xl border-2 border-dashed border-purple-200 bg-white text-xs font-bold text-neutral-400 p-4 text-center">
              <QrCode className="h-8 w-8 text-purple-300 mb-2" />
              <span>Type text or URL to generate QR code</span>
            </div>
          )}

          <div className="flex flex-wrap gap-2.5 justify-center w-full">
            <button
              type="button"
              onClick={handleDownload}
              disabled={!dataUrl}
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#D7F75B] to-[#FCA5BA] px-5 py-3 text-xs font-black text-[#1E1B24] shadow-[0_6px_20px_rgba(252,165,186,0.3)] hover:shadow-[0_10px_24px_rgba(252,165,186,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-40 transition-all"
            >
              <Download className="h-4 w-4" />
              <span>Download PNG</span>
            </button>

            <button
              type="button"
              onClick={handleCopy}
              disabled={!dataUrl}
              className="inline-flex items-center justify-center gap-1.5 rounded-full bg-white px-4 py-3 text-xs font-extrabold text-[#1E1B24] shadow-sm border border-black/[0.06] hover:bg-neutral-50 active:scale-95 disabled:opacity-40 transition-all"
            >
              {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4 text-neutral-500" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
