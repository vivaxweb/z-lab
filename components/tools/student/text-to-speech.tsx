'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Square, Volume2, Sparkles } from 'lucide-react';

export function TextToSpeechTool() {
  const [text, setText] = useState<string>(
    'Welcome to Z Lab. This audio is generated completely offline inside your browser using the native Web Speech API. No data is sent to external servers.'
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const loadVoices = () => {
      const available = window.speechSynthesis.getVoices();
      setVoices(available);
      if (available.length > 0 && !selectedVoice) {
        setSelectedVoice(available[0].name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.cancel();
    };
  }, [selectedVoice]);

  const handlePlay = () => {
    if (!text.trim() || typeof window === 'undefined') return;

    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
      setIsPlaying(true);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const chosenVoice = voices.find((v) => v.name === selectedVoice);
    if (chosenVoice) utterance.voice = chosenVoice;
    utterance.rate = rate;
    utterance.pitch = pitch;

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.pause();
    setIsPaused(true);
    setIsPlaying(false);
  };

  const handleStop = () => {
    if (typeof window === 'undefined') return;
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
  };

  return (
    <div className="space-y-6">
      {/* Text Area */}
      <div>
        <label className="block text-xs font-extrabold uppercase tracking-wider text-neutral-400 mb-2">
          Text to Read Aloud
        </label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          placeholder="Type or paste text to convert to voice..."
          className="w-full rounded-3xl border border-black/[0.06] bg-neutral-50/70 p-4 sm:p-5 text-sm leading-relaxed text-[#1E1B24] placeholder-neutral-400 outline-none focus:border-purple-300 focus:bg-white focus:ring-4 focus:ring-purple-100/50 shadow-sm transition"
        />
      </div>

      {/* Voice and Controls Panel */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 rounded-3xl bg-[#FAF7FD] border border-purple-100/60 p-6 shadow-sm">
        {/* Voice Selector */}
        <div>
          <label className="block text-xs font-bold text-neutral-600 mb-2">Voice Model</label>
          <select
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full rounded-2xl border border-black/[0.06] bg-white p-3 text-xs font-bold text-[#1E1B24] outline-none shadow-sm focus:border-purple-300"
          >
            {voices.map((v) => (
              <option key={v.name} value={v.name}>
                {v.name} ({v.lang})
              </option>
            ))}
          </select>
        </div>

        {/* Speed / Rate */}
        <div>
          <div className="flex justify-between text-xs font-bold text-neutral-600 mb-2">
            <span>Speed (Rate)</span>
            <span className="font-extrabold font-mono text-purple-700">{rate}x</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={2}
            step={0.1}
            value={rate}
            onChange={(e) => setRate(Number(e.target.value))}
            className="w-full accent-purple-600 h-2 bg-purple-100 rounded-lg cursor-pointer mt-2"
          />
        </div>

        {/* Pitch */}
        <div>
          <div className="flex justify-between text-xs font-bold text-neutral-600 mb-2">
            <span>Pitch</span>
            <span className="font-extrabold font-mono text-purple-700">{pitch}</span>
          </div>
          <input
            type="range"
            min={0.5}
            max={1.5}
            step={0.1}
            value={pitch}
            onChange={(e) => setPitch(Number(e.target.value))}
            className="w-full accent-purple-600 h-2 bg-purple-100 rounded-lg cursor-pointer mt-2"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {!isPlaying ? (
          <button
            type="button"
            onClick={handlePlay}
            disabled={!text.trim()}
            className="inline-flex items-center gap-2.5 rounded-full bg-gradient-to-r from-[#D7F75B] to-[#FCA5BA] px-7 py-3 text-xs sm:text-sm font-black text-[#1E1B24] shadow-[0_6px_20px_rgba(252,165,186,0.3)] hover:shadow-[0_10px_24px_rgba(252,165,186,0.45)] hover:-translate-y-0.5 active:translate-y-0 active:scale-95 disabled:opacity-40 transition-all"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>{isPaused ? 'Resume Speech' : 'Play Speech'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={handlePause}
            className="inline-flex items-center gap-2.5 rounded-full bg-amber-400 px-7 py-3 text-xs sm:text-sm font-black text-[#1E1B24] shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95 transition-all"
          >
            <Pause className="h-4 w-4 fill-current" />
            <span>Pause</span>
          </button>
        )}

        <button
          type="button"
          onClick={handleStop}
          disabled={!isPlaying && !isPaused}
          className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs sm:text-sm font-bold text-neutral-700 shadow-sm border border-black/[0.05] hover:bg-neutral-50 disabled:opacity-40 active:scale-95 transition-all"
        >
          <Square className="h-3.5 w-3.5 fill-current" />
          <span>Stop</span>
        </button>

        {isPlaying && (
          <span className="inline-flex items-center gap-2 rounded-full bg-purple-50 px-3.5 py-1.5 text-xs font-bold text-purple-800 border border-purple-100 animate-pulse ml-2">
            <Volume2 className="h-4 w-4" />
            <span>Reading aloud in browser memory...</span>
          </span>
        )}
      </div>
    </div>
  );
}
