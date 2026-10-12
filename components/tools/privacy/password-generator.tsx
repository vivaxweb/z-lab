'use client';

import React, { useState, useCallback } from 'react';
import { Copy, Check, RefreshCw, KeyRound, ShieldCheck } from 'lucide-react';

function createSecurePassword(
  len: number,
  incUpper: boolean,
  incLower: boolean,
  incNum: boolean,
  incSym: boolean,
  excAmbiguous: boolean
): string {
  let uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let lowercase = 'abcdefghijklmnopqrstuvwxyz';
  let numbers = '0123456789';
  let symbols = '!@#$%^&*()_+-=[]{}|;:,.<>?';

  if (excAmbiguous) {
    uppercase = uppercase.replace(/[IO]/g, '');
    lowercase = lowercase.replace(/[lo]/g, '');
    numbers = numbers.replace(/[01]/g, '');
    symbols = symbols.replace(/[|;:,.<>]/g, '');
  }

  let charPool = '';
  if (incUpper) charPool += uppercase;
  if (incLower) charPool += lowercase;
  if (incNum) charPool += numbers;
  if (incSym) charPool += symbols;

  if (!charPool) return '';

  if (typeof window !== 'undefined' && window.crypto) {
    const array = new Uint32Array(len);
    window.crypto.getRandomValues(array);
    let result = '';
    for (let i = 0; i < len; i++) {
      result += charPool[array[i] % charPool.length];
    }
    return result;
  }
  return '';
}

