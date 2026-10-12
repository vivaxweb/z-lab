'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { DownloadResult } from '@/components/DownloadResult';
import { Download, Upload, RefreshCw, Sparkles, Image as ImageIcon } from 'lucide-react';

interface Preset {
  id: string;
  name: string;
  width: number;
  height: number;
  ratio: string;
}

const PRESETS: Preset[] = [
  { id: 'yt-thumb', name: 'YouTube Thumbnail', width: 1280, height: 720, ratio: '16:9' },
  { id: 'ig-post', name: 'Instagram Square', width: 1080, height: 1080, ratio: '1:1' },
  { id: 'tt-story', name: 'TikTok / IG Story', width: 1080, height: 1920, ratio: '9:16' },
  { id: 'x-header', name: 'Twitter / X Header', width: 1500, height: 500, ratio: '3:1' },
  { id: 'fb-cover', name: 'Facebook Banner', width: 1200, height: 630, ratio: '1.91:1' },
];

const GRADIENTS = [
  { name: 'Cosmic Purple', c1: '#4c1d95', c2: '#ec4899' },
  { name: 'Neon Cyber', c1: '#0f172a', c2: '#06b6d4' },
  { name: 'Sunset Glow', c1: '#ea580c', c2: '#7c3aed' },
  { name: 'Emerald Wave', c1: '#064e3b', c2: '#10b981' },
  { name: 'Deep Midnight', c1: '#020617', c2: '#1e293b' },
];

