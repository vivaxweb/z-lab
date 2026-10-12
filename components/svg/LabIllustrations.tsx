import React from 'react';

/**
 * Custom Transparent Neo-Pop SVGs for Z Lab.
 * Pure vector art: no rectangular background, transparent, scales smoothly, zero network latency.
 */

// ── 1. Lab Bubbling Flask Illustration (Hero & General Lab) ───────────────────
export function LabBeakerIllustration({ className = 'w-36 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="beakerLiquid" x1="40" y1="90" x2="120" y2="150" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#D4F84B" />
          <stop offset="50%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#38BDF8" />
        </linearGradient>
        <linearGradient id="beakerFoam" x1="50" y1="75" x2="110" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE500" />
          <stop offset="100%" stopColor="#FF6B8B" />
        </linearGradient>
      </defs>

      {/* Floating Sparkles & Stars */}
      <path d="M28 42L31 32L34 42L44 45L34 48L31 58L28 48L18 45L28 42Z" fill="#FFE500" stroke="#111116" strokeWidth="2" strokeLinejoin="round" />
      <path d="M132 30L134 22L136 30L144 32L136 34L134 42L132 34L124 32L132 30Z" fill="#FF6B8B" stroke="#111116" strokeWidth="2" strokeLinejoin="round" />
      <path d="M125 105L127 99L129 105L135 107L129 109L127 115L125 109L119 107L125 105Z" fill="#D4F84B" stroke="#111116" strokeWidth="2" strokeLinejoin="round" />

      {/* Floating Bubbles */}
      <circle cx="75" cy="40" r="6" fill="#D4F84B" stroke="#111116" strokeWidth="2" />
      <circle cx="88" cy="28" r="4.5" fill="#FF6B8B" stroke="#111116" strokeWidth="2" />
      <circle cx="68" cy="22" r="3" fill="#38BDF8" stroke="#111116" strokeWidth="1.5" />

      {/* Flask Glass Body */}
      <path
        d="M68 45V68L42 124C38 132 44 142 54 142H106C116 142 122 132 118 124L92 68V45H68Z"
        fill="#FFFFFF"
        stroke="#111116"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      {/* Liquid Inside Flask */}
      <path
        d="M49 110C56 106 66 112 76 109C86 106 96 112 111 110L117 124C121 131 115 140 106 140H54C45 140 39 131 43 124L49 110Z"
        fill="url(#beakerLiquid)"
        stroke="#111116"
        strokeWidth="2"
      />

      {/* Surface Liquid Wave */}
      <path
        d="M49 110C56 106 66 113 76 110C86 107 97 113 111 110"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Rising Bubbles inside liquid */}
      <circle cx="65" cy="126" r="3.5" fill="#FFFFFF" stroke="#111116" strokeWidth="1.5" />
      <circle cx="92" cy="122" r="2.5" fill="#FFFFFF" stroke="#111116" strokeWidth="1.5" />
      <circle cx="78" cy="132" r="2" fill="#FFFFFF" stroke="#111116" strokeWidth="1.5" />

      {/* Flask Neck Rim */}
      <rect x="64" y="38" width="32" height="7" rx="3.5" fill="#FFFFFF" stroke="#111116" strokeWidth="3" />

      {/* Measuring Hatch Marks */}
      <line x1="82" y1="84" x2="94" y2="84" stroke="#111116" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="86" y1="94" x2="98" y2="94" stroke="#111116" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="90" y1="104" x2="102" y2="104" stroke="#111116" strokeWidth="2.5" strokeLinecap="round" />

      {/* Friendly Cute Eyes */}
      <circle cx="72" cy="94" r="3" fill="#111116" />
      <circle cx="82" cy="94" r="3" fill="#111116" />
      <path d="M74 100Q77 103 80 100" stroke="#111116" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

// ── 2. Study & Focus Pomodoro Illustration ────────────────────────────────────
export function StudyFocusIllustration({ className = 'w-36 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="tomatoGrad" x1="40" y1="50" x2="120" y2="135" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF7A85" />
          <stop offset="100%" stopColor="#FF495C" />
        </linearGradient>
      </defs>

      {/* Headphones Band */}
      <path
        d="M42 90C36 60 52 40 80 40C108 40 124 60 118 90"
        stroke="#111116"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M42 90C36 60 52 40 80 40C108 40 124 60 118 90"
        stroke="#D4F84B"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Tomato Body */}
      <ellipse cx="80" cy="100" rx="42" ry="36" fill="url(#tomatoGrad)" stroke="#111116" strokeWidth="3.5" />

      {/* Cute Tomato Highlights */}
      <ellipse cx="62" cy="84" rx="8" ry="4" transform="rotate(-25 62 84)" fill="#FFFFFF" opacity="0.6" />

      {/* Leaves / Stem at top */}
      <path
        d="M80 66C76 56 68 54 62 56C68 62 72 65 76 68"
        fill="#22C55E"
        stroke="#111116"
        strokeWidth="2"
      />
      <path
        d="M80 66C84 56 92 54 98 56C92 62 88 65 84 68"
        fill="#22C55E"
        stroke="#111116"
        strokeWidth="2"
      />
      <path
        d="M80 66V50C80 48 83 46 86 47"
        stroke="#111116"
        strokeWidth="3.5"
        strokeLinecap="round"
      />

      {/* Headphone Ear Cushions */}
      <rect x="30" y="80" width="16" height="28" rx="8" fill="#111116" />
      <rect x="32" y="82" width="12" height="24" rx="6" fill="#D4F84B" stroke="#111116" strokeWidth="2" />
      <rect x="114" y="80" width="16" height="28" rx="8" fill="#111116" />
      <rect x="116" y="82" width="12" height="24" rx="6" fill="#D4F84B" stroke="#111116" strokeWidth="2" />

      {/* Kawaii Face */}
      <circle cx="68" cy="98" r="4.5" fill="#111116" />
      <circle cx="70" cy="96" r="1.5" fill="#FFFFFF" />
      <circle cx="92" cy="98" r="4.5" fill="#111116" />
      <circle cx="94" cy="96" r="1.5" fill="#FFFFFF" />
      <path d="M76 106Q80 110 84 106" stroke="#111116" strokeWidth="2.5" strokeLinecap="round" />

      {/* Cheeks */}
      <ellipse cx="61" cy="103" rx="4" ry="2" fill="#FFA5B5" />
      <ellipse cx="99" cy="103" rx="4" ry="2" fill="#FFA5B5" />

      {/* Floating Musical Notes */}
      <path d="M22 60Q26 50 32 54V66M32 54L38 52V64" stroke="#111116" strokeWidth="2" strokeLinecap="round" />
      <circle cx="20" cy="62" r="3" fill="#FFE500" stroke="#111116" strokeWidth="2" />
      <circle cx="36" cy="64" r="3" fill="#FFE500" stroke="#111116" strokeWidth="2" />

      {/* Clock Dial Accent */}
      <g transform="translate(118, 28)">
        <circle cx="16" cy="16" r="14" fill="#FFFFFF" stroke="#111116" strokeWidth="2.5" />
        <path d="M16 6V16L22 20" stroke="#111116" strokeWidth="2" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// ── 3. Creative Studio Visual Potion Illustration ─────────────────────────────
export function CreativeStudioIllustration({ className = 'w-36 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="rainbowPaint" x1="30" y1="40" x2="130" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF6B8B" />
          <stop offset="35%" stopColor="#FFE500" />
          <stop offset="70%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#818CF8" />
        </linearGradient>
      </defs>

      {/* Splash Liquid Cloud */}
      <path
        d="M36 70C25 70 20 54 32 44C30 30 46 24 58 32C68 20 88 22 94 34C108 26 122 36 120 50C132 58 130 76 118 82C126 94 116 110 102 108C94 118 76 118 68 108C56 114 42 104 44 92C32 90 30 76 36 70Z"
        fill="url(#rainbowPaint)"
        stroke="#111116"
        strokeWidth="3.5"
      />

      {/* Paint Brush sticking out */}
      <g transform="translate(90, 20) rotate(35)">
        <rect x="0" y="0" width="8" height="48" rx="4" fill="#FFE500" stroke="#111116" strokeWidth="2" />
        <rect x="-2" y="32" width="12" height="10" rx="2" fill="#C084FC" stroke="#111116" strokeWidth="2" />
        <path d="M0 42C-1 48 3 56 4 56C5 56 9 48 8 42Z" fill="#111116" />
      </g>

      {/* Pixel Sunglasses (Meme sticker) */}
      <g transform="translate(54, 56)">
        <rect x="0" y="0" width="22" height="14" rx="2" fill="#111116" />
        <rect x="2" y="2" width="6" height="4" fill="#FFFFFF" />
        <rect x="22" y="4" width="8" height="4" fill="#111116" />
        <rect x="30" y="0" width="22" height="14" rx="2" fill="#111116" />
        <rect x="32" y="2" width="6" height="4" fill="#FFFFFF" />
      </g>

      {/* Palette Color Swatch Drops */}
      <circle cx="44" cy="120" r="8" fill="#FF6B8B" stroke="#111116" strokeWidth="2.5" />
      <circle cx="68" cy="130" r="9" fill="#FFE500" stroke="#111116" strokeWidth="2.5" />
      <circle cx="94" cy="128" r="8.5" fill="#4ADE80" stroke="#111116" strokeWidth="2.5" />
      <circle cx="118" cy="118" r="8" fill="#818CF8" stroke="#111116" strokeWidth="2.5" />

      {/* Sparkles */}
      <path d="M26 26L28 18L30 26L38 28L30 30L28 38L26 30L18 28L26 26Z" fill="#FFE500" stroke="#111116" strokeWidth="1.5" />
      <path d="M136 78L138 72L140 78L146 80L140 82L138 88L136 82L130 80L136 78Z" fill="#FF6B8B" stroke="#111116" strokeWidth="1.5" />
    </svg>
  );
}

// ── 4. Privacy Vault Cyber Safe Illustration ──────────────────────────────────
export function PrivacyVaultIllustration({ className = 'w-36 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="vaultBody" x1="30" y1="40" x2="130" y2="140" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4ADE80" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>

      {/* Antenna */}
      <line x1="110" y1="26" x2="110" y2="44" stroke="#111116" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="110" cy="22" r="5" fill="#FFE500" stroke="#111116" strokeWidth="2.5" />

      {/* Floating Key */}
      <g transform="translate(24, 20) rotate(-30)">
        <circle cx="12" cy="12" r="8" fill="#FFE500" stroke="#111116" strokeWidth="2.5" />
        <rect x="20" y="9.5" width="18" height="5" rx="2.5" fill="#FFE500" stroke="#111116" strokeWidth="2" />
        <rect x="30" y="14.5" width="4" height="6" fill="#FFE500" stroke="#111116" strokeWidth="2" />
      </g>

      {/* Safe Box Body */}
      <rect x="30" y="44" width="100" height="92" rx="20" fill="url(#vaultBody)" stroke="#111116" strokeWidth="4" />

      {/* Corner Bolts */}
      <circle cx="44" cy="58" r="3" fill="#111116" />
      <circle cx="116" cy="58" r="3" fill="#111116" />
      <circle cx="44" cy="122" r="3" fill="#111116" />
      <circle cx="116" cy="122" r="3" fill="#111116" />

      {/* Inner Vault Door Ring */}
      <circle cx="80" cy="90" rx="30" ry="30" fill="#FFFFFF" stroke="#111116" strokeWidth="3.5" />

      {/* Glowing Keyhole Character */}
      <path
        d="M80 76C75 76 71 80 71 85C71 88 73 91 75 93L73 103C73 104 74 105 75 105H85C86 105 87 104 87 103L85 93C87 91 89 88 89 85C89 80 85 76 80 76Z"
        fill="#38BDF8"
        stroke="#111116"
        strokeWidth="2.5"
      />

      {/* Happy Keyhole Eyes */}
      <circle cx="77" cy="83" r="1.5" fill="#111116" />
      <circle cx="83" cy="83" r="1.5" fill="#111116" />
      <path d="M78 87Q80 89 82 87" stroke="#111116" strokeWidth="1.5" strokeLinecap="round" />

      {/* Security Shield Badge */}
      <g transform="translate(108, 88)">
        <path d="M12 0L24 5V14C24 22 12 28 12 28C12 28 0 22 0 14V5L12 0Z" fill="#FFE500" stroke="#111116" strokeWidth="2.5" />
        <path d="M8 12L11 15L17 9" stroke="#111116" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </g>
    </svg>
  );
}

// ── 5. PDF & Smart Document Illustration ──────────────────────────────────────
export function SmartDocIllustration({ className = 'w-36 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="docCover" x1="40" y1="40" x2="120" y2="130" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#68A0FD" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>
      </defs>

      {/* Stacked Back Paper */}
      <rect x="52" y="32" width="70" height="96" rx="10" transform="rotate(8 52 32)" fill="#FFE500" stroke="#111116" strokeWidth="3" />
      <rect x="42" y="30" width="70" height="96" rx="10" transform="rotate(-4 42 30)" fill="#FF6B8B" stroke="#111116" strokeWidth="3" />

      {/* Front Document Page */}
      <rect x="36" y="38" width="76" height="102" rx="12" fill="#FFFFFF" stroke="#111116" strokeWidth="3.5" />

      {/* Document Fold Corner */}
      <path d="M96 38V54H112" stroke="#111116" strokeWidth="3.5" strokeLinejoin="round" />

      {/* Top Banner Chip */}
      <rect x="46" y="50" width="28" height="10" rx="5" fill="#D4F84B" stroke="#111116" strokeWidth="2" />
      <text x="51" y="58" fontFamily="monospace" fontSize="7" fontWeight="900" fill="#111116">PDF</text>

      {/* Content Lines */}
      <line x1="46" y1="70" x2="90" y2="70" stroke="#111116" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="46" y1="80" x2="82" y2="80" stroke="#111116" strokeWidth="3.5" strokeLinecap="round" />
      <line x1="46" y1="90" x2="96" y2="90" stroke="#111116" strokeWidth="3.5" strokeLinecap="round" />

      {/* Chart Bars Icon */}
      <rect x="46" y="112" width="8" height="16" rx="2" fill="#68A0FD" stroke="#111116" strokeWidth="1.5" />
      <rect x="58" y="104" width="8" height="24" rx="2" fill="#4ADE80" stroke="#111116" strokeWidth="1.5" />
      <rect x="70" y="98" width="8" height="30" rx="2" fill="#FFE500" stroke="#111116" strokeWidth="1.5" />

      {/* Laser Magnifier Glass Tool */}
      <g transform="translate(86, 92)">
        <circle cx="20" cy="20" r="16" fill="#EEF5FF" stroke="#111116" strokeWidth="3" />
        <circle cx="20" cy="20" r="11" fill="#68A0FD" opacity="0.3" />
        <line x1="32" y1="32" x2="48" y2="48" stroke="#111116" strokeWidth="5" strokeLinecap="round" />
      </g>
    </svg>
  );
}

// ── 6. Dev Bot Flask Illustration ─────────────────────────────────────────────
export function DevBotIllustration({ className = 'w-36 h-36' }: { className?: string }) {
  return (
    <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="devBot" x1="40" y1="50" x2="120" y2="135" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>
      </defs>

      {/* Antennas */}
      <line x1="68" y1="38" x2="58" y2="22" stroke="#111116" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="56" cy="20" r="4.5" fill="#FFE500" stroke="#111116" strokeWidth="2.5" />
      <line x1="92" y1="38" x2="102" y2="22" stroke="#111116" strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="104" cy="20" r="4.5" fill="#D4F84B" stroke="#111116" strokeWidth="2.5" />

      {/* Flask Robot Head/Body */}
      <path
        d="M66 40H94V62L120 118C124 126 118 136 108 136H52C42 136 36 126 40 118L66 62V40Z"
        fill="#FFFFFF"
        stroke="#111116"
        strokeWidth="4"
        strokeLinejoin="round"
      />

      {/* Liquid Screen Belly */}
      <path
        d="M45 110C55 106 70 112 80 108C90 104 105 110 115 110L118 120C122 128 116 134 108 134H52C44 134 38 128 42 120L45 110Z"
        fill="url(#devBot)"
        stroke="#111116"
        strokeWidth="2"
      />

      {/* Digital QR Code grid matrix in center */}
      <g transform="translate(64, 88)">
        <rect x="0" y="0" width="32" height="32" rx="6" fill="#FFFFFF" stroke="#111116" strokeWidth="2.5" />
        <rect x="4" y="4" width="8" height="8" fill="#111116" />
        <rect x="20" y="4" width="8" height="8" fill="#111116" />
        <rect x="4" y="20" width="8" height="8" fill="#111116" />
        <rect x="14" y="14" width="4" height="4" fill="#111116" />
        <rect x="22" y="22" width="6" height="6" fill="#111116" />
      </g>

      {/* Robot Eyes */}
      <circle cx="70" cy="54" r="4" fill="#38BDF8" stroke="#111116" strokeWidth="2" />
      <circle cx="90" cy="54" r="4" fill="#38BDF8" stroke="#111116" strokeWidth="2" />

      {/* Circuit lines */}
      <path d="M42 86H30V76" stroke="#111116" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="30" cy="74" r="2.5" fill="#FFE500" />
      <path d="M118 86H130V76" stroke="#111116" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="130" cy="74" r="2.5" fill="#FFE500" />
    </svg>
  );
}

// ── 7. Interactive Social Battery Meter (MindMate Soft Pill) ────────────────
export function BatteryWidget({ percentage = 100 }: { percentage?: number }) {
  return (
    <div className="rounded-3xl bg-[#FAF7FD] border border-purple-100/60 p-4 shadow-sm flex items-center justify-between gap-3 text-left">
      <div>
        <div className="flex items-center gap-1.5">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-purple-900">
            Live RAM Engine
          </span>
        </div>
        <h4 className="text-xs font-black text-[#1E1B24] mt-0.5">Device Memory</h4>
        <span className="text-[11px] font-semibold text-neutral-500">
          {percentage}% Local Execution
        </span>
      </div>

      {/* Battery Icon */}
      <div className="flex items-center gap-1">
        <div className="h-8 w-14 rounded-xl border border-black/10 bg-white p-1 flex items-center shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-emerald-400 to-[#D7F75B] rounded-lg transition-all duration-500"
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="h-3.5 w-1 rounded-r bg-black/20" />
      </div>
    </div>
  );
}

// ── 8. Playful Doodles: Sparkle, Squiggle, Sticker Star ────────────────────────
export function StarburstSticker({ className = 'w-6 h-6' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path
        d="M12 0L14.5 8L22 4.5L16.5 11.5L24 15L16 16.5L18 24L11.5 17.5L7 24L8 16L0 15L7.5 11.5L2 4.5L9.5 8L12 0Z"
        fill="#FFE500"
        stroke="#111116"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}
