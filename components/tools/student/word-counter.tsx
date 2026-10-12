'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check, Trash2, Clock, Volume2, Sparkles } from 'lucide-react';

export function WordCounterTool() {
  const [text, setText] = useState<string>(
    'Gen Z is rewriting how the internet works. With client-side technology, privacy is no longer a luxury — it is the default standard.'
  );
  const [copied, setCopied] = useState<boolean>(false);

  const stats = useMemo(() => {
    const trimmed = text.trim();
    const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s+/g, '').length;
    const sentences = trimmed ? text.split(/[.!?]+/).filter((s) => s.trim().length > 0).length : 0;
    const paragraphs = trimmed ? text.split(/\n+/).filter((p) => p.trim().length > 0).length : 0;

    // Average reading speed: 200 words per minute; speaking speed: 130 words per minute
    const readingTimeMinutes = Math.ceil(words / 200);
    const speakingTimeMinutes = Math.ceil(words / 130);

    return {
      words,
      characters,
      charactersNoSpaces,
      sentences,
      paragraphs,
      readingTime: `${readingTimeMinutes} min`,
      speakingTime: `${speakingTimeMinutes} min`,
    };
  }, [text]);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* 4 Soft Metric Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-3xl bg-[#FAF7FD] border border-purple-100/60 p-4 sm:p-5 text-center shadow-sm">
          <span className="text-3xl sm:text-4xl font-black text-purple-700 block tracking-tight">
            {stats.words}
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 mt-1 block">
            Words
          </span>
        </div>
        <div className="rounded-3xl bg-[#FAF7FD] border border-purple-100/60 p-4 sm:p-5 text-center shadow-sm">
          <span className="text-3xl sm:text-4xl font-black text-[#1E1B24] block tracking-tight">
            {stats.characters}
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 mt-1 block">
            Characters
          </span>
        </div>
        <div className="rounded-3xl bg-[#FAF7FD] border border-purple-100/60 p-4 sm:p-5 text-center shadow-sm">
          <span className="text-3xl sm:text-4xl font-black text-[#1E1B24] block tracking-tight">
            {stats.sentences}
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 mt-1 block">
            Sentences
          </span>
        </div>
        <div className="rounded-3xl bg-[#FAF7FD] border border-purple-100/60 p-4 sm:p-5 text-center shadow-sm">
          <span className="text-3xl sm:text-4xl font-black text-[#1E1B24] block tracking-tight">
            {stats.paragraphs}
          </span>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 mt-1 block">
            Paragraphs
          </span>
        </div>
      </div>

      {/* Reading & speaking time pills */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-3.5 shadow-sm border border-black/[0.04] text-xs font-bold text-neutral-600">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex items-center gap-1.5 text-purple-900">
            <Clock className="h-4 w-4 text-purple-600" />
            <span>Reading: ~{stats.readingTime}</span>
          </span>
          <span className="flex items-center gap-1.5 text-purple-900">
            <Volume2 className="h-4 w-4 text-purple-600" />
            <span>Speaking: ~{stats.speakingTime}</span>
          </span>
        </div>
        <span className="text-neutral-400 font-medium">
          Without spaces: {stats.charactersNoSpaces} chars
        </span>
      </div>

      {/* Text Area */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-extrabold uppercase tracking-wider text-neutral-400">
            Your Text
          </label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setText('')}
              className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold text-neutral-500 hover:text-rose-600 hover:bg-rose-50 transition"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>Clear</span>
            </button>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-[#1E1B24] shadow-sm border border-black/[0.05] hover:bg-neutral-50 active:scale-95 transition"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5 text-neutral-400" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={10}
          placeholder="Paste or write your essay, assignment, or notes here..."
          className="w-full rounded-3xl border border-black/[0.06] bg-neutral-50/70 p-5 text-sm leading-relaxed text-[#1E1B24] placeholder-neutral-400 outline-none focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-100/50 shadow-sm transition"
        />
      </div>
    </div>
  );
}