export function ThumbnailCreatorTool() {
  const [selectedPreset, setSelectedPreset] = useState<Preset>(PRESETS[0]);
  const [bgType, setBgType] = useState<'gradient' | 'image' | 'color'>('gradient');
  const [gradientChoice, setGradientChoice] = useState<number>(0);
  const [solidColor, setSolidColor] = useState<string>('#18181b');
  const [bgImage, setBgImage] = useState<HTMLImageElement | null>(null);

  // Text options
  const [badgeText, setBadgeText] = useState<string>('MUST WATCH 🔥');
  const [titleText, setTitleText] = useState<string>('BUILDING MODERN WEB APPS');
  const [subtitleText, setSubtitleText] = useState<string>('100% Free • Client-Side • Ultra Fast');
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [badgeBg, setBadgeBg] = useState<string>('#ef4444');

  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [exportFilename, setExportFilename] = useState<string>('thumbnail.png');
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setBgImage(img);
        setBgType('image');
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const renderCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { width, height } = selectedPreset;
    canvas.width = width;
    canvas.height = height;

    // Draw background
    if (bgType === 'image' && bgImage) {
      // Draw image cover
      const hRatio = width / bgImage.width;
      const vRatio = height / bgImage.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShiftX = (width - bgImage.width * ratio) / 2;
      const centerShiftY = (height - bgImage.height * ratio) / 2;
      ctx.drawImage(
        bgImage,
        0,
        0,
        bgImage.width,
        bgImage.height,
        centerShiftX,
        centerShiftY,
        bgImage.width * ratio,
        bgImage.height * ratio
      );
      // Dark vignette overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(0, 0, width, height);
    } else if (bgType === 'gradient') {
      const g = GRADIENTS[gradientChoice] || GRADIENTS[0];
      const grad = ctx.createLinearGradient(0, 0, width, height);
      grad.addColorStop(0, g.c1);
      grad.addColorStop(1, g.c2);
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.fillStyle = solidColor;
      ctx.fillRect(0, 0, width, height);
    }

    // Modern decorative glow in bottom corner
    const radGlow = ctx.createRadialGradient(
      width * 0.8,
      height * 0.2,
      20,
      width * 0.8,
      height * 0.2,
      width * 0.6
    );
    radGlow.addColorStop(0, 'rgba(255, 255, 255, 0.12)');
    radGlow.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = radGlow;
    ctx.fillRect(0, 0, width, height);

    // Dynamic padding & scaling relative to canvas size
    const padding = Math.round(width * 0.08);
    let curY = height * 0.35;

    // Badge pill
    if (badgeText.trim()) {
      const badgeFontSize = Math.max(22, Math.round(width * 0.025));
      ctx.font = `800 ${badgeFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      const textMetrics = ctx.measureText(badgeText.toUpperCase());
      const pillWidth = textMetrics.width + 36;
      const pillHeight = badgeFontSize * 1.8;
      const radius = pillHeight / 2;

      ctx.fillStyle = badgeBg;
      ctx.beginPath();
      ctx.roundRect(padding, curY - pillHeight + 8, pillWidth, pillHeight, radius);
      ctx.fill();

      ctx.fillStyle = '#ffffff';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'middle';
      ctx.fillText(badgeText.toUpperCase(), padding + 18, curY - pillHeight / 2 + 8);

      curY += pillHeight + 28;
    }

    // Title Text
    if (titleText.trim()) {
      const titleFontSize = Math.max(38, Math.round(width * 0.052));
      ctx.font = `900 ${titleFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillStyle = textColor;
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';

      // Drop shadow for contrast
      ctx.shadowColor = 'rgba(0,0,0,0.7)';
      ctx.shadowBlur = 18;
      ctx.shadowOffsetX = 3;
      ctx.shadowOffsetY = 4;

      // Wrap text if needed
      const maxTextWidth = width - padding * 2;
      const words = titleText.split(' ');
      let line = '';
      const lineHeight = titleFontSize * 1.15;

      for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxTextWidth && n > 0) {
          ctx.fillText(line.trim(), padding, curY);
          line = words[n] + ' ';
          curY += lineHeight;
        } else {
          line = testLine;
        }
      }
      ctx.fillText(line.trim(), padding, curY);
      curY += lineHeight + 20;

      // Reset shadows
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;
    }

    // Subtitle Text
    if (subtitleText.trim()) {
      const subFontSize = Math.max(20, Math.round(width * 0.026));
      ctx.font = `600 ${subFontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.textAlign = 'left';
      ctx.textBaseline = 'top';
      ctx.fillText(subtitleText, padding, curY);
    }
  }, [selectedPreset, bgType, gradientChoice, solidColor, bgImage, badgeText, titleText, subtitleText, textColor, badgeBg]);

  useEffect(() => {
    renderCanvas();
  }, [renderCanvas]);

  const handleExport = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    setExportFilename(`${selectedPreset.id}-${Date.now()}.png`);
    canvas.toBlob((blob) => {
      if (blob) setResultBlob(blob);
    }, 'image/png');
  };

  return (
    <div className="space-y-6">
      {/* Preset Selector */}
      <div className="flex flex-wrap gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setSelectedPreset(p);
              setResultBlob(null);
            }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
              selectedPreset.id === p.id
                ? 'bg-violet-600 text-white border-violet-600 shadow-sm'
                : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-gray-50'
            }`}
          >
            {p.name}{' '}
            <span className="opacity-70 font-normal">({p.ratio})</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Editor Controls */}
        <div className="lg:col-span-5 space-y-5 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-5 rounded-2xl">
          <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-600" />
            Thumbnail Designer
          </h3>

          {/* Background options */}
          <div className="space-y-3">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Background Style
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setBgType('gradient')}
                className={`py-2 text-xs font-medium rounded-lg border ${
                  bgType === 'gradient'
                    ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                Gradient
              </button>
              <button
                type="button"
                onClick={() => setBgType('image')}
                className={`py-2 text-xs font-medium rounded-lg border ${
                  bgType === 'image'
                    ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                Image
              </button>
              <button
                type="button"
                onClick={() => setBgType('color')}
                className={`py-2 text-xs font-medium rounded-lg border ${
                  bgType === 'color'
                    ? 'border-violet-600 bg-violet-50 text-violet-700 dark:bg-violet-950/40 dark:text-violet-300'
                    : 'border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400'
                }`}
              >
                Solid Color
              </button>
            </div>

            {bgType === 'gradient' && (
              <div className="flex gap-2 pt-1">
                {GRADIENTS.map((g, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setGradientChoice(idx)}
                    title={g.name}
                    className={`h-8 flex-1 rounded-lg border-2 transition ${
                      gradientChoice === idx ? 'border-violet-600 scale-105' : 'border-transparent'
                    }`}
                    style={{ background: `linear-gradient(135deg, ${g.c1}, ${g.c2})` }}
                  />
                ))}
              </div>
            )}

            {bgType === 'image' && (
              <label className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl cursor-pointer hover:border-violet-500 transition">
                <Upload className="w-4 h-4 text-gray-500" />
                <span className="text-xs text-gray-600 dark:text-gray-300">
                  {bgImage ? 'Replace Background Image' : 'Upload Image Backdrop'}
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}

            {bgType === 'color' && (
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value={solidColor}
                  onChange={(e) => setSolidColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={solidColor}
                  onChange={(e) => setSolidColor(e.target.value)}
                  className="w-28 px-2 py-1.5 text-xs font-mono rounded-lg border border-gray-300 dark:border-gray-700 bg-transparent text-gray-800 dark:text-gray-200"
                />
              </div>
            )}
          </div>

          {/* Badge input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Pill Badge / Tag
              </label>
              <input
                type="color"
                value={badgeBg}
                onChange={(e) => setBadgeBg(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer"
                title="Badge Color"
              />
            </div>
            <input
              type="text"
              value={badgeText}
              onChange={(e) => setBadgeText(e.target.value)}
              placeholder="e.g. MUST WATCH 🔥"
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100"
            />
          </div>

          {/* Main Title input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
                Main Headline
              </label>
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-5 h-5 rounded cursor-pointer"
                title="Title Color"
              />
            </div>
            <textarea
              rows={2}
              value={titleText}
              onChange={(e) => setTitleText(e.target.value)}
              placeholder="Catchy video / post headline"
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100 resize-none font-bold"
            />
          </div>

          {/* Subtitle input */}
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-gray-600 dark:text-gray-400">
              Subtitle / Footer
            </label>
            <input
              type="text"
              value={subtitleText}
              onChange={(e) => setSubtitleText(e.target.value)}
              placeholder="Secondary supporting text"
              className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 dark:border-gray-700 bg-transparent text-gray-900 dark:text-gray-100"
            />
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="w-full py-2.5 px-4 bg-violet-600 hover:bg-violet-700 text-white font-semibold text-xs rounded-xl transition flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Download className="w-4 h-4" />
            Generate High-Resolution Image
          </button>
        </div>

        {/* Live Preview Canvas Container */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center p-6 bg-gray-100 dark:bg-gray-950/60 rounded-2xl border border-gray-200 dark:border-gray-800 min-h-[380px]">
          <div className="w-full flex items-center justify-between mb-3 text-xs text-gray-500">
            <span className="flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-violet-500" />
              Preview ({selectedPreset.width} × {selectedPreset.height} px)
            </span>
            <button
              type="button"
              onClick={renderCanvas}
              className="hover:text-gray-800 dark:hover:text-gray-200 flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Refresh
            </button>
          </div>

          <div className="w-full max-w-xl aspect-video rounded-xl overflow-hidden shadow-xl border border-gray-300 dark:border-gray-700 bg-black flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </div>
      </div>

      {resultBlob && (
        <DownloadResult
          blob={resultBlob}
          filename={exportFilename}
        />
      )}
    </div>
  );
}
