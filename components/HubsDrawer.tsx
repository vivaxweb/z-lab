'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES, CATEGORY_INFO, toolsRegistry, ToolCategory } from '@/lib/tools-registry';
import { X, Sparkles, FileText, PenTool, Zap, Code2, ShieldCheck, ArrowRight } from 'lucide-react';

interface HubsDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCategory?: (cat: ToolCategory) => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Sparkles: <Sparkles className="h-6 w-6 text-[#111116]" />,
  FileText: <FileText className="h-6 w-6 text-[#111116]" />,
  PenTool: <PenTool className="h-6 w-6 text-[#111116]" />,
  Zap: <Zap className="h-6 w-6 text-[#111116]" />,
  Code2: <Code2 className="h-6 w-6 text-[#111116]" />,
  ShieldCheck: <ShieldCheck className="h-6 w-6 text-[#111116]" />,
};

export function HubsDrawer({ isOpen, onClose, onSelectCategory }: HubsDrawerProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in"
      onClick={onClose}
    >
      <div
        className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white border-t-2 sm:border-2 border-[#111116] rounded-t-3xl sm:rounded-3xl shadow-[0px_-4px_0px_#111116] sm:shadow-[6px_6px_0px_#111116] p-5 sm:p-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b-2 border-[#111116]">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#111116] bg-[#D4F84B] text-xs font-black shadow-[1px_1px_0px_#111116]">
              ★
            </span>
            <div>
              <h2 className="text-lg font-black text-[#111116]">Tool Hubs & Categories</h2>
              <p className="text-xs text-neutral-500">Pick a category to explore all dedicated utilities</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full border border-[#111116] hover:bg-neutral-100 transition shadow-[1px_1px_0px_#111116]"
          >
            <X className="h-5 w-5 text-[#111116]" />
          </button>
        </div>

        {/* 6 Hubs Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-5">
          {CATEGORIES.map((catKey) => {
            const cat = CATEGORY_INFO[catKey];
            const count = toolsRegistry.filter((t) => t.category === catKey).length;

            return (
              <Link
                key={catKey}
                href={`/tools/${catKey}`}
                onClick={() => {
                  onSelectCategory?.(catKey);
                  onClose();
                }}
                className="group relative flex flex-col justify-between p-4 rounded-2xl border-2 border-[#111116] shadow-[3px_3px_0px_#111116] transition-all hover:-translate-y-1 hover:shadow-[5px_5px_0px_#111116] active:translate-y-0.5"
                style={{ backgroundColor: cat.bgTint }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-11 w-11 rounded-xl border-2 border-[#111116] flex items-center justify-center shadow-[2px_2px_0px_#111116] shrink-0"
                      style={{ backgroundColor: cat.accentColor }}
                    >
                      {ICON_MAP[cat.icon] || <Sparkles className="h-5 w-5 text-[#111116]" />}
                    </div>
                    <div>
                      <h3 className="font-extrabold text-base text-[#111116] group-hover:underline">
                        {cat.name}
                      </h3>
                      <p className="text-xs text-neutral-600 line-clamp-1">{cat.tagline}</p>
                    </div>
                  </div>

                  <span className="border border-[#111116] bg-white text-[11px] font-black px-2 py-0.5 rounded-full shadow-[1px_1px_0px_#111116] shrink-0">
                    {count} tools
                  </span>
                </div>

                <div className="mt-3 pt-2.5 border-t border-[#111116]/20 flex items-center justify-between text-xs font-bold text-[#111116]">
                  <span className="text-[11px] text-neutral-600 line-clamp-1">{cat.description}</span>
                  <ArrowRight className="h-4 w-4 -translate-x-1 group-hover:translate-x-0 transition-transform shrink-0 ml-2" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="mt-5 p-3 rounded-xl border border-[#111116] bg-[#FFFDE6] flex items-center justify-between text-xs font-semibold text-[#111116]">
          <span>⚡ All 44 utilities run 100% in browser RAM.</span>
          <span className="text-neutral-500 hidden sm:inline">Zero uploads • Offline ready</span>
        </div>
      </div>
    </div>
  );
}
