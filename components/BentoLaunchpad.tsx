'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import QRCode from 'qrcode';
import {
  Lock,
  Copy,
  Check,
  RefreshCw,
  QrCode,
  Download,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Palette,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export function BentoLaunchpad() {
  // ── 1. Quick Password State ───────────────────────────────────────────────
  const [password, setPassword] = useState('');
  const [copiedPass, setCopiedPass] = useState(false);

  const generatePass = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%^&*';
    let res = '';
    const array = new Uint32Array(16);
    if (typeof window !== 'undefined' && window.crypto) {
      window.crypto.getRandomValues(array);
      for (let i = 0; i < 16; i++) {
        res += chars[array[i] % chars.length];
      }
    } else {
      for (let i = 0; i < 16; i++) {
        res += chars[Math.floor(Math.random() * chars.length)];
      }
    }
    setPassword(res);
  };

  useEffect(() => {
    generatePass();
  }, []);

  const copyPassword = () => {
    navigator.clipboard.writeText(password);
    setCopiedPass(true);
    setTimeout(() => setCopiedPass(false), 1500);
  };

  // ── 2. Quick QR Code State ────────────────────────────────────────────────
  const [qrText, setQrText] = useState('https://zlab.app');
  const [qrDataUrl, setQrDataUrl] = useState('');

  useEffect(() => {
    if (!qrText) return;
    QRCode.toDataURL(qrText, {
      width: 140,
      margin: 1,
      color: { dark: '#1E1B24', light: '#FFFFFF' },
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => {});
  }, [qrText]);

  // ── 3. Quick Pomodoro State ───────────────────────────────────────────────
  const [timerSeconds, setTimerSeconds] = useState(25 * 60);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerRunning && timerSeconds > 0) {
      interval = setInterval(() => {
        setTimerSeconds((prev) => prev - 1);
      }, 1000);
    } else if (timerSeconds === 0) {
      setTimerRunning(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timerRunning, timerSeconds]);

  const toggleTimer = () => setTimerRunning(!timerRunning);
  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSeconds(25 * 60);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // ── 4. Quick Color Hex State ──────────────────────────────────────────────
  const [activeColor, setActiveColor] = useState('#FCA5BA');
  const [copiedColor, setCopiedColor] = useState(false);

  const presetColors = ['#FCA5BA', '#FDE68A', '#D7F75B', '#BAE6FD', '#E9D5FF', '#A7F3D0'];

  const copyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedColor(true);
    setTimeout(() => setCopiedColor(false), 1500);
  };

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2 text-center sm:text-left">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-[#1E1B24] tracking-tight">
            Instant Action Widgets
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium">
            Test quick tools directly on the home screen with zero page reloads.
          </p>
        </div>
      </div>

      {/* 4 Soft MindMate Bento Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Widget 1: Quick Password Generator */}
        <div className="flex flex-col justify-between rounded-3xl bg-white p-5 shadow-[0_8px_24px_rgba(100,50,130,0.05)] border border-black/[0.04]">
          <div>
            <div className="flex items-center justify-between pb-2">
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#1E1B24]">
                <Lock className="h-4 w-4 text-emerald-600" />
                <span>Quick Password</span>
              </span>
              <button
                type="button"
                onClick={generatePass}
                className="p-1.5 rounded-full hover:bg-neutral-100 text-neutral-500 transition"
                title="Regenerate password"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="mt-2 rounded-2xl bg-neutral-50 p-3 font-mono text-xs sm:text-sm font-bold text-neutral-800 break-all border border-black/[0.03]">
              {password}
            </div>

            <button
              type="button"
              onClick={copyPassword}
              className="mt-3 w-full rounded-full bg-emerald-100 py-2 text-xs font-extrabold text-emerald-900 hover:bg-emerald-200 transition flex items-center justify-center gap-1.5"
            >
              {copiedPass ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy 16-Char Pass</span>
                </>
              )}
            </button>
          </div>

          <div className="pt-3 mt-3 border-t border-neutral-100">
            <Link
              href="/tools/privacy-vault/password-generator"
              className="flex items-center justify-between text-[11px] font-bold text-neutral-400 hover:text-neutral-900 transition"
            >
              <span>Full Password Vault</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Widget 2: Quick QR Code Generator */}
        <div className="flex flex-col justify-between rounded-3xl bg-white p-5 shadow-[0_8px_24px_rgba(100,50,130,0.05)] border border-black/[0.04]">
          <div>
            <div className="flex items-center justify-between pb-2">
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#1E1B24]">
                <QrCode className="h-4 w-4 text-purple-600" />
                <span>Instant QR Code</span>
              </span>
              <span className="text-[10px] font-bold bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">
                Live
              </span>
            </div>

            <div className="flex items-center gap-2 mt-1">
              {qrDataUrl && (
                <div className="shrink-0 p-1 bg-neutral-50 rounded-xl border border-black/[0.04]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrDataUrl} alt="QR Code" className="h-16 w-16 rounded" />
                </div>
              )}
              <div className="flex-1 space-y-1.5">
                <input
                  type="text"
                  value={qrText}
                  onChange={(e) => setQrText(e.target.value)}
                  placeholder="URL or text..."
                  className="w-full text-xs font-bold border border-neutral-200 bg-neutral-50 p-1.5 rounded-xl outline-none"
                />
                {qrDataUrl && (
                  <a
                    href={qrDataUrl}
                    download="zlab-qr.png"
                    className="flex items-center justify-center gap-1 w-full text-[11px] font-extrabold rounded-full bg-purple-100 text-purple-900 py-1.5 hover:bg-purple-200 transition"
                  >
                    <Download className="h-3 w-3" />
                    <span>Download</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-neutral-100">
            <Link
              href="/tools/dev-utilities/qr-generator"
              className="flex items-center justify-between text-[11px] font-bold text-neutral-400 hover:text-neutral-900 transition"
            >
              <span>Full QR Studio</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Widget 3: Quick 25m Focus Sprint */}
        <div className="flex flex-col justify-between rounded-3xl bg-white p-5 shadow-[0_8px_24px_rgba(100,50,130,0.05)] border border-black/[0.04]">
          <div>
            <div className="flex items-center justify-between pb-2">
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#1E1B24]">
                <Timer className="h-4 w-4 text-lime-600" />
                <span>25m Focus Sprint</span>
              </span>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  timerRunning ? 'bg-[#D7F75B] text-neutral-900 animate-pulse' : 'bg-neutral-100 text-neutral-500'
                }`}
              >
                {timerRunning ? 'Focusing' : 'Paused'}
              </span>
            </div>

            <div className="text-center py-1">
              <span className="font-mono text-3xl font-black text-[#1E1B24] tracking-tight">
                {formatTimer(timerSeconds)}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={toggleTimer}
                className="flex-1 flex items-center justify-center gap-1 rounded-full bg-[#D7F75B] py-2 text-xs font-extrabold text-neutral-900 hover:opacity-90 transition shadow-sm"
              >
                {timerRunning ? (
                  <>
                    <Pause className="h-3.5 w-3.5" />
                    <span>Pause</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" />
                    <span>Start Sprint</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={resetTimer}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500 transition"
                title="Reset timer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          <div className="pt-3 mt-3 border-t border-neutral-100">
            <Link
              href="/tools/study-focus/pomodoro-timer"
              className="flex items-center justify-between text-[11px] font-bold text-neutral-400 hover:text-neutral-900 transition"
            >
              <span>Full Pomodoro Deck</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Widget 4: Quick Color & Hex Swatch */}
        <div className="flex flex-col justify-between rounded-3xl bg-white p-5 shadow-[0_8px_24px_rgba(100,50,130,0.05)] border border-black/[0.04]">
          <div>
            <div className="flex items-center justify-between pb-2">
              <span className="flex items-center gap-1.5 text-xs font-extrabold text-[#1E1B24]">
                <Palette className="h-4 w-4 text-pink-600" />
                <span>Color Swatches</span>
              </span>
              <span className="text-[10px] font-bold bg-pink-50 text-pink-700 px-2 py-0.5 rounded-full">
                Hex
              </span>
            </div>

            <div className="flex items-center justify-between gap-1.5 my-2">
              {presetColors.map((hex) => (
                <button
                  key={hex}
                  type="button"
                  onClick={() => {
                    setActiveColor(hex);
                    copyHex(hex);
                  }}
                  className={`h-7 w-7 rounded-full transition-transform ${
                    activeColor === hex ? 'scale-125 ring-2 ring-purple-300' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: hex }}
                  title={`Copy ${hex}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => copyHex(activeColor)}
              className="w-full flex items-center justify-between rounded-full bg-neutral-50 p-2 text-xs font-mono font-bold text-[#1E1B24] border border-black/[0.03] hover:bg-neutral-100 transition"
            >
              <span className="flex items-center gap-1.5">
                <span
                  className="h-3.5 w-3.5 rounded-full"
                  style={{ backgroundColor: activeColor }}
                />
                <span>{activeColor}</span>
              </span>
              <span className="text-[10px] font-sans font-semibold text-neutral-400">
                {copiedColor ? 'Copied!' : 'Click to copy'}
              </span>
            </button>
          </div>

          <div className="pt-3 mt-3 border-t border-neutral-100">
            <Link
              href="/tools/dev-utilities/color-converter"
              className="flex items-center justify-between text-[11px] font-bold text-neutral-400 hover:text-neutral-900 transition"
            >
              <span>Full Color Converter</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