export function PasswordGeneratorTool() {
  const [length, setLength] = useState<number>(16);
  const [includeUppercase, setIncludeUppercase] = useState<boolean>(true);
  const [includeLowercase, setIncludeLowercase] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(true);
  const [includeSymbols, setIncludeSymbols] = useState<boolean>(true);
  const [excludeAmbiguous, setExcludeAmbiguous] = useState<boolean>(false);
  const [password, setPassword] = useState<string>(() =>
    createSecurePassword(16, true, true, true, true, false)
  );
  const [copied, setCopied] = useState<boolean>(false);

  const regenerate = useCallback(
    (
      newLen = length,
      newUpper = includeUppercase,
      newLower = includeLowercase,
      newNum = includeNumbers,
      newSym = includeSymbols,
      newAmb = excludeAmbiguous
    ) => {
      const nextPw = createSecurePassword(newLen, newUpper, newLower, newNum, newSym, newAmb);
      setPassword(nextPw);
      setCopied(false);
    },
    [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeAmbiguous]
  );

  const handleCopy = () => {
    if (!password) return;
    navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getStrength = () => {
    if (!password) return { label: 'Empty', color: 'bg-neutral-200 text-neutral-600', percent: 10 };
    let score = 0;
    if (password.length >= 12) score++;
    if (password.length >= 16) score++;
    if (password.length >= 24) score++;
    if (includeUppercase && includeLowercase) score++;
    if (includeNumbers) score++;
    if (includeSymbols) score++;

    if (score <= 2)
      return { label: 'Weak', color: 'bg-rose-100 text-rose-700', percent: 30 };
    if (score <= 4)
      return { label: 'Good Entropy', color: 'bg-amber-100 text-amber-800', percent: 70 };
    return {
      label: 'Cryptographically Fortified',
      color: 'bg-emerald-100 text-emerald-800',
      percent: 100,
    };
  };

  const strength = getStrength();

  const applyPreset = (len: number, sym: boolean) => {
    setLength(len);
    setIncludeSymbols(sym);
    regenerate(len, true, true, true, sym, false);
  };

  return (
    <div className="space-y-6">
      {/* ── Quick Preset Pills ───────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-extrabold text-neutral-400">Presets:</span>
        <button
          type="button"
          onClick={() => applyPreset(16, true)}
          className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-700 shadow-sm border border-black/[0.04] hover:bg-neutral-50 active:scale-95 transition"
        >
          🔑 16-Char Standard
        </button>
        <button
          type="button"
          onClick={() => applyPreset(24, true)}
          className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-700 shadow-sm border border-black/[0.04] hover:bg-neutral-50 active:scale-95 transition"
        >
          🛡️ 24-Char Strong
        </button>
        <button
          type="button"
          onClick={() => applyPreset(32, true)}
          className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-700 shadow-sm border border-black/[0.04] hover:bg-neutral-50 active:scale-95 transition"
        >
          🔒 32-Char Fortified
        </button>
        <button
          type="button"
          onClick={() => {
            setLength(6);
            setIncludeUppercase(false);
            setIncludeLowercase(false);
            setIncludeSymbols(false);
            setIncludeNumbers(true);
            regenerate(6, false, false, true, false, false);
          }}
          className="rounded-full bg-white px-3.5 py-1.5 text-xs font-bold text-neutral-700 shadow-sm border border-black/[0.04] hover:bg-neutral-50 active:scale-95 transition"
        >
          🔢 6-Digit PIN
        </button>
      </div>

      {/* ── Password Display Vault Box ──────────────────────────────────── */}
      <div className="relative rounded-3xl bg-[#FAF7FD] p-6 sm:p-7 border border-purple-100/60 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="h-4 w-4 text-purple-700" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-purple-900">
              WebCrypto Engine
            </span>
          </div>
          <span
            className={`px-3 py-1 rounded-full text-[11px] font-extrabold shadow-sm ${strength.color}`}
          >
            {strength.label}
          </span>
        </div>

        <div className="rounded-2xl bg-white p-4 font-mono text-base sm:text-xl font-bold text-[#1E1B24] tracking-wider break-all shadow-sm border border-black/[0.04] select-all">
          {password || 'Please select at least one character type below'}
        </div>

        {/* Strength Progress Bar */}
        <div className="w-full bg-purple-100/60 rounded-full h-2 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${strength.percent}%` }}
          />
        </div>

        {/* Action Row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <button
            type="button"
            onClick={() => regenerate()}
            className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-xs font-bold text-[#1E1B24] shadow-sm border border-black/[0.05] hover:bg-neutral-50 active:scale-95 transition"
          >
            <RefreshCw className="h-3.5 w-3.5 text-neutral-500" />
            <span>Generate Fresh</span>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            disabled={!password}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#D7F75B] to-[#FCA5BA] px-6 py-2.5 text-xs font-black text-[#1E1B24] shadow-[0_6px_20px_rgba(252,165,186,0.3)] hover:shadow-[0_10px_24px_rgba(252,165,186,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all disabled:opacity-50"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 text-emerald-800" />
                <span>Copied to Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                <span>Copy Password</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ── Parameters & Toggles ────────────────────────────────────────── */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-black/[0.04] space-y-5">
        <div>
          <div className="flex justify-between text-xs font-bold text-neutral-500 mb-2">
            <span>Password Length</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#EADFF2] text-purple-900 font-extrabold font-mono">
              {length} chars
            </span>
          </div>
          <input
            type="range"
            min={6}
            max={64}
            value={length}
            onChange={(e) => {
              const val = Number(e.target.value);
              setLength(val);
              regenerate(val);
            }}
            className="w-full accent-purple-600 h-2 bg-neutral-100 rounded-lg cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <label className="flex items-center gap-3 text-xs font-bold text-[#1E1B24] cursor-pointer p-3 rounded-2xl bg-neutral-50/70 hover:bg-neutral-100/70 border border-black/[0.03] transition">
            <input
              type="checkbox"
              checked={includeUppercase}
              onChange={(e) => {
                setIncludeUppercase(e.target.checked);
                regenerate(length, e.target.checked);
              }}
              className="h-4 w-4 rounded accent-purple-600"
            />
            <span>Uppercase Letters (A-Z)</span>
          </label>

          <label className="flex items-center gap-3 text-xs font-bold text-[#1E1B24] cursor-pointer p-3 rounded-2xl bg-neutral-50/70 hover:bg-neutral-100/70 border border-black/[0.03] transition">
            <input
              type="checkbox"
              checked={includeLowercase}
              onChange={(e) => {
                setIncludeLowercase(e.target.checked);
                regenerate(length, includeUppercase, e.target.checked);
              }}
              className="h-4 w-4 rounded accent-purple-600"
            />
            <span>Lowercase Letters (a-z)</span>
          </label>

          <label className="flex items-center gap-3 text-xs font-bold text-[#1E1B24] cursor-pointer p-3 rounded-2xl bg-neutral-50/70 hover:bg-neutral-100/70 border border-black/[0.03] transition">
            <input
              type="checkbox"
              checked={includeNumbers}
              onChange={(e) => {
                setIncludeNumbers(e.target.checked);
                regenerate(length, includeUppercase, includeLowercase, e.target.checked);
              }}
              className="h-4 w-4 rounded accent-purple-600"
            />
            <span>Numbers (0-9)</span>
          </label>

          <label className="flex items-center gap-3 text-xs font-bold text-[#1E1B24] cursor-pointer p-3 rounded-2xl bg-neutral-50/70 hover:bg-neutral-100/70 border border-black/[0.03] transition">
            <input
              type="checkbox"
              checked={includeSymbols}
              onChange={(e) => {
                setIncludeSymbols(e.target.checked);
                regenerate(length, includeUppercase, includeLowercase, includeNumbers, e.target.checked);
              }}
              className="h-4 w-4 rounded accent-purple-600"
            />
            <span>Symbols (!@#$%^&*)</span>
          </label>

          <label className="flex items-center gap-3 text-xs font-bold text-[#1E1B24] cursor-pointer p-3 rounded-2xl bg-neutral-50/70 hover:bg-neutral-100/70 border border-black/[0.03] transition sm:col-span-2">
            <input
              type="checkbox"
              checked={excludeAmbiguous}
              onChange={(e) => {
                setExcludeAmbiguous(e.target.checked);
                regenerate(
                  length,
                  includeUppercase,
                  includeLowercase,
                  includeNumbers,
                  includeSymbols,
                  e.target.checked
                );
              }}
              className="h-4 w-4 rounded accent-purple-600"
            />
            <span>Exclude Ambiguous Characters (e.g. 0, O, 1, l, I)</span>
          </label>
        </div>
      </div>
    </div>
  );
}
