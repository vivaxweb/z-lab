'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toolsRegistry, CATEGORY_INFO, ToolConfig } from '@/lib/tools-registry';
import { Search, X, Star, ArrowRight, Zap, Sparkles } from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggling
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return toolsRegistry.slice(0, 8); // Top 8 suggestions
    return toolsRegistry.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        t.shortDescription.toLowerCase().includes(q) ||
        t.keywords.some((k) => k.toLowerCase().includes(q)) ||
        CATEGORY_INFO[t.category].name.toLowerCase().includes(q)
    );
  }, [query]);

  const handleSelect = (tool: ToolConfig) => {
    onClose();
    router.push(`/tools/${tool.category}/${tool.slug}`);
  };

  const handleKeyNav = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filtered.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filtered.length) % Math.max(1, filtered.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[selectedIndex]) {
        handleSelect(filtered[selectedIndex]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center p-4 sm:p-6 md:p-20 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white border-2 border-[#111116] rounded-2xl shadow-[6px_6px_0px_#111116] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyNav}
      >
        {/* Search Input Bar */}
        <div className="relative border-b-2 border-[#111116] bg-[#FFFDE6] p-3 flex items-center gap-3">
          <Search className="h-5 w-5 text-[#111116] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Search all 44 tools (e.g. compress, qr, hash, speech, gpa)..."
            className="w-full bg-transparent text-sm sm:text-base font-semibold text-[#111116] placeholder-[#111116]/50 outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-md text-[#111116] hover:bg-black/5 transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="hidden sm:inline-block border border-[#111116] bg-white text-[11px] font-bold px-2 py-0.5 rounded shadow-[1px_1px_0px_#111116]">
            ESC to close
          </span>
        </div>

        {/* Results List */}
        <div className="max-h-[60vh] overflow-y-auto p-2 space-y-1 bg-white">
          <div className="px-3 py-1.5 text-[11px] font-extrabold uppercase tracking-wider text-neutral-500 flex items-center justify-between">
            <span>{query ? `Found ${filtered.length} utilities` : 'Popular quick picks'}</span>
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-amber-500 fill-amber-500" /> Instant Client Execution
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="p-8 text-center text-sm text-neutral-600">
              <p className="font-bold">No utilities matched &quot;{query}&quot;</p>
              <p className="text-xs text-neutral-400 mt-1">Try another keyword like &quot;pdf&quot;, &quot;image&quot;, or &quot;password&quot;.</p>
            </div>
          ) : (
            filtered.map((tool, idx) => {
              const catMeta = CATEGORY_INFO[tool.category];
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={tool.slug}
                  onClick={() => handleSelect(tool)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-all ${
                    isSelected
                      ? 'border-[#111116] bg-[#F4FDE8] shadow-[2px_2px_0px_#111116] -translate-y-0.5'
                      : 'border-transparent hover:bg-neutral-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="h-9 w-9 rounded-xl border border-[#111116] flex items-center justify-center font-bold text-xs shrink-0 shadow-[1px_1px_0px_#111116]"
                      style={{ backgroundColor: catMeta.accentColor }}
                    >
                      <Sparkles className="h-4 w-4 text-[#111116]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#111116]">{tool.title}</span>
                        {tool.badge && (
                          <span className="border border-[#111116] bg-[#FFE500] text-[10px] font-black px-1.5 py-0.2 rounded-full">
                            {tool.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-600 line-clamp-1">{tool.shortDescription}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className="text-[10px] font-bold px-2 py-0.5 rounded-md border border-[#111116] shadow-[1px_1px_0px_#111116]"
                      style={{ backgroundColor: catMeta.bgTint }}
                    >
                      {catMeta.shortTitle}
                    </span>
                    <ArrowRight className="h-4 w-4 text-[#111116]" />
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="border-t-2 border-[#111116] bg-neutral-50 px-4 py-2.5 flex items-center justify-between text-[11px] font-bold text-neutral-600">
          <div className="flex items-center gap-3">
            <span>↑↓ Navigate</span>
            <span>↵ Select</span>
          </div>
          <span className="text-neutral-500">100% Client-Side • Zero Data Uploaded</span>
        </div>
      </div>
    </div>
  );
}
