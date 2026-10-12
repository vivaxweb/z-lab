'use client';

import React from 'react';
import { Zap, Shield, WifiOff, Sparkles, Lock, Cpu } from 'lucide-react';

export function TickerMarquee() {
  const items = [
    { text: 'ZERO SERVER UPLOADS', icon: <Lock className="h-3.5 w-3.5" /> },
    { text: '100% IN BROWSER RAM', icon: <Cpu className="h-3.5 w-3.5" /> },
    { text: 'NO SIGNUP NEEDED', icon: <Zap className="h-3.5 w-3.5" /> },
    { text: 'FLIGHT & AIRPLANE READY', icon: <WifiOff className="h-3.5 w-3.5" /> },
    { text: 'GEN Z CREATOR TOOLBOX', icon: <Sparkles className="h-3.5 w-3.5" /> },
    { text: 'ZERO LOGS • ZERO TRACKERS', icon: <Shield className="h-3.5 w-3.5" /> },
  ];

  return (
    <div className="relative overflow-hidden border-y-2 border-[#111116] bg-[#111116] py-2.5 text-[#D4F84B]">
      <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-xs font-black uppercase tracking-wider">
        {[...items, ...items, ...items].map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <span className="text-[#FFE500]">{item.icon}</span>
            <span>{item.text}</span>
            <span className="text-[#FF6B8B]">★</span>
          </div>
        ))}
      </div>
    </div>
  );
}
