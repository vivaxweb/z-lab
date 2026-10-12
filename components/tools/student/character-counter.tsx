'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check, Trash2, Clipboard } from 'lucide-react';

export function CharacterCounterTool() {
  const [text, setText] = useState<string>(
    'The quick brown fox jumps over the lazy dog.\n\nClient-side web applications are fast, secure, and private.\nEvery line is analyzed locally on your device.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const totalChars = text.length;
    const charsNoSpaces = text.replace(/\s/g, '').length;
    const lines = text.split('\n');
    const totalLines = text ? lines.length : 0;
    const nonEmptyLines = text ? lines.filter((l) => l.trim().length > 0).length : 0;
    const words = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;

    // UTF-8 byte length
    const byteSize = new TextEncoder().encode(text).length;

    // Average line length
    const avgLineLength = totalLines > 0 ? Math.round(totalChars / totalLines) : 0;

    // Longest line length
    const maxLineLength = lines.reduce((max, l) => Math.max(max, l.length), 0);

    return {
      totalChars,
      charsNoSpaces,
      totalLines,
      nonEmptyLines,
      words,
      byteSize,
      avgLineLength,
      maxLineLength,
    };
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePaste = async () => {
    try {
      const clipText = await navigator.clipboard.readText();
      setText(clipText);
    } catch {
      // clipboard read blocked
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 text-center shadow-sm">
          <span className="text-2xl font-bold text-blue-600 block">{stats.totalChars}</span>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Characters</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 text-center shadow-sm">
          <span className="text-2xl font-bold text-gray-900 block">{stats.charsNoSpaces}</span>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">No Spaces</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 text-center shadow-sm">
          <span className="text-2xl font-bold text-indigo-600 block">{stats.totalLines}</span>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Total Lines</span>
        </div>
        <div className="rounded-xl border border-gray-200 bg-gray-50/70 p-3.5 text-center shadow-sm">
          <span className="text-2xl font-bold text-gray-900 block">{stats.nonEmptyLines}</span>
          <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Filled Lines</span>
        </div>
      </div>

      {/* Secondary Detailed Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="rounded-lg bg-white border border-gray-200 p-2.5">
          <span className="text-gray-400 block text-[10px] uppercase font-semibold">Words</span>
          <span className="font-bold text-gray-800 text-sm">{stats.words}</span>
        </div>
        <div className="rounded-lg bg-white border border-gray-200 p-2.5">
          <span className="text-gray-400 block text-[10px] uppercase font-semibold">Byte Size (UTF-8)</span>
          <span className="font-bold text-gray-800 text-sm">{stats.byteSize} Bytes</span>
        </div>
        <div className="rounded-lg bg-white border border-gray-200 p-2.5">
          <span className="text-gray-400 block text-[10px] uppercase font-semibold">Avg Line Length</span>
          <span className="font-bold text-gray-800 text-sm">{stats.avgLineLength} chars</span>
        </div>
        <div className="rounded-lg bg-white border border-gray-200 p-2.5">
          <span className="text-gray-400 block text-[10px] uppercase font-semibold">Max Line Length</span>
          <span className="font-bold text-gray-800 text-sm">{stats.maxLineLength} chars</span>
        </div>
      </div>

      {/* Textarea */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-gray-700">Text Content</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePaste}
              className="inline-flex items-center gap-1 text-xs text-gray-600 hover:text-gray-900"
            >
              <Clipboard className="h-3.5 w-3.5" /> Paste
            </button>
            <button
              type="button"
              onClick={() => setText('')}
              className="inline-flex items-center gap-1 text-xs text-gray-400 hover:text-red-600"
            >
              <Trash2 className="h-3.5 w-3.5" /> Clear
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded bg-blue-50 px-2.5 py-1 text-xs font-bold text-blue-600 hover:bg-blue-100"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Paste or type text to inspect character and line metrics..."
          className="w-full rounded-2xl border border-gray-300 p-4 text-xs font-mono leading-relaxed outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm"
        />
      </div>
    </div>
  );
}
