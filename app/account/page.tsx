'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { TOOLS } from '@/lib/tools-registry';
import { AdminStore } from '@/lib/admin-store';
import {
  User,
  Star,
  History,
  ShieldCheck,
  Download,
  Trash2,
  LogOut,
  Send,
  Sparkles,
  ExternalLink,
  Lock,
  ArrowRight,
  CheckCircle2,
  FileText,
} from 'lucide-react';

export default function AccountPage() {
  const router = useRouter();
  const { user, logoutUser, favorites, recentTools, toggleFavorite, isAdmin } = useAuth();

  // Feedback form state
  const [feedbackTool, setFeedbackTool] = useState('');
  const [feedbackType, setFeedbackType] = useState<'bug' | 'feature' | 'general'>('bug');
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSent, setFeedbackSent] = useState(false);

  // If not logged in, show prompt to login or continue
  if (!user) {
    return (
      <main className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-black/5 shadow-xl text-center space-y-5">
          <div className="mx-auto w-14 h-14 rounded-2xl bg-[#D4F84B] text-[#1E1B24] flex items-center justify-center font-black text-xl shadow-md">
            Z
          </div>
          <div>
            <h1 className="text-2xl font-black text-[#1E1B24]">Account Required</h1>
            <p className="text-xs text-neutral-500 mt-1">
              Sign in to sync your tools, favorites, and privacy vault across all your devices.
            </p>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Link
              href="/auth/login"
              className="py-3 px-4 rounded-xl bg-[#1E1B24] text-white font-bold text-xs hover:opacity-90 transition shadow-md"
            >
              Sign In
            </Link>
            <Link
              href="/auth/signup"
              className="py-3 px-4 rounded-xl bg-neutral-100 text-neutral-800 font-bold text-xs hover:bg-neutral-200 transition"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Find favorite tools configs
  const favoriteToolsList = TOOLS.filter((t) => favorites.includes(t.slug));
  const recentToolsList = TOOLS.filter((t) => recentTools.includes(t.slug));

  const handleSendFeedback = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackMessage.trim()) return;

    const matchedTool = TOOLS.find((t) => t.slug === feedbackTool);
    AdminStore.addFeedback({
      userEmail: user.email,
      toolSlug: feedbackTool || undefined,
      toolTitle: matchedTool?.title || undefined,
      type: feedbackType,
      message: feedbackMessage,
    });

    setFeedbackSent(true);
    setFeedbackMessage('');
    setTimeout(() => setFeedbackSent(false), 4000);
  };

  const handleExportData = () => {
    const data = {
      user: { email: user.email, displayName: user.displayName, role: user.role },
      favorites,
      recentTools,
      exportedAt: new Date().toISOString(),
    };
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(data, null, 2));
    const dl = document.createElement('a');
    dl.setAttribute('href', dataStr);
    dl.setAttribute('download', `zlab_data_${user.email.split('@')[0]}.json`);
    dl.click();
  };

  const handleWipeData = () => {
    if (confirm('Are you sure you want to clear all your local preferences and favorites?')) {
      localStorage.removeItem('zlab_favorites');
      localStorage.removeItem('zlab_recent_tools');
      window.location.reload();
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F5] text-[#1E1B24] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* User Profile Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF6B8B] via-[#FFE500] to-[#D4F84B] p-0.5 shadow-md">
              <div className="w-full h-full bg-[#1E1B24] rounded-[14px] flex items-center justify-center text-white font-black text-2xl">
                {user.displayName.charAt(0).toUpperCase()}
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-[#1E1B24]">{user.displayName}</h1>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-[#1E1B24] text-[#D4F84B]">
                  {user.role}
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-medium mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {user.role === 'admin' && (
              <Link
                href="/adminvivax"
                className="px-4 py-2.5 rounded-xl bg-[#1E1B24] text-[#D4F84B] font-bold text-xs hover:opacity-90 transition shadow-sm flex items-center gap-1.5"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Vivax Portal</span>
              </Link>
            )}

            <button
              onClick={async () => {
                await logoutUser();
                router.push('/');
              }}
              className="px-4 py-2.5 rounded-xl border border-black/10 bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-bold text-xs transition flex items-center gap-1.5"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Favorites Section */}
        <section className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <h2 className="text-lg font-black text-[#1E1B24]">
                My Favorite Tools ({favoriteToolsList.length})
              </h2>
            </div>
            <Link href="/" className="text-xs font-bold text-neutral-500 hover:text-black">
              Explore More →
            </Link>
          </div>

          {favoriteToolsList.length === 0 ? (
            <div className="p-8 text-center bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
              <Star className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
              <p className="text-xs font-bold text-neutral-600">No favorite tools added yet</p>
              <p className="text-[11px] text-neutral-400 mt-1">
                Click the star icon on any tool card across Z-Lab to pin it here for quick access.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {favoriteToolsList.map((tool) => (
                <div
                  key={tool.slug}
                  className="p-4 rounded-2xl border border-black/5 bg-[#FAFAFA] hover:bg-white hover:shadow-md transition flex items-center justify-between gap-3 group"
                >
                  <Link
                    href={`/tools/${tool.category}/${tool.slug}`}
                    className="flex-1 min-w-0"
                  >
                    <p className="font-extrabold text-xs text-[#1E1B24] group-hover:text-purple-600 transition truncate">
                      {tool.title}
                    </p>
                    <p className="text-[10px] text-neutral-400 capitalize">{tool.category.replace('-', ' ')}</p>
                  </Link>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleFavorite(tool.slug)}
                      className="p-1.5 rounded-lg text-amber-500 hover:bg-neutral-100 transition"
                      title="Remove favorite"
                    >
                      <Star className="w-4 h-4 fill-amber-500" />
                    </button>
                    <Link
                      href={`/tools/${tool.category}/${tool.slug}`}
                      className="p-1.5 rounded-lg text-neutral-400 hover:text-black hover:bg-neutral-100 transition"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Recently Used Tools */}
        {recentToolsList.length > 0 && (
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-purple-600" />
              <h2 className="text-lg font-black text-[#1E1B24]">Recently Used Tools</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {recentToolsList.slice(0, 4).map((tool) => (
                <Link
                  key={tool.slug}
                  href={`/tools/${tool.category}/${tool.slug}`}
                  className="p-3.5 rounded-xl border border-black/5 bg-neutral-50 hover:bg-neutral-100 transition flex items-center justify-between"
                >
                  <span className="text-xs font-bold truncate text-[#1E1B24]">{tool.title}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 2 Columns: Feedback to Admin + Privacy Vault Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Submit Feedback / Bug Report directly to Vivax Admin */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-4">
            <h2 className="text-base font-black text-[#1E1B24] flex items-center gap-2">
              <Send className="w-4 h-4 text-purple-600" />
              <span>Report Bug or Request Feature</span>
            </h2>
            <p className="text-xs text-neutral-500 font-medium">
              Your feedback is transmitted directly to the Admin Vivax control room.
            </p>

            {feedbackSent ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 font-bold animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Feedback submitted! The Z-Lab team will review it.</span>
              </div>
            ) : (
              <form onSubmit={handleSendFeedback} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 mb-1">Feedback Type</label>
                    <select
                      value={feedbackType}
                      onChange={(e) => setFeedbackType(e.target.value as any)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none"
                    >
                      <option value="bug">Bug Report</option>
                      <option value="feature">Feature Request</option>
                      <option value="general">General Feedback</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-neutral-600 mb-1">Related Tool</label>
                    <select
                      value={feedbackTool}
                      onChange={(e) => setFeedbackTool(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-semibold focus:outline-none"
                    >
                      <option value="">General (All Tools)</option>
                      {TOOLS.map((t) => (
                        <option key={t.slug} value={t.slug}>
                          {t.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-neutral-600 mb-1">Message</label>
                  <textarea
                    required
                    rows={3}
                    value={feedbackMessage}
                    onChange={(e) => setFeedbackMessage(e.target.value)}
                    placeholder="Tell us what happened or what tool you would like..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#1E1B24] text-white font-bold text-xs hover:opacity-90 transition"
                >
                  Submit to Admin
                </button>
              </form>
            )}
          </section>

          {/* Privacy & Data Controls */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-black/5 shadow-sm space-y-4">
            <h2 className="text-base font-black text-[#1E1B24] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Privacy & Data Vault</span>
            </h2>
            <p className="text-xs text-neutral-500 font-medium">
              You own your data. We never upload files to any cloud server.
            </p>

            <div className="space-y-2 pt-2">
              <button
                onClick={handleExportData}
                className="w-full p-3 rounded-2xl bg-neutral-50 hover:bg-neutral-100 transition border border-black/5 flex items-center justify-between text-xs font-bold text-neutral-800"
              >
                <div className="flex items-center gap-2">
                  <Download className="w-4 h-4 text-neutral-500" />
                  <span>Download My Data (JSON)</span>
                </div>
                <span className="text-[10px] text-neutral-400">Export</span>
              </button>

              <button
                onClick={handleWipeData}
                className="w-full p-3 rounded-2xl bg-rose-50 hover:bg-rose-100 transition border border-rose-100 flex items-center justify-between text-xs font-bold text-rose-700"
              >
                <div className="flex items-center gap-2">
                  <Trash2 className="w-4 h-4 text-rose-600" />
                  <span>Wipe All Local Storage Data</span>
                </div>
                <span className="text-[10px] text-rose-400">Purge</span>
              </button>
            </div>

            <div className="p-3 bg-neutral-50 rounded-2xl border border-neutral-100 text-[11px] text-neutral-500">
              <p className="font-bold text-neutral-700">Client-Side Privacy Guarantee</p>
              <p className="mt-0.5">
                All image compression, PDF operations, encryption, and conversions occur inside your browser’s isolated memory space.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
