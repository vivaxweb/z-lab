import type { Metadata } from 'next';
import './globals.css';
import { Navbar } from '@/components/Navbar';
import { MobileBottomNav } from '@/components/MobileBottomNav';
import { FooterYear } from '@/components/FooterYear';
import { ShieldCheck, Zap, Lock, BatteryCharging } from 'lucide-react';

import { AuthProvider } from '@/lib/auth-context';
import { AnnouncementBanner } from '@/components/AnnouncementBanner';

export const metadata: Metadata = {
  title: {
    default: 'Z Lab — Free Privacy-First Browser Tools for Gen Z',
    template: '%s | Z Lab',
  },
  description:
    'Z Lab is a free, privacy-first toolbox for Gen Z. 44+ client-side utilities that run entirely in your browser — zero uploads, zero tracking, works offline.',
  keywords: [
    'free tools',
    'privacy tools',
    'browser tools',
    'no upload',
    'pdf tools',
    'image tools',
    'qr code',
    'hash generator',
    'client side',
  ],
  manifest: '/manifest.webmanifest',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <body className="flex min-h-full flex-col bg-[#FDFCF9] text-[#111116] selection:bg-[#FFE500] selection:text-[#111116]">
        <AuthProvider>
          {/* ── Global Announcement Bar from Admin ───────────────────────────── */}
          <AnnouncementBanner />

          {/* ── Global Neo-Pop Header ────────────────────────────────────────── */}
          <Navbar />

          {/* ── Page Content (pb-24 on mobile so bottom bar doesn't obscure content) ─ */}
          <div className="flex flex-1 flex-col pb-20 sm:pb-0">{children}</div>

          {/* ── Global Floating Mobile Navigation Bar ────────────────────────── */}
          <MobileBottomNav />

        {/* ── Neo-Brutalist Footer ─────────────────────────────────────────── */}
        <footer className="border-t-2 border-[#111116] bg-white mt-auto">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              {/* Brand and year */}
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl border-2 border-[#111116] bg-[#D4F84B] text-sm font-black text-[#111116] shadow-[2px_2px_0px_#111116]">
                  Z
                </span>
                <div>
                  <p className="text-xs font-black text-[#111116]">
                    Z Lab — Client-Side Utility Box
                  </p>
                  <p className="text-[11px] text-neutral-500 font-medium">
                    © <FooterYear /> Built with zero server trackers.
                  </p>
                </div>
              </div>

              {/* Status pills in footer */}
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-black text-[#111116]">
                <span className="flex items-center gap-1 rounded-lg border border-[#111116] bg-[#ECFDF5] px-2 py-0.5 shadow-[1px_1px_0px_#111116]">
                  <ShieldCheck className="h-3 w-3 text-emerald-600" /> Zero Uploads
                </span>
                <span className="flex items-center gap-1 rounded-lg border border-[#111116] bg-[#F4FDE8] px-2 py-0.5 shadow-[1px_1px_0px_#111116]">
                  <BatteryCharging className="h-3 w-3 text-lime-700" /> In-Browser RAM
                </span>
                <span className="flex items-center gap-1 rounded-lg border border-[#111116] bg-[#FFFDE6] px-2 py-0.5 shadow-[1px_1px_0px_#111116]">
                  <Zap className="h-3 w-3 text-amber-600" /> PWA Installable
                </span>
              </div>
            </div>
          </div>
        </footer>
        </AuthProvider>
      </body>
    </html>
  );
}
