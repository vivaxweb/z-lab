import React from 'react';
import Link from 'next/link';
import { ToolsExplorer } from '@/components/ToolsExplorer';
import { BentoLaunchpad } from '@/components/BentoLaunchpad';
import { CATEGORIES, CATEGORY_INFO } from '@/lib/tools-registry';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  WifiOff,
  Lock,
  ChevronRight,
  Timer,
  FileText,
  PenTool,
  Code2,
  Cpu,
} from 'lucide-react';

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  'creative-studio': <Sparkles className="h-5 w-5 text-[#1E1B24]" />,
  'pdf-document': <FileText className="h-5 w-5 text-[#1E1B24]" />,
  'text-writing': <PenTool className="h-5 w-5 text-[#1E1B24]" />,
  'study-focus': <Zap className="h-5 w-5 text-[#1E1B24]" />,
  'dev-utilities': <Code2 className="h-5 w-5 text-[#1E1B24]" />,
  'privacy-vault': <ShieldCheck className="h-5 w-5 text-[#1E1B24]" />,
};

export default function HomePage() {
  return (
    <main className="min-h-screen bg-mindmate-canvas px-4 py-6 sm:px-6 sm:py-10 lg:px-8 space-y-8 sm:space-y-12">
      <div className="mx-auto max-w-6xl space-y-8 sm:space-y-12">
        {/* ── 1. Hero Section (Directly from MindMate Screen 1 & Screen 2) ─── */}
        <section className="mindmate-card p-6 sm:p-10 lg:p-14 text-center">
          <div className="max-w-3xl mx-auto space-y-6">
            {/* Top Version 2.0 Pill Badge (Screen 1) */}
            <div className="inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-[#FAFAFA] px-3.5 py-1 text-xs font-bold text-neutral-600 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Version 2.0</span>
              <span className="text-[10px] text-neutral-400">⌵</span>
            </div>

            {/* Logo from Screen 1 */}
            <div className="flex items-center justify-center gap-1.5">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#1E1B24]">
                Z
              </span>
              <span className="rounded-xl bg-[#BCE6F8] px-2.5 py-1 text-base sm:text-lg font-black text-[#113B53]">
                Lab
              </span>
            </div>

            {/* Mascot Character Illustration (MindMate Style: hugging giant flask with hearts & sparkles) */}
            <div className="py-2 flex justify-center">
              <div className="relative max-w-xs sm:max-w-md w-full">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/illustrations/mindmate-hero.jpg"
                  alt="Friendly modern scientist hugging giant flask"
                  className="w-full h-auto object-cover rounded-[32px] shadow-sm"
                />
              </div>
            </div>

            {/* Display Headline with Emojis (Directly matching Screen 1) */}
            <div className="space-y-3">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-[#1E1B24] leading-tight">
                Unlock the Power of Your Device ⚡ 🔒 ✨
              </h1>

              <p className="max-w-xl mx-auto text-sm sm:text-base text-neutral-600 font-medium leading-relaxed">
                44+ fast, privacy-first browser utilities that never leave your device.
                Compress photos, edit PDFs, test codes, and hash passwords with zero server uploads.
              </p>
            </div>

            {/* Signature MindMate Pill Button with Circular Arrow Chip */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
              <a
                href="#explore-tools"
                className="btn-mindmate-gradient inline-flex items-center gap-3 pl-2 pr-6 py-2 text-sm sm:text-base font-extrabold"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black/10 text-neutral-900 font-black">
                  <ChevronRight className="h-4 w-4" />
                </span>
                <span>Get Started</span>
              </a>

              <a
                href="#category-hubs"
                className="text-sm font-bold text-neutral-500 hover:text-neutral-900 transition px-3 py-2"
              >
                Browse Hubs
              </a>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-3 text-xs font-bold text-neutral-600">
              <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-emerald-800">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" /> 100% In Browser RAM
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-blue-800">
                <Lock className="h-3.5 w-3.5 text-blue-600" /> Zero Server Leaks
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-purple-800">
                <WifiOff className="h-3.5 w-3.5 text-purple-600" /> Offline PWA Ready
              </span>
            </div>
          </div>
        </section>

        {/* ── 2. Category Hub Circular Icons (Directly from MindMate Screen 2) ─ */}
        <section id="category-hubs" className="mindmate-card p-6 sm:p-8 space-y-6">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-black text-[#1E1B24]">
              Choose Your Workspace
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium">
              Explore utilities categorized for creative flow, deep focus, and dev tasks.
            </p>
          </div>

          {/* 6 Circular Categories */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {CATEGORIES.map((catKey) => {
              const cat = CATEGORY_INFO[catKey];
              return (
                <Link
                  key={catKey}
                  href={`/tools/${catKey}`}
                  className="group flex flex-col items-center text-center p-3 rounded-2xl hover:bg-neutral-50 transition"
                >
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-full shadow-sm transition-transform group-hover:scale-110 mb-2.5"
                    style={{ backgroundColor: cat.accentColor }}
                  >
                    {CATEGORY_ICONS[catKey] || <Sparkles className="h-5 w-5 text-[#1E1B24]" />}
                  </div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-[#1E1B24] group-hover:text-purple-700 transition">
                    {cat.name}
                  </h3>
                  <span className="text-[10px] text-neutral-400 font-medium mt-0.5">
                    {cat.shortTitle}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* ── 3. Device Energy & Quick Suggestion (From MindMate Screen 2) ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Card 1: "YOUR DEVICE MEMORY 100%" (Exact replica of "YOUR MENTAL ENERGY 72%") */}
          <div className="lg:col-span-6 mindmate-card p-6 sm:p-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400">
                  YOUR DEVICE EXECUTION
                </span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-3xl sm:text-4xl font-black text-[#1E1B24]">100%</span>
                  <span className="text-xs font-bold text-emerald-600">Local Memory</span>
                </div>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D7F75B] text-neutral-900 shadow-sm">
                <Cpu className="h-5 w-5" />
              </div>
            </div>

            {/* Stacked Rounded Pastel Bar Chart (From Screen 2) */}
            <div className="space-y-2 pt-1">
              <div className="flex gap-2 h-4 w-full">
                <div className="h-full rounded-full bg-[#D7F75B] transition-all" style={{ width: '45%' }} />
                <div className="h-full rounded-full bg-[#BAE6FD] transition-all" style={{ width: '35%' }} />
                <div className="h-full rounded-full bg-[#FCA5BA] transition-all" style={{ width: '20%' }} />
              </div>

              <div className="flex items-center justify-between text-[11px] font-bold text-neutral-400 pt-1">
                <span>Wasm</span>
                <span>Canvas</span>
                <span>WebCrypto</span>
                <span>Audio</span>
                <span>PDF-Lib</span>
                <span>PWA</span>
                <span>Offline</span>
              </div>
            </div>
          </div>

          {/* Card 2: "AI Suggestion" Banner (Exact replica of Sunset Gradient Banner from Screen 2) */}
          <div className="lg:col-span-6 rounded-3xl bg-mindmate-sunset p-6 sm:p-7 shadow-sm flex flex-col justify-between text-[#1E1B24]">
            <div className="flex items-center justify-between pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-black/60">
                Quick Feature Spotlight
              </span>
              <Link href="/tools/study-focus/pomodoro-timer" className="text-black/80 hover:text-black">
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex items-center gap-4 my-2">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/10 shrink-0">
                <Timer className="h-6 w-6 text-neutral-900" />
              </div>
              <div>
                <h3 className="text-lg font-black text-neutral-900 leading-snug">
                  Pomodoro Focus Sprint
                </h3>
                <p className="text-xs font-medium text-neutral-800">
                  25 min interval • Lo-Fi ambient audio synthesizer
                </p>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <Link
                href="/tools/study-focus/pomodoro-timer"
                className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-black text-neutral-900 shadow-sm hover:bg-neutral-50 transition"
              >
                <span>Launch Sprint</span>
                <ChevronRight className="h-3 w-3" />
              </Link>
              <span className="text-xs font-black text-black/70">
                +44 tools ready ↓
              </span>
            </div>
          </div>
        </div>

        {/* ── 4. Interactive Launchpad Mini-Widgets ─────────────────────────── */}
        <BentoLaunchpad />

        {/* ── 5. Full Tools Explorer ───────────────────────────────────────── */}
        <section id="explore-tools" className="space-y-4">
          <div className="text-center sm:text-left">
            <h2 className="text-2xl sm:text-3xl font-black text-[#1E1B24]">
              All 44+ Browser Utilities
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium">
              Click any tool to launch instantly in your browser RAM.
            </p>
          </div>
          <ToolsExplorer />
        </section>
      </div>
    </main>
  );
}
