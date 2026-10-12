'use client';

import React, { useState, useMemo } from 'react';
import { Copy, Check, Sparkles } from 'lucide-react';

export function CssGradientGeneratorTool() {
  const [type, setType] = useState<'linear' | 'radial'>('linear');
  const [angle, setAngle] = useState<number>(90);
  const [color1, setColor1] = useState<string>('#4f46e5');
  const [stop1, setStop1] = useState<number>(0);
  const [color2, setColor2] = useState<string>('#06b6d4');
  const [stop2, setStop2] = useState<number>(100);
  const [copied, setCopied] = useState<boolean>(false);

  const cssCode = useMemo(() => {
    if (type === 'linear') {
      return `background: linear-gradient(${angle}deg, ${color1} ${stop1}%, ${color2} ${stop2}%);`;
    }
    return `background: radial-gradient(circle, ${color1} ${stop1}%, ${color2} ${stop2}%);`;
  }, [type, angle, color1, stop1, color2, stop2]);

  const gradientStyle = useMemo(() => {
    if (type === 'linear') {
      return `linear-gradient(${angle}deg, ${color1} ${stop1}%, ${color2} ${stop2}%)`;
    }
    return `radial-gradient(circle, ${color1} ${stop1}%, ${color2} ${stop2}%)`;
  }, [type, angle, color1, stop1, color2, stop2]);

  const presets = [
    { name: 'Neon Cyber', c1: '#ec4899', c2: '#8b5cf6', deg: 135 },
    { name: 'Oceanic', c1: '#06b6d4', c2: '#3b82f6', deg: 90 },
    { name: 'Sunset Glow', c1: '#f97316', c2: '#e11d48', deg: 45 },
    { name: 'Emerald Forest', c1: '#10b981', c2: '#047857', deg: 120 },
  ];

  const applyPreset = (c1: string, c2: string, deg: number) => {
    setColor1(c1);
    setColor2(c2);
    setAngle(deg);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(cssCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Live Gradient Preview Box */}
      <div
        className="h-44 sm:h-56 w-full rounded-2xl shadow-inner border border-black/10 transition-all flex items-center justify-center"
        style={{ background: gradientStyle }}
      >
        <span className="rounded-full bg-white/80 backdrop-blur px-4 py-1.5 text-xs font-semibold text-gray-800 shadow-sm">
          Live CSS Gradient Preview
        </span>
      </div>

      {/* Controls */}
      <div className="space-y-5 rounded-xl border border-gray-200 bg-gray-50 p-5">
        {/* Type & Angle */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1">Gradient Type</label>
            <div className="flex rounded-lg bg-gray-200 p-1">
              <button
                type="button"
                onClick={() => setType('linear')}
                className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition ${
                  type === 'linear' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Linear
              </button>
              <button
                type="button"
                onClick={() => setType('radial')}
                className={`flex-1 rounded-md py-1.5 text-xs font-semibold transition ${
                  type === 'radial' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600'
                }`}
              >
                Radial
              </button>
            </div>
          </div>

          {type === 'linear' && (
            <div>
              <div className="flex justify-between text-xs font-semibold text-gray-700 mb-1">
                <span>Angle</span>
                <span className="text-blue-600">{angle}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={360}
                value={angle}
                onChange={(e) => setAngle(Number(e.target.value))}
                className="w-full accent-blue-600 h-2 bg-gray-200 rounded-lg cursor-pointer mt-2"
              />
            </div>
          )}
        </div>

        {/* Colors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Color 1 */}
          <div className="space-y-2 rounded-lg bg-white p-3 border border-gray-200">
            <label className="block text-xs font-semibold text-gray-700">Start Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="h-8 w-10 cursor-pointer rounded border border-gray-300 p-0.5"
              />
              <input
                type="text"
                value={color1}
                onChange={(e) => setColor1(e.target.value)}
                className="w-24 rounded border border-gray-300 p-1 text-xs font-mono uppercase"
              />
              <span className="text-xs text-gray-500 ml-auto">{stop1}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={stop1}
              onChange={(e) => setStop1(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded cursor-pointer"
            />
          </div>

          {/* Color 2 */}
          <div className="space-y-2 rounded-lg bg-white p-3 border border-gray-200">
            <label className="block text-xs font-semibold text-gray-700">End Color</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="h-8 w-10 cursor-pointer rounded border border-gray-300 p-0.5"
              />
              <input
                type="text"
                value={color2}
                onChange={(e) => setColor2(e.target.value)}
                className="w-24 rounded border border-gray-300 p-1 text-xs font-mono uppercase"
              />
              <span className="text-xs text-gray-500 ml-auto">{stop2}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={stop2}
              onChange={(e) => setStop2(Number(e.target.value))}
              className="w-full accent-blue-600 h-1.5 bg-gray-200 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Presets */}
        <div>
          <span className="text-xs font-semibold text-gray-600 flex items-center gap-1 mb-2">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Presets
          </span>
          <div className="flex flex-wrap gap-2">
            {presets.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => applyPreset(p.c1, p.c2, p.deg)}
                className="rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:border-blue-400 shadow-sm"
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Code Output */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
            Generated CSS Code
          </label>
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center gap-1 rounded bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 shadow-sm transition"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5" /> Copied
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" /> Copy CSS
              </>
            )}
          </button>
        </div>
        <pre className="rounded-xl border border-gray-200 bg-gray-900 p-3.5 text-xs font-mono text-green-400 overflow-x-auto select-all">
          {cssCode}
        </pre>
      </div>
    </div>
  );
}
