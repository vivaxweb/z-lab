'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  Settings,
  Volume2,
  Sparkles,
  Zap,
  Coffee,
  CheckCircle2,
  ChevronRight,
} from 'lucide-react';

type Mode = 'focus' | 'shortBreak' | 'longBreak';
type AmbientSound = 'none' | 'brown' | 'rain' | 'white';

export function PomodoroTimerTool() {
  const [mode, setMode] = useState<Mode>('focus');
  const [focusTime, setFocusTime] = useState<number>(25);
  const [shortBreakTime, setShortBreakTime] = useState<number>(5);
  const [longBreakTime, setLongBreakTime] = useState<number>(15);
  const [timeLeft, setTimeLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionsCompleted, setSessionsCompleted] = useState<number>(0);
  const [showSettings, setShowSettings] = useState<boolean>(false);
  const [activeSound, setActiveSound] = useState<AmbientSound>('none');
  const [soundVolume, setSoundVolume] = useState<number>(0.2);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientNodeRef = useRef<AudioNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  // Initialize Web Audio Context
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };

  // Play synthetic gentle chime
  const playChime = () => {
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.2);

      gain.gain.setValueAtTime(0.25, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.25);
    } catch {
      // AudioContext blocked
    }
  };

  // Ambient Noise Synthesizer (100% Client-Side Web Audio)
  const stopAmbient = () => {
    try {
      if (ambientNodeRef.current) {
        (ambientNodeRef.current as AudioBufferSourceNode).stop();
        ambientNodeRef.current.disconnect();
        ambientNodeRef.current = null;
      }
    } catch {
      // ignore
    }
  };

  const startAmbient = (type: AmbientSound) => {
    stopAmbient();
    if (type === 'none') return;

    try {
      const ctx = getAudioContext();
      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        if (type === 'white') {
          data[i] = white * 0.15;
        } else if (type === 'brown' || type === 'rain') {
          lastOut = (lastOut + 0.02 * white) / 1.02;
          data[i] = lastOut * 3.5 * 0.25;
        }
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(soundVolume, ctx.currentTime);
      ambientGainRef.current = gain;

      noise.connect(gain);
      gain.connect(ctx.destination);
      noise.start();
      ambientNodeRef.current = noise;
    } catch {
      // ignore
    }
  };

  const handleSoundChange = (sound: AmbientSound) => {
    setActiveSound(sound);
    startAmbient(sound);
  };

  useEffect(() => {
    if (ambientGainRef.current && audioCtxRef.current) {
      ambientGainRef.current.gain.setValueAtTime(soundVolume, audioCtxRef.current.currentTime);
    }
  }, [soundVolume]);

  useEffect(() => {
    return () => {
      stopAmbient();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const switchMode = (newMode: Mode) => {
    setIsRunning(false);
    setMode(newMode);
    if (newMode === 'focus') setTimeLeft(focusTime * 60);
    else if (newMode === 'shortBreak') setTimeLeft(shortBreakTime * 60);
    else setTimeLeft(longBreakTime * 60);
  };

  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (isRunning) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            playChime();
            if (mode === 'focus') {
              const nextSessions = sessionsCompleted + 1;
              setSessionsCompleted(nextSessions);
              if (nextSessions % 4 === 0) {
                setMode('longBreak');
                return longBreakTime * 60;
              } else {
                setMode('shortBreak');
                return shortBreakTime * 60;
              }
            } else {
              setMode('focus');
              return focusTime * 60;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isRunning, mode, sessionsCompleted, focusTime, shortBreakTime, longBreakTime]);

  const toggleTimer = () => setIsRunning(!isRunning);

  const resetTimer = () => {
    setIsRunning(false);
    if (mode === 'focus') setTimeLeft(focusTime * 60);
    else if (mode === 'shortBreak') setTimeLeft(shortBreakTime * 60);
    else setTimeLeft(longBreakTime * 60);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timeFormatted = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalTimeForMode =
    (mode === 'focus' ? focusTime : mode === 'shortBreak' ? shortBreakTime : longBreakTime) * 60;
  const progressPercent = ((totalTimeForMode - timeLeft) / totalTimeForMode) * 100;

  return (
    <div className="space-y-6 max-w-lg mx-auto text-center">
      {/* ── Mode Switcher Pills ─────────────────────────────────────────── */}
      <div className="flex justify-center gap-2 rounded-full bg-neutral-100 p-1.5 shadow-inner">
        <button
          type="button"
          onClick={() => switchMode('focus')}
          className={`flex-1 rounded-full py-2 px-3 text-xs font-bold transition ${
            mode === 'focus'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Focus (25m)
        </button>
        <button
          type="button"
          onClick={() => switchMode('shortBreak')}
          className={`flex-1 rounded-full py-2 px-3 text-xs font-bold transition ${
            mode === 'shortBreak'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Short Break (5m)
        </button>
        <button
          type="button"
          onClick={() => switchMode('longBreak')}
          className={`flex-1 rounded-full py-2 px-3 text-xs font-bold transition ${
            mode === 'longBreak'
              ? 'bg-white text-neutral-900 shadow-sm'
              : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Long Break (15m)
        </button>
      </div>

      {/* ── Segmented Circular Reflection Gauge (From MindMate Screen 3) ─── */}
      <div className="relative mx-auto flex h-72 w-72 sm:h-80 sm:w-80 items-center justify-center">
        {/* Floating Emoji Chips Around Dial (From Screen 3) */}
        <div className="absolute top-2 left-12 flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm shadow-sm">
          🥺
        </div>
        <div className="absolute top-0 right-12 flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-sm shadow-sm">
          😎
        </div>
        <div className="absolute bottom-10 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-purple-100 text-sm shadow-sm">
          😌
        </div>
        <div className="absolute bottom-10 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-pink-100 text-sm shadow-sm">
          🔥
        </div>

        {/* Outer Circular Track */}
        <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="42"
            className="stroke-neutral-100"
            strokeWidth="5"
            fill="transparent"
          />
          {/* Segmented Gradient Dial */}
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="#D7F75B"
            className="transition-all duration-1000 ease-linear"
            strokeWidth="5.5"
            strokeDasharray={264}
            strokeDashoffset={264 - (264 * progressPercent) / 100}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center Circular Display */}
        <div className="absolute flex flex-col items-center select-none space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-neutral-400">
            {mode === 'focus' ? 'Deep Flow' : 'Resting'}
          </span>

          <span className="font-mono text-5xl sm:text-6xl font-black tracking-tight text-[#1E1B24]">
            {timeFormatted}
          </span>

          <span className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-500 pt-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sprint #{sessionsCompleted + 1}</span>
          </span>
        </div>
      </div>

      {/* ── Signature Gradient Action Button (From MindMate Screen 3) ───── */}
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={toggleTimer}
          className="btn-mindmate-gradient w-full py-4 text-base font-extrabold flex items-center justify-center gap-2"
        >
          {isRunning ? (
            <>
              <Pause className="h-5 w-5 fill-current" />
              <span>Pause Focus Session</span>
            </>
          ) : (
            <>
              <Play className="h-5 w-5 fill-current ml-0.5" />
              <span>Start Focus Session</span>
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-4 text-xs font-bold text-neutral-500">
          <button
            type="button"
            onClick={resetTimer}
            className="hover:text-neutral-900 transition flex items-center gap-1"
          >
            <RotateCcw className="h-3.5 w-3.5" /> Reset
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => {
              if (mode === 'focus') switchMode('shortBreak');
              else switchMode('focus');
            }}
            className="hover:text-neutral-900 transition flex items-center gap-1"
          >
            <SkipForward className="h-3.5 w-3.5" /> Skip
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={() => setShowSettings(!showSettings)}
            className="hover:text-neutral-900 transition flex items-center gap-1"
          >
            <Settings className="h-3.5 w-3.5" /> Settings
          </button>
        </div>
      </div>

      {/* ── Split Metrics Cards (From MindMate Screen 3: Intake & Mental Effect) ─ */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        {/* Metric Card 1: Colorful Pill Matrix (Like "Intake") */}
        <div className="rounded-3xl bg-[#FAFAFA] p-4 text-left border border-black/[0.03]">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-600 mb-2">
            <span>Intervals</span>
            <span className="text-[10px] text-neutral-400">Today</span>
          </div>

          <div className="grid grid-cols-4 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
              const active = i <= sessionsCompleted;
              return (
                <div
                  key={i}
                  className={`h-4 rounded-full transition-colors ${
                    active ? 'bg-[#D7F75B]' : 'bg-neutral-200'
                  }`}
                />
              );
            })}
          </div>
          <span className="block text-[11px] font-bold text-neutral-500 mt-2">
            {sessionsCompleted} completed
          </span>
        </div>

        {/* Metric Card 2: Flow Intensity Wave (Like "Mental Effect") */}
        <div className="rounded-3xl bg-[#FAFAFA] p-4 text-left border border-black/[0.03] flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs font-bold text-neutral-600">
            <span>Flow State</span>
            <span>⚡ High</span>
          </div>

          {/* Minimalist Wave SVG (From Screen 3) */}
          <div className="py-1">
            <svg viewBox="0 0 100 24" className="w-full h-6 stroke-[#D7F75B] fill-none stroke-2">
              <path d="M0 16 Q 25 0, 50 14 T 100 8" strokeLinecap="round" />
            </svg>
          </div>

          <span className="block text-[11px] font-bold text-neutral-400">
            Optimal concentration
          </span>
        </div>
      </div>

      {/* ── Built-in Focus Ambient Sound Synthesizer ───────────────────── */}
      <div className="rounded-3xl bg-[#FAFAFA] p-4 border border-black/[0.03] space-y-2 text-left">
        <div className="flex items-center justify-between text-xs font-bold text-neutral-700">
          <span className="flex items-center gap-1.5">
            <Volume2 className="h-4 w-4 text-purple-600" />
            <span>Lo-Fi Focus Audio</span>
          </span>
          <span className="text-[10px] text-neutral-400">100% Offline</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {(
            [
              { key: 'none', label: 'Silent' },
              { key: 'brown', label: 'Brown Noise' },
              { key: 'rain', label: 'Soft Rain' },
              { key: 'white', label: 'White Noise' },
            ] as const
          ).map((s) => (
            <button
              key={s.key}
              type="button"
              onClick={() => handleSoundChange(s.key)}
              className={`py-1.5 px-2 rounded-xl text-[11px] font-bold transition ${
                activeSound === s.key
                  ? 'bg-purple-100 text-purple-800 shadow-sm'
                  : 'bg-white hover:bg-neutral-100 text-neutral-600'
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {activeSound !== 'none' && (
          <div className="flex items-center gap-3 pt-1">
            <span className="text-[10px] font-bold text-neutral-500 shrink-0">Volume</span>
            <input
              type="range"
              min={0}
              max={0.5}
              step={0.01}
              value={soundVolume}
              onChange={(e) => setSoundVolume(Number(e.target.value))}
              className="w-full accent-purple-600"
            />
          </div>
        )}
      </div>

      {/* ── Settings Drawer ────────────────────────────────────────────── */}
      {showSettings && (
        <div className="rounded-3xl bg-[#FAFAFA] p-4 space-y-3 text-left border border-black/[0.04]">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-neutral-600">
            <span>Intervals (Minutes)</span>
            <button
              type="button"
              onClick={playChime}
              className="text-[11px] text-purple-600 font-bold hover:underline"
            >
              Test Chime
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-neutral-500 mb-1">Focus</label>
              <input
                type="number"
                min={1}
                max={120}
                value={focusTime}
                onChange={(e) => {
                  const val = Math.max(1, Number(e.target.value));
                  setFocusTime(val);
                  if (mode === 'focus') setTimeLeft(val * 60);
                }}
                className="w-full rounded-xl border border-neutral-200 bg-white p-2 text-xs font-bold outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-neutral-500 mb-1">Short Break</label>
              <input
                type="number"
                min={1}
                max={60}
                value={shortBreakTime}
                onChange={(e) => {
                  const val = Math.max(1, Number(e.target.value));
                  setShortBreakTime(val);
                  if (mode === 'shortBreak') setTimeLeft(val * 60);
                }}
                className="w-full rounded-xl border border-neutral-200 bg-white p-2 text-xs font-bold outline-none"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-neutral-500 mb-1">Long Break</label>
              <input
                type="number"
                min={1}
                max={60}
                value={longBreakTime}
                onChange={(e) => {
                  const val = Math.max(1, Number(e.target.value));
                  setLongBreakTime(val);
                  if (mode === 'longBreak') setTimeLeft(val * 60);
                }}
                className="w-full rounded-xl border border-neutral-200 bg-white p-2 text-xs font-bold outline-none"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
