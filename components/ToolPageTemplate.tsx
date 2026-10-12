'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ToolConfig } from '@/lib/tools-registry';
import { CATEGORY_INFO } from '@/lib/tools-registry';
import { ShieldCheck, Star, ArrowLeft, Sparkles } from 'lucide-react';

export interface ToolPageTemplateProps {
  tool: ToolConfig;
  children: React.ReactNode;
  seoContent?: React.ReactNode;
}

export function ToolPageTemplate({ tool, children, seoContent }: ToolPageTemplateProps) {
  const cat = CATEGORY_INFO[tool.category];
  const [isFav, setIsFav] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('zlab_favorites');
      if (saved) {
        const arr = JSON.parse(saved);
        if (arr.includes(tool.slug)) setIsFav(true);
      }
    } catch {
      // ignore
    }
  }, [tool.slug]);

  const toggleFav = () => {
    try {
      const saved = localStorage.getItem('zlab_favorites');
      let arr: string[] = saved ? JSON.parse(saved) : [];
      if (arr.includes(tool.slug)) {
        arr = arr.filter((s) => s !== tool.slug);
        setIsFav(false);
      } else {
        arr.push(tool.slug);
        setIsFav(true);
      }
      localStorage.setItem('zlab_favorites', JSON.stringify(arr));
    } catch {
      // ignore
    }
  };

  return (
    <div className="min-h-screen bg-mindmate-canvas py-6 px-4 sm:px-6 sm:py-8 lg:px-8">
      <main className="mx-auto max-w-4xl space-y-6">
        {/* ── Breadcrumb & Top Bar ─────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <nav aria-label="Breadcrumb" className="text-xs font-semibold text-neutral-500">
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 shadow-sm text-neutral-700 hover:text-neutral-900 transition"
                >
                  <ArrowLeft className="h-3 w-3" />
                  <span>Home</span>
                </Link>
              </li>
              <li aria-hidden="true" className="text-neutral-300">/</li>
              <li>
                <Link
                  href={`/tools/${tool.category}`}
                  className="px-3 py-1 rounded-full text-neutral-900 font-bold shadow-sm"
                  style={{ backgroundColor: cat.accentColor }}
                >
                  {cat.name}
                </Link>
              </li>
              <li aria-hidden="true" className="text-neutral-300">/</li>
              <li aria-current="page" className="font-bold text-neutral-800">
                {tool.title}
              </li>
            </ol>
          </nav>

          {/* Favorite toggle button */}
          <button
            type="button"
            onClick={toggleFav}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold shadow-sm transition ${
              isFav ? 'bg-[#FDE68A] text-amber-900' : 'bg-white text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <Star className={`h-3.5 w-3.5 ${isFav ? 'fill-current text-amber-600' : 'text-neutral-400'}`} />
            <span>{isFav ? 'Starred' : 'Star Tool'}</span>
          </button>
        </div>

        {/* ── Tool Header (MindMate Clean Soft Card) ───────────────────────── */}
        <header className="mindmate-card p-6 sm:p-8 space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className="text-[11px] font-extrabold px-3 py-0.5 rounded-full text-neutral-900 shadow-sm"
              style={{ backgroundColor: cat.accentColor }}
            >
              {cat.shortTitle}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-800 border border-emerald-200/60">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>100% In Browser RAM</span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#1E1B24] tracking-tight pt-1">
            {tool.title}
          </h1>

          <p className="text-xs sm:text-sm font-medium text-neutral-600 leading-relaxed max-w-2xl">
            {tool.shortDescription}
          </p>
        </header>

        {/* ── Tool Interactive Workspace Card ──────────────────────────────── */}
        <section
          aria-label="Tool workspace"
          className="mindmate-card p-6 sm:p-10"
        >
          {children}
        </section>

        {/* ── SEO / Educational Content ────────────────────────────────────── */}
        {seoContent && (
          <section
            aria-label="About this tool"
            className="mindmate-card p-6 sm:p-8 space-y-3"
          >
            <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
              <Sparkles className="h-4 w-4 text-purple-600" />
              <h2 className="text-sm font-extrabold text-[#1E1B24]">About {tool.title} & Privacy Architecture</h2>
            </div>
            <div className="prose prose-sm prose-neutral max-w-none text-xs sm:text-sm leading-relaxed text-neutral-600">
              {seoContent}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
