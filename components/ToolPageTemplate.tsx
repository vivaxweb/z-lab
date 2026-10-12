'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ToolConfig } from '@/lib/tools-registry';
import { CATEGORY_INFO } from '@/lib/tools-registry';
import { useAuth } from '@/lib/auth-context';
import { AdminStore } from '@/lib/admin-store';
import { ShieldCheck, Star, ArrowLeft, Sparkles, AlertTriangle, Wrench, MessageSquare } from 'lucide-react';

export interface ToolPageTemplateProps {
  tool: ToolConfig;
  children: React.ReactNode;
  seoContent?: React.ReactNode;
}

export function ToolPageTemplate({ tool, children, seoContent }: ToolPageTemplateProps) {
  const cat = CATEGORY_INFO[tool.category];
  const { toggleFavorite, favorites, addRecentTool } = useAuth();
  const isFav = favorites.includes(tool.slug);
  const [override, setOverride] = useState<{ enabled?: boolean; isMaintenance?: boolean; maintenanceMessage?: string }>({});

  useEffect(() => {
    try {
      addRecentTool(tool.slug);
      const overrides = AdminStore.getToolOverrides();
      if (overrides[tool.slug]) {
        setOverride(overrides[tool.slug]);
      }
    } catch {
      // ignore
    }
  }, [tool.slug, addRecentTool]);

  const toggleFav = () => {
    toggleFavorite(tool.slug);
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
        {override.enabled === false ? (
          <section
            aria-label="Tool disabled"
            className="mindmate-card p-8 sm:p-12 text-center space-y-4 border-2 border-rose-200 bg-rose-50/20"
          >
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 mx-auto flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#1E1B24]">Tool Temporarily Offline</h3>
              <p className="text-xs text-neutral-500 mt-1 max-w-md mx-auto">
                This utility is undergoing server maintenance or system updates. Please check back shortly or explore our other tools.
              </p>
            </div>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#1E1B24] text-white text-xs font-bold hover:opacity-90 transition"
            >
              Browse Other Tools
            </Link>
          </section>
        ) : (
          <section
            aria-label="Tool workspace"
            className="mindmate-card p-6 sm:p-10 space-y-4"
          >
            {override.isMaintenance && (
              <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold flex items-center gap-2">
                <Wrench className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Notice: {override.maintenanceMessage || 'This tool is in maintenance mode. Some features may experience delays.'}
                </span>
              </div>
            )}
            {children}

            <div className="pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
              <span>Runs 100% locally on your machine</span>
              <Link
                href="/account"
                className="hover:text-neutral-700 transition flex items-center gap-1 font-semibold"
              >
                <MessageSquare className="w-3 h-3" />
                <span>Report an issue with this tool</span>
              </Link>
            </div>
          </section>
        )}

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
