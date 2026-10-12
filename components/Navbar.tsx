'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { CATEGORIES, CATEGORY_INFO } from '@/lib/tools-registry';
import { CommandPalette } from '@/components/CommandPalette';
import { HubsDrawer } from '@/components/HubsDrawer';
import { FavoritesDrawer } from '@/components/FavoritesDrawer';
import { PwaRegister } from '@/components/PwaRegister';
import {
  Search,
  Star,
  Sparkles,
  Layers,
  Bell,
  Cpu,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [isHubsOpen, setIsHubsOpen] = useState(false);
  const [isFavsOpen, setIsFavsOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    try {
      const favs = localStorage.getItem('zlab_favorites');
      if (favs) setFavCount(JSON.parse(favs).length);
    } catch {
      // ignore
    }
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-black/[0.04] transition-all">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          {/* Brand Logo & Version Pill (Direct from MindMate Screen 1) */}
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 text-xl font-bold tracking-tight text-[#1E1B24] hover:opacity-90 transition"
            >
              <span className="font-extrabold text-2xl tracking-tight">Z</span>
              <span className="rounded-lg bg-[#BCE6F8] px-2 py-0.5 text-sm font-extrabold text-[#113B53]">
                Lab
              </span>
            </Link>

            {/* MindMate Version 2.0 Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 rounded-full border border-black/5 bg-[#FAFAFA] px-3 py-1 text-xs font-semibold text-neutral-600 shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" />
              <span>Version 2.0</span>
              <span className="text-[10px] text-neutral-400">⌵</span>
            </div>
          </div>

          {/* Center Category Navigation (Desktop) */}
          <nav aria-label="Tool hubs" className="hidden lg:flex items-center gap-1">
            <button
              onClick={() => setIsHubsOpen(true)}
              className="flex items-center gap-1.5 rounded-full bg-neutral-100 px-3.5 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-200 transition"
            >
              <Layers className="h-3.5 w-3.5" />
              <span>All Hubs</span>
            </button>

            {CATEGORIES.slice(0, 4).map((catKey) => {
              const cat = CATEGORY_INFO[catKey];
              const isActive = pathname.startsWith(`/tools/${catKey}`);
              return (
                <Link
                  key={catKey}
                  href={`/tools/${catKey}`}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
                    isActive
                      ? 'bg-[#EADFF2] text-[#3D1E4D]'
                      : 'text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {cat.shortTitle}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Items */}
          <div className="flex items-center gap-2.5">
            {/* Quick Search Button (Cmd+K) */}
            <button
              type="button"
              onClick={() => setIsCommandOpen(true)}
              className="flex items-center gap-2 rounded-full border border-black/5 bg-[#FAFAFA] px-3 py-1.5 text-xs font-semibold text-neutral-700 hover:bg-neutral-100 transition shadow-sm"
              title="Search utilities (Ctrl+K or Cmd+K)"
            >
              <Search className="h-3.5 w-3.5 text-neutral-500" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-block rounded-full bg-white px-1.5 py-0.2 text-[10px] font-mono border border-black/5 text-neutral-500">
                ⌘K
              </kbd>
            </button>

            {/* Circular RAM Badge (Inspired by Elizabeth Rose circular 78% badge from MindMate Screen 2) */}
            <div
              className="hidden sm:flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-800 border border-emerald-200/60"
              title="100% of processing happens in your browser RAM without uploading."
            >
              <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-black text-white">
                ✓
              </span>
              <span>100% Local</span>
            </div>

            {/* Starred Favorites Launcher */}
            <button
              type="button"
              onClick={() => setIsFavsOpen(true)}
              className="relative p-2 rounded-full bg-neutral-100 hover:bg-[#FDE68A] text-neutral-700 transition"
              title="View starred utilities"
            >
              <Star className="h-4 w-4 fill-current text-amber-500" />
              {favCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#FCA5BA] text-[9px] font-extrabold text-neutral-900">
                  {favCount}
                </span>
              )}
            </button>

            {/* PWA Install */}
            <PwaRegister />
          </div>
        </div>
      </header>

      {/* Global Command Palette */}
      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />

      {/* Global Hubs Drawer */}
      <HubsDrawer isOpen={isHubsOpen} onClose={() => setIsHubsOpen(false)} />

      {/* Global Favorites Drawer */}
      <FavoritesDrawer isOpen={isFavsOpen} onClose={() => setIsFavsOpen(false)} />
    </>
  );
}
