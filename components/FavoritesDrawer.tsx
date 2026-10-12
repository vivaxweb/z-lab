'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { toolsRegistry, CATEGORY_INFO } from '@/lib/tools-registry';
import { X, Star, Clock, ArrowRight, Trash2, Zap } from 'lucide-react';

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'favorites' | 'recents';
}

export function FavoritesDrawer({ isOpen, onClose, initialTab = 'favorites' }: FavoritesDrawerProps) {
  const [activeTab, setActiveTab] = useState<'favorites' | 'recents'>(initialTab);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recents, setRecents] = useState<string[]>([]);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (isOpen) {
      try {
        const favs = localStorage.getItem('zlab_favorites');
        if (favs) setFavorites(JSON.parse(favs));
        const recs = localStorage.getItem('zlab_recents');
        if (recs) setRecents(JSON.parse(recs));
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  const clearRecents = () => {
    setRecents([]);
    try {
      localStorage.removeItem('zlab_recents');
    } catch {
      // ignore
    }
  };

  const removeFav = (slug: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const next = favorites.filter((s) => s !== slug);
    setFavorites(next);
    try {
      localStorage.setItem('zlab_favorites', JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  const favoriteTools = toolsRegistry.filter((t) => favorites.includes(t.slug));
  const recentTools = recents
    .map((slug) => toolsRegistry.find((t) => t.slug === slug))
    .filter(Boolean) as typeof toolsRegistry;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[85vh] overflow-y-auto bg-white border-t-2 sm:border-2 border-[#111116] rounded-t-3xl sm:rounded-3xl shadow-[0px_-4px_0px_#111116] sm:shadow-[6px_6px_0px_#111116] p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header & Tabs */}
        <div className="flex items-center justify-between pb-3 border-b-2 border-[#111116]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('favorites')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border transition ${
                activeTab === 'favorites'
                  ? 'border-[#111116] bg-[#FFE500] text-[#111116] shadow-[2px_2px_0px_#111116]'
                  : 'border-transparent text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Star className="h-3.5 w-3.5 fill-current" />
              <span>Starred ({favorites.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('recents')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black border transition ${
                activeTab === 'recents'
                  ? 'border-[#111116] bg-[#D4F84B] text-[#111116] shadow-[2px_2px_0px_#111116]'
                  : 'border-transparent text-neutral-600 hover:bg-neutral-100'
              }`}
            >
              <Clock className="h-3.5 w-3.5" />
              <span>Recent ({recentTools.length})</span>
            </button>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-[#111116] hover:bg-neutral-100 transition shadow-[1px_1px_0px_#111116]"
          >
            <X className="h-4 w-4 text-[#111116]" />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-2">
          {activeTab === 'favorites' ? (
            favoriteTools.length === 0 ? (
              <div className="py-12 text-center text-neutral-500">
                <Star className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
                <p className="font-bold text-sm text-[#111116]">No starred utilities yet</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Click the star icon (★) on any tool card to pin it here for 1-tap quick access!
                </p>
              </div>
            ) : (
              favoriteTools.map((tool) => {
                const cat = CATEGORY_INFO[tool.category];
                return (
                  <Link
                    key={tool.slug}
                    href={`/tools/${tool.category}/${tool.slug}`}
                    onClick={onClose}
                    className="flex items-center justify-between p-3 rounded-xl border-2 border-[#111116] bg-white shadow-[2px_2px_0px_#111116] hover:-translate-y-0.5 transition"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="h-8 w-8 rounded-lg border border-[#111116] flex items-center justify-center font-bold text-xs"
                        style={{ backgroundColor: cat.accentColor }}
                      >
                        ★
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#111116]">{tool.title}</h4>
                        <span className="text-[10px] font-bold text-neutral-500">{cat.name}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => removeFav(tool.slug, e)}
                        className="p-1 text-neutral-400 hover:text-red-500 transition"
                        title="Remove from favorites"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <ArrowRight className="h-4 w-4 text-[#111116]" />
                    </div>
                  </Link>
                );
              })
            )
          ) : (
            recentTools.length === 0 ? (
              <div className="py-12 text-center text-neutral-500">
                <Clock className="h-10 w-10 text-neutral-300 mx-auto mb-2" />
                <p className="font-bold text-sm text-[#111116]">No recently used tools</p>
                <p className="text-xs text-neutral-400 mt-1">
                  Tools you launch will automatically show up here for fast resuming.
                </p>
              </div>
            ) : (
              <>
                <div className="flex justify-end pb-1">
                  <button
                    onClick={clearRecents}
                    className="text-[11px] font-bold text-neutral-500 hover:text-red-600 underline"
                  >
                    Clear history
                  </button>
                </div>
                {recentTools.map((tool) => {
                  const cat = CATEGORY_INFO[tool.category];
                  return (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.category}/${tool.slug}`}
                      onClick={onClose}
                      className="flex items-center justify-between p-3 rounded-xl border-2 border-[#111116] bg-white shadow-[2px_2px_0px_#111116] hover:-translate-y-0.5 transition"
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="h-8 w-8 rounded-lg border border-[#111116] flex items-center justify-center font-bold text-xs"
                          style={{ backgroundColor: cat.accentColor }}
                        >
                          ⚡
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-[#111116]">{tool.title}</h4>
                          <span className="text-[10px] font-bold text-neutral-500">{cat.name}</span>
                        </div>
                      </div>
                      <ArrowRight className="h-4 w-4 text-[#111116]" />
                    </Link>
                  );
                })}
              </>
            )
          )}
        </div>
      </div>
    </div>
  );
}
