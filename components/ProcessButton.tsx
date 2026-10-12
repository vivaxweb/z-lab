'use client';

import React from 'react';

export interface ProcessButtonProps {
  /** Button label when idle. */
  label?: string;
  /** Button label while processing. */
  loadingLabel?: string;
  /** Whether the tool is currently processing. */
  isLoading: boolean;
  /** Called when the user clicks the button. */
  onClick: () => void;
  /** Disable the button independently of loading state. */
  disabled?: boolean;
  /** Optional Tailwind classes to override or extend styling. */
  className?: string;
}

/**
 * Signature MindMate gradient action button for Z Lab tools.
 * Features smooth elevation, rounded pill form, and clean loading state.
 */
export function ProcessButton({
  label = 'Process',
  loadingLabel = 'Processing…',
  isLoading,
  onClick,
  disabled = false,
  className = '',
}: ProcessButtonProps) {
  const isDisabled = disabled || isLoading;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={isLoading}
      className={[
        'inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-3.5',
        'text-xs sm:text-sm font-black text-[#1E1B24] tracking-tight transition-all duration-200',
        'bg-gradient-to-r from-[#D7F75B] to-[#FCA5BA]',
        'shadow-[0_8px_20px_rgba(252,165,186,0.25)] hover:shadow-[0_12px_28px_rgba(252,165,186,0.4)]',
        'hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]',
        'disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:shadow-none',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {isLoading && (
        <svg
          className="h-4 w-4 animate-spin text-[#1E1B24]"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      <span>{isLoading ? loadingLabel : label}</span>
    </button>
  );
}
