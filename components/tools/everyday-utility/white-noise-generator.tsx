'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, Volume2, Clock } from 'lucide-react';

type NoiseType = 'brown' | 'pink' | 'white' | 'binaural';

function createNoiseBuffer(ctx: AudioContext, noiseType: 'white' | 'pink' | 'brown'): AudioBuffer {
  const bufferSize = ctx.sampleRate * 5;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
  let lastBrown = 0;

  for (let i = 0; i < bufferSize; i++) {
    const white = Math.random() * 2 - 1;

    if (noiseType === 'white') {
      data[i] = white * 0.25;
    } else if (noiseType === 'pink') {
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.08;
      b6 = white * 0.115926;
    } else if (noiseType === 'brown') {
      lastBrown = (lastBrown + 0.02 * white) / 1.02;
      data[i] = lastBrown * 0.7;
    }
  }
  return buffer;
}

export function WhiteNoiseGeneratorTool() {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [noiseType, setNoiseType] = useState<NoiseType>('brown');
  const [volume, setVolume] = useState<number>(0.5);
  const [timerMinutes, setTimerMinutes] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(0);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sourceNodeRef = useRef<AudioNode | null>(null);

  const stopAudio = () => {
    if (sourceNodeRef.current) {
      try {
        (sourceNodeRef.current as AudioBufferSourceNode).stop?.();
        sourceNodeRef.current.disconnect();
      } catch {
        // ignore
      }
      sourceNodeRef.current = null;
    }
    setIsPlaying(false);
  };

  const startAudio = () => {
    stopAudio();

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioCtx();
    }
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    // Master Gain
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(volume, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainNodeRef.current = masterGain;

    if (noiseType === 'binaural') {
      // Create binaural beats: 220Hz in left ear, 230Hz in right ear (10Hz Alpha brainwave)
      const merger = ctx.createChannelMerger(2);
      const oscL = ctx.createOscillator();
      const oscR = ctx.createOscillator();
      oscL.frequency.setValueAtTime(216, ctx.currentTime);
      oscR.frequency.setValueAtTime(226, ctx.currentTime);

      oscL.connect(merger, 0, 0);
      oscR.connect(merger, 0, 1);
      merger.connect(masterGain);

      oscL.start();
      oscR.start();
      sourceNodeRef.current = oscL;
    } else {
      // Buffer-based noise generator (5 seconds looped)
      const buffer = createNoiseBuffer(ctx, noiseType);
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = buffer;
      noiseSource.loop = true;
      noiseSource.connect(masterGain);
      noiseSource.start();
      sourceNodeRef.current = noiseSource;
    }

    setIsPlaying(true);
    if (timerMinutes > 0) setTimeLeft(timerMinutes * 60);
  };

  // Adjust volume live
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Handle countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isPlaying && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            stopAudio();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, timeLeft]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAudio();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleToggle = () => {
    if (isPlaying) stopAudio();
    else startAudio();
  };

  const handleNoiseChange = (type: NoiseType) => {
    setNoiseType(type);
    if (isPlaying) {
      setTimeout(() => startAudio(), 10);
    }
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="space-y-6 max-w-lg mx-auto text-center">
      {/* Visual Ambient Card */}
      <div className="relative overflow-hidden rounded-3xl border border-gray-200 bg-gradient-to-br from-gray-900 to-indigo-950 p-8 text-white shadow-lg">
        {/* Subtle animated soundwaves */}
        <div className="flex items-center justify-center gap-1.5 h-16 mb-4">
          {[40, 75, 55, 90, 60, 80, 45, 95, 70, 50, 85, 60].map((height, i) => (
            <div
              key={i}
              className={`w-1.5 rounded-full bg-blue-400 transition-all duration-300 ${
                isPlaying ? 'animate-pulse' : 'opacity-25'
              }`}
              style={{
                height: isPlaying ? `${height}%` : '20%',
                animationDelay: `${i * 120}ms`,
              }}
            />
          ))}
        </div>

        <h3 className="text-xl font-extrabold capitalize tracking-tight">
          {noiseType === 'binaural' ? 'Binaural Alpha Waves (10Hz)' : `${noiseType} Noise`}
        </h3>
        <p className="text-xs text-gray-400 mt-1">
          {noiseType === 'brown' && 'Deep, relaxing low-frequency rumble (airplane / distant thunder).'}
          {noiseType === 'pink' && 'Balanced gentle frequencies (rain / continuous waterfall).'}
          {noiseType === 'white' && 'Even static distribution across all audible frequencies.'}
          {noiseType === 'binaural' && 'Stereo 10Hz beat for deep study focus & meditation (headphones recommended).'}
        </p>

        {timeLeft > 0 && isPlaying && (
          <div className="mt-4 inline-flex items-center gap-1 rounded-full bg-white/10 px-3 py-1 text-xs font-mono text-blue-300">
            <Clock className="h-3.5 w-3.5" /> Auto-stops in: {formatTimer(timeLeft)}
          </div>
        )}
      </div>

      {/* Profile Selector Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {(['brown', 'pink', 'white', 'binaural'] as NoiseType[]).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => handleNoiseChange(type)}
            className={`rounded-xl py-2.5 px-3 text-xs font-bold capitalize transition border ${
              noiseType === type
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Main Play / Pause Button */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={handleToggle}
          className={`flex h-16 w-16 items-center justify-center rounded-full text-white shadow-md transition-transform active:scale-95 ${
            isPlaying ? 'bg-amber-600 hover:bg-amber-700' : 'bg-blue-600 hover:bg-blue-700'
          }`}
          title={isPlaying ? 'Pause' : 'Start White Noise'}
        >
          {isPlaying ? <Pause className="h-7 w-7 fill-current" /> : <Play className="h-7 w-7 fill-current ml-1" />}
        </button>
      </div>

      {/* Controls: Volume & Sleep Timer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-2xl border border-gray-200 bg-gray-50/70 p-4 text-left">
        <div>
          <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
            <span className="flex items-center gap-1">
              <Volume2 className="h-3.5 w-3.5 text-gray-500" /> Volume
            </span>
            <span className="text-blue-600">{Math.round(volume * 100)}%</span>
          </div>
          <input
            type="range"
            min={0}
            max={1}
            step={0.05}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded cursor-pointer mt-2"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-700 mb-1">Sleep Timer</label>
          <select
            value={timerMinutes}
            onChange={(e) => {
              const val = Number(e.target.value);
              setTimerMinutes(val);
              if (isPlaying && val > 0) setTimeLeft(val * 60);
              else if (val === 0) setTimeLeft(0);
            }}
            className="w-full rounded-lg border border-gray-300 bg-white p-2 text-xs outline-none"
          >
            <option value={0}>Continuous (No timer)</option>
            <option value={15}>15 Minutes</option>
            <option value={30}>30 Minutes</option>
            <option value={45}>45 Minutes</option>
            <option value={60}>60 Minutes</option>
          </select>
        </div>
      </div>
    </div>
  );
}
