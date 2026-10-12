'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { AdminStore } from '@/lib/admin-store';

export default function AdminHoneypotPage() {
  useEffect(() => {
    // Log the honeypot trigger to security audit
    try {
      AdminStore.addAuditLog(
        'decoy_scanner',
        'HONEYPOT_TRIGGERED',
        'SECURITY',
        'blocked',
        'Accessed decoy /admin route. Access denied.',
        'Remote Client'
      );
    } catch {
      // ignore
    }
  }, []);

  return (
    <main className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-black/10 shadow-xl text-center space-y-5">
        <div className="mx-auto w-16 h-16 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>

        <div>
          <h1 className="text-2xl font-black text-[#1E1B24]">403 Forbidden</h1>
          <p className="text-sm text-neutral-500 mt-2 font-medium">
            Administrative endpoints on this server are restricted, obfuscated, and continuously monitored.
          </p>
        </div>

        <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 text-xs text-neutral-400 font-mono text-left space-y-1">
          <div>ERR_CODE: 0x8849_ACCESS_RESTRICTED</div>
          <div>REMOTE_LOG: LOGGED_TO_AUDIT_TRAIL</div>
          <div>STATUS: INCIDENT_REGISTERED</div>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1E1B24] text-white font-bold text-sm hover:opacity-90 transition shadow-md"
        >
          <ArrowLeft className="w-4 h-4" /> Return to Z-Lab
        </Link>
      </div>
    </main>
  );
}
