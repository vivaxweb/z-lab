'use client';

import React from 'react';
import Link from 'next/link';
import { CATEGORIES, CATEGORY_INFO, toolsRegistry, ToolCategory } from '@/lib/tools-registry';
import {
  LabBeakerIllustration,
  StudyFocusIllustration,
  CreativeStudioIllustration,
  PrivacyVaultIllustration,
  SmartDocIllustration,
  DevBotIllustration,
  StarburstSticker,
} from '@/components/svg/LabIllustrations';
import { ArrowRight, Sparkles } from 'lucide-react';

const SVG_MAP: Record<ToolCategory, React.ReactNode> = {
  'creative-studio': <CreativeStudioIllustration className="w-20 h-20 sm:w-24 sm:h-24" />,
  'pdf-document': <SmartDocIllustration className="w-20 h-20 sm:w-24 sm:h-24" />,
  'text-writing': <LabBeakerIllustration className="w-20 h-20 sm:w-24 sm:h-24" />,
  'study-focus': <StudyFocusIllustration className="w-20 h-20 sm:w-24 sm:h-24" />,
  'dev-utilities': <DevBotIllustration className="w-20 h-20 sm:w-24 sm:h-24" />,
  'privacy-vault': <PrivacyVaultIllustration className="w-20 h-20 sm:w-24 sm:h-24" />,
};

interface HubsShowcaseProps {
  onSelectCategory?: (cat: ToolCategory) => void;
}

export function HubsShowcase({ onSelectCategory }: HubsShowcaseProps) {
  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-purple-900 shadow-sm mb-1.5 border border-purple-100">
            <Sparkles className="h-3.5 w-3.5 text-purple-600" />
            <span>6 Dedicated Laboratory Hubs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#1E1B24] tracking-tight">
            Browse by Creative & Utility Category
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium">
            Tailor-made workspaces built for speed, privacy, and zero cloud uploads.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {CATEGORIES.map((catKey) => {
          const cat = CATEGORY_INFO[catKey];
          const count = toolsRegistry.filter((t) => t.category === catKey).length;

          return (
            <Link
              key={catKey}
              href={`/tools/${catKey}`}
              onClick={() => onSelectCategory?.(catKey)}
              className="group relative flex flex-col justify-between p-6 rounded-3xl bg-white shadow-[0_8px_30px_rgba(100,50,130,0.06)] border border-black/[0.04] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(100,50,130,0.12)] active:translate-y-0 overflow-hidden"
            >
              {/* Subtle top decorative star sticker */}
              <div className="absolute top-3 right-3 opacity-60 group-hover:opacity-100 group-hover:rotate-12 transition-all">
                <StarburstSticker className="w-5 h-5 text-amber-400" />
              </div>

              <div>
                {/* Header row with Title & Floating Pure SVG */}
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1.5 max-w-[65%]">
                    <span
                      className="inline-block text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-neutral-900 shadow-sm"
                      style={{ backgroundColor: cat.accentColor }}
                    >
                      {cat.shortTitle}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black text-[#1E1B24] group-hover:text-purple-700 leading-snug transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs font-semibold text-neutral-400">{cat.tagline}</p>
                  </div>

                  {/* Pure Vector SVG Illustration */}
                  <div className="shrink-0 -mt-2 -mr-1 transition-transform group-hover:scale-105 group-hover:rotate-3">
                    {SVG_MAP[catKey]}
                  </div>
                </div>

                <p className="text-xs text-neutral-500 mt-3 line-clamp-2 leading-relaxed font-medium">
                  {cat.description}
                </p>
              </div>

              {/* Bottom pill row */}
              <div className="mt-5 pt-3.5 border-t border-neutral-100 flex items-center justify-between text-xs font-bold text-neutral-500">
                <span className="bg-[#F4ECF8] text-purple-950 text-[11px] font-extrabold px-3 py-1 rounded-full">
                  {count} utilities
                </span>
                <span className="inline-flex items-center gap-1.5 font-extrabold text-[#1E1B24] group-hover:text-purple-700 group-hover:translate-x-1 transition-all">
                  <span>Enter Hub</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
