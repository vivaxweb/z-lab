'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import {
  toolsRegistry,
  CATEGORIES,
  CATEGORY_INFO,
  ToolConfig,
} from '@/lib/tools-registry';
import { Search, X, Star, ArrowRight, Sparkles } from 'lucide-react';

export function ToolsExplorer() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);

  // Load favorites & recents from localStorage
  useEffect(() => {
    try {
      const savedFavs = localStorage.getItem('zlab_favorites');
      if (savedFavs) {
        setFavorites(JSON.parse(savedFavs));
      }
      const savedRecents = localStorage.getItem('zlab_recents');
      if (savedRecents) {
        setRecents(JSON.parse(savedRecents));
      }
    } catch {
      // ignore
    }
  }, []);

  const toggleFavorite = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = favorites.includes(slug)
      ? favorites.filter((s) => s !== slug)
      : [...favorites, slug];
    setFavorites(next);
    try {
      localStorage.setItem('zlab_favorites', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const recordRecent = (slug: string) => {
    try {
      const next = [slug, ...recents.filter((s) => s !== slug)].slice(0, 10);
      setRecents(next);
      localStorage.setItem('zlab_recents', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const filteredTools = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return toolsRegistry.filter((t) => {
      const matchesCategory = selectedCategory === 'all' || t.category === selectedCategory;
      const matchesSearch =
        !q ||
        t.title.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.slug.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const favoriteTools = useMemo(() => {
    return toolsRegistry.filter((t) => favorites.includes(t.slug));
  }, [favorites]);

  return (
    <div className="space-y-6">
      {/* ── Search & Filter Controls ───────────────────────────────────── */}
      <div className="space-y-4">
        {/* Soft MindMate Search Box */}
        <div className="relative mx-auto max-w-2xl">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all 44+ utilities (e.g. compress, qr, hash, speech, gpa)..."
            className="w-full rounded-full border border-black/5 bg-white py-3.5 pl-12 pr-12 text-sm sm:text-base font-medium text-[#1E1B24] placeholder-neutral-400 shadow-sm outline-none focus:ring-2 focus:ring-purple-200 transition"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 hover:text-neutral-700"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Pills (Soft MindMate Pills) */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1 px-1 sm:justify-center">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition shadow-sm ${
              selectedCategory === 'all'
                ? 'bg-neutral-900 text-white'
                : 'bg-white border border-black/5 text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            All Tools ({toolsRegistry.length})
          </button>

          {CATEGORIES.map((catKey) => {
            const cat = CATEGORY_INFO[catKey];
            const count = toolsRegistry.filter((t) => t.category === catKey).length;
            const isSelected = selectedCategory === catKey;

            return (
              <button
                key={catKey}
                type="button"
                onClick={() => setSelectedCategory(catKey)}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold transition shadow-sm ${
                  isSelected
                    ? 'bg-[#EADFF2] text-[#3D1E4D] font-extrabold ring-2 ring-purple-300'
                    : 'bg-white border border-black/5 text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                {cat.shortTitle} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Favorite Tools Section (if any) ────────────────────────────── */}
      {favoriteTools.length > 0 && !searchQuery && selectedCategory === 'all' && (
        <section className="space-y-3 pt-2">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-700">
            <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
            <span>Your Starred Utilities ({favoriteTools.length})</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favoriteTools.map((tool) => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                isFav={true}
                onToggleFav={(e) => toggleFavorite(tool.slug, e)}
                onLaunch={() => recordRecent(tool.slug)}
              />
            ))}
          </div>
        </section>
      )}

      {/* ── Main Filtered Grid ────────────────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
          <span>
            Showing {filteredTools.length} {filteredTools.length === 1 ? 'utility' : 'utilities'}
          </span>
          {(searchQuery || selectedCategory !== 'all') && (
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="text-purple-700 font-bold hover:underline"
            >
              Reset filters
            </button>
          )}
        </div>

        {filteredTools.length === 0 ? (
          <div className="mindmate-card py-16 text-center">
            <p className="text-base font-bold text-neutral-700">
              No tools matched &quot;{searchQuery}&quot;
            </p>
            <p className="text-xs text-neutral-400 mt-1">
              Try searching for &quot;compress&quot;, &quot;qr&quot;, &quot;pdf&quot;, or select &quot;All Tools&quot;
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTools.map((tool) => (
              <ToolCard
                key={tool.slug}
                tool={tool}
                isFav={favorites.includes(tool.slug)}
                onToggleFav={(e) => toggleFavorite(tool.slug, e)}
                onLaunch={() => recordRecent(tool.slug)}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function ToolCard({
  tool,
  isFav,
  onToggleFav,
  onLaunch,
}: {
  tool: ToolConfig;
  isFav: boolean;
  onToggleFav: (e: React.MouseEvent) => void;
  onLaunch: () => void;
}) {
  const cat = CATEGORY_INFO[tool.category];

  return (
    <Link
      href={`/tools/${tool.category}/${tool.slug}`}
      onClick={onLaunch}
      className="group relative flex flex-col justify-between rounded-3xl bg-white p-5 shadow-[0_8px_24px_rgba(100,50,130,0.05)] border border-black/[0.04] hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(100,50,130,0.09)] transition-all"
    >
      <div className="space-y-2.5">
        {/* Header pill & star */}
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full text-neutral-900 shadow-sm"
            style={{ backgroundColor: cat.accentColor }}
          >
            {cat.shortTitle}
          </span>

          <button
            type="button"
            onClick={onToggleFav}
            className="p-1 rounded-full text-neutral-300 hover:text-amber-500 transition"
            title={isFav ? 'Remove from favorites' : 'Star this tool'}
          >
            <Star
              className={`h-4 w-4 ${isFav ? 'fill-amber-400 text-amber-500' : ''}`}
            />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-base font-extrabold text-[#1E1B24] group-hover:text-purple-700 transition leading-snug">
          {tool.title}
        </h3>

        {/* Short description */}
        <p className="text-xs leading-relaxed text-neutral-500 font-medium line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>

      {/* Footer trigger */}
      <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-400 group-hover:text-neutral-900 transition">
        <span>Launch tool</span>
        <ArrowRight className="h-3.5 w-3.5 -translate-x-1 group-hover:translate-x-0 transition-transform" />
      </div>
    </Link>
  );
}
