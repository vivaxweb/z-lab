'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Layers, Star, Clock, Search, Sparkles } from 'lucide-react';
import { HubsDrawer } from '@/components/HubsDrawer';
import { FavoritesDrawer } from '@/components/FavoritesDrawer';
import { CommandPalette } from '@/components/CommandPalette';

export function MobileBottomNav() {
  const pathname = usePathname();
  const [isHubsOpen, setIsHubsOpen] = useState(false);
  const [favDrawerTab, setFavDrawerTab] = useState<'favorites' | 'recents' | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const isHome = pathname === '/';

  return (
    <>
      {/* Floating Bottom Nav Container for Mobile (< 640px) */}
      <nav
        aria-label="Mobile Navigation"
        className="fixed bottom-4 inset-x-4 z-40 max-w-sm mx-auto sm:hidden"
      >
        <div className="flex items-center justify-around rounded-full bg-white/95 p-2 shadow-[0_12px_36px_rgba(100,50,130,0.12)] backdrop-blur-xl border border-black/5">
          {/* Home */}
          <Link
            href="/"
            className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
              isHome && !isHubsOpen && !favDrawerTab && !isSearchOpen
                ? 'bg-gradient-to-r from-[#D7F75B] to-[#FCA5BA] text-[#1E1B24] shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
            title="Home"
          >
            <Home className="h-5 w-5" />
          </Link>

          {/* Hubs */}
          <button
            type="button"
            onClick={() => setIsHubsOpen(true)}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
              isHubsOpen
                ? 'bg-gradient-to-r from-[#D7F75B] to-[#FCA5BA] text-[#1E1B24] shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
            title="Tool Hubs"
          >
            <Layers className="h-5 w-5" />
          </button>

          {/* Instant Search */}
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
              isSearchOpen
                ? 'bg-gradient-to-r from-[#D7F75B] to-[#FCA5BA] text-[#1E1B24] shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
            title="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          {/* Starred */}
          <button
            type="button"
            onClick={() => setFavDrawerTab('favorites')}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
              favDrawerTab === 'favorites'
                ? 'bg-gradient-to-r from-[#D7F75B] to-[#FCA5BA] text-[#1E1B24] shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
            title="Starred Tools"
          >
            <Star className="h-5 w-5" />
          </button>

          {/* Recents */}
          <button
            type="button"
            onClick={() => setFavDrawerTab('recents')}
            className={`flex h-11 w-11 items-center justify-center rounded-full transition ${
              favDrawerTab === 'recents'
                ? 'bg-gradient-to-r from-[#D7F75B] to-[#FCA5BA] text-[#1E1B24] shadow-sm'
                : 'text-neutral-500 hover:text-neutral-800'
            }`}
            title="Recent Tools"
          >
            <Clock className="h-5 w-5" />
          </button>
        </div>
      </nav>

      {/* Hubs Drawer */}
      <HubsDrawer isOpen={isHubsOpen} onClose={() => setIsHubsOpen(false)} />

      {/* Favorites & Recents Drawer */}
      <FavoritesDrawer
        isOpen={favDrawerTab !== null}
        onClose={() => setFavDrawerTab(null)}
        initialTab={favDrawerTab ?? 'favorites'}
      />

      {/* Search Command Palette */}
      <CommandPalette isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
}
