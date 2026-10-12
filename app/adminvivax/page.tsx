'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  AdminStore,
  UserAccount,
  GlobalAnnouncement,
  UserFeedback,
  AuditLogEntry,
  ToolStatusOverride,
} from '@/lib/admin-store';
import { TOOLS, CATEGORIES, CATEGORY_INFO } from '@/lib/tools-registry';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Key,
  Users,
  Wrench,
  Bell,
  MessageSquare,
  Activity,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Eye,
  RefreshCw,
  Search,
  Plus,
  Trash2,
  ExternalLink,
  Power,
  Sliders,
  Sparkles,
  Clock,
  Filter,
  Check,
} from 'lucide-react';

export default function AdminVivaxPage() {
  const {
    isAdminSessionActive,
    verifyAdminAccess,
    logoutAdmin,
    lockoutSeconds,
    failedLoginAttempts,
  } = useAuth();

  // Gateway Login Form State
  const [passcodeInput, setPasscodeInput] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<
    'overview' | 'tools' | 'users' | 'announcements' | 'feedback' | 'audit'
  >('overview');

  // Tools Manager State
  const [toolSearch, setToolSearch] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [toolOverrides, setToolOverrides] = useState<Record<string, ToolStatusOverride>>({});

  // Users State
  const [usersList, setUsersList] = useState<UserAccount[]>([]);
  const [userSearch, setUserSearch] = useState('');
  const [userRoleFilter, setUserRoleFilter] = useState<string>('all');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserForm, setNewUserForm] = useState({ email: '', displayName: '', role: 'user' as const });

  // Announcements State
  const [announcements, setAnnouncements] = useState<GlobalAnnouncement[]>([]);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnMsg, setNewAnnMsg] = useState('');
  const [newAnnType, setNewAnnType] = useState<'info' | 'warning' | 'alert' | 'success'>('info');

  // Feedback State
  const [feedbackList, setFeedbackList] = useState<UserFeedback[]>([]);
  const [feedbackFilter, setFeedbackFilter] = useState<'all' | 'bug' | 'feature'>('all');

  // Audit Logs State
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>([]);
  const [auditCategoryFilter, setAuditCategoryFilter] = useState<string>('all');

  // Success Notification banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load Admin Data on session active
  useEffect(() => {
    if (isAdminSessionActive) {
      setToolOverrides(AdminStore.getToolOverrides());
      setUsersList(AdminStore.getUsers());
      setAnnouncements(AdminStore.getAnnouncements());
      setFeedbackList(AdminStore.getFeedback());
      setAuditLogs(AdminStore.getAuditLogs());
    }
  }, [isAdminSessionActive]);

  // Handle Gateway Passcode Submit
  const handleGatewaySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passcodeInput.trim()) return;
    setIsVerifying(true);
    setLoginError('');

    setTimeout(() => {
      const res = verifyAdminAccess(passcodeInput);
      if (!res.success) {
        setLoginError(res.error || 'Authentication failed');
      } else {
        setPasscodeInput('');
        showToast('Admin session authenticated successfully');
      }
      setIsVerifying(false);
    }, 400);
  };

  // Tool Toggle Handlers
  const handleToggleTool = (slug: string, currentEnabled: boolean) => {
    const updated = AdminStore.setToolOverride(slug, { enabled: !currentEnabled });
    setToolOverrides(updated);
    setAuditLogs(AdminStore.getAuditLogs());
    showToast(`Tool [${slug}] ${!currentEnabled ? 'enabled' : 'disabled'}`);
  };

  const handleToggleMaintenance = (slug: string, currentMaint: boolean) => {
    const updated = AdminStore.setToolOverride(slug, {
      isMaintenance: !currentMaint,
      maintenanceMessage: !currentMaint ? 'Tool under scheduled maintenance' : '',
    });
    setToolOverrides(updated);
    setAuditLogs(AdminStore.getAuditLogs());
    showToast(`Tool [${slug}] maintenance ${!currentMaint ? 'activated' : 'deactivated'}`);
  };

  const handleSetBadge = (slug: string, badge: string) => {
    const updated = AdminStore.setToolOverride(slug, { badge });
    setToolOverrides(updated);
    showToast(`Badge updated for [${slug}]`);
  };

  // User Action Handlers
  const handleUpdateUserStatus = (uid: string, status: UserAccount['status']) => {
    const updated = AdminStore.updateUserStatus(uid, status);
    setUsersList(updated);
    setAuditLogs(AdminStore.getAuditLogs());
    showToast(`User status updated to ${status}`);
  };

  const handleUpdateUserRole = (uid: string, role: UserAccount['role']) => {
    const updated = AdminStore.updateUserRole(uid, role);
    setUsersList(updated);
    setAuditLogs(AdminStore.getAuditLogs());
    showToast(`User role updated to ${role}`);
  };

  const handleDeleteUser = (uid: string) => {
    if (confirm('Are you sure you want to delete this user? This cannot be undone.')) {
      const updated = AdminStore.deleteUser(uid);
      setUsersList(updated);
      setAuditLogs(AdminStore.getAuditLogs());
      showToast('User removed permanently');
    }
  };

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserForm.email) return;
    const user: UserAccount = {
      uid: 'usr_' + Date.now(),
      email: newUserForm.email,
      displayName: newUserForm.displayName || newUserForm.email.split('@')[0],
      role: newUserForm.role,
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLoginAt: 'Never',
      toolsUsedCount: 0,
    };
    const updated = AdminStore.addUser(user);
    setUsersList(updated);
    setShowAddUserModal(false);
    setNewUserForm({ email: '', displayName: '', role: 'user' });
    AdminStore.addAuditLog('admin@vivax.local', 'USER_CREATED', 'USER_MOD', 'success', `Created user [${user.email}]`);
    setAuditLogs(AdminStore.getAuditLogs());
    showToast(`User ${user.email} created`);
  };

  // Announcement Handlers
  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnMsg.trim()) return;
    const updated = AdminStore.addAnnouncement({
      title: newAnnTitle,
      message: newAnnMsg,
      type: newAnnType,
      active: true,
    });
    setAnnouncements(updated);
    setAuditLogs(AdminStore.getAuditLogs());
    setNewAnnTitle('');
    setNewAnnMsg('');
    showToast('Announcement broadcasted');
  };

  const handleToggleAnnouncement = (id: string) => {
    const updated = AdminStore.toggleAnnouncement(id);
    setAnnouncements(updated);
    showToast('Announcement status updated');
  };

  const handleDeleteAnnouncement = (id: string) => {
    const updated = AdminStore.deleteAnnouncement(id);
    setAnnouncements(updated);
    showToast('Announcement deleted');
  };

  // Feedback Handlers
  const handleFeedbackStatus = (id: string, status: UserFeedback['status']) => {
    const updated = AdminStore.updateFeedbackStatus(id, status);
    setFeedbackList(updated);
    showToast(`Feedback marked as ${status}`);
  };

  // Filtered Tools
  const filteredTools = useMemo(() => {
    return TOOLS.filter((t) => {
      const matchesSearch =
        t.title.toLowerCase().includes(toolSearch.toLowerCase()) ||
        t.slug.toLowerCase().includes(toolSearch.toLowerCase());
      const matchesCategory =
        selectedCategoryFilter === 'all' || t.category === selectedCategoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [toolSearch, selectedCategoryFilter]);

  // Filtered Users
  const filteredUsers = useMemo(() => {
    return usersList.filter((u) => {
      const matchesSearch =
        u.email.toLowerCase().includes(userSearch.toLowerCase()) ||
        u.displayName.toLowerCase().includes(userSearch.toLowerCase());
      const matchesRole = userRoleFilter === 'all' || u.role === userRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [usersList, userSearch, userRoleFilter]);

  // Filtered Audit Logs
  const filteredAudit = useMemo(() => {
    return auditLogs.filter((l) => {
      return auditCategoryFilter === 'all' || l.category === auditCategoryFilter;
    });
  }, [auditLogs, auditCategoryFilter]);

  // ───────────────────────────────────────────────────────────────────────────
  // 1. GATEWAY SCREEN (When Not Authenticated)
  // ───────────────────────────────────────────────────────────────────────────
  if (!isAdminSessionActive) {
    return (
      <main className="min-h-[85vh] flex items-center justify-center p-4 bg-gradient-to-b from-[#18151E] to-[#0E0C12] text-white">
        <div className="max-w-md w-full bg-[#201D28] rounded-3xl p-8 border border-white/10 shadow-2xl space-y-6 relative overflow-hidden">
          {/* Subtle Ambient Background */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Shield Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF5E89] to-[#D4F84B] p-0.5 shadow-lg">
              <div className="w-full h-full bg-[#1A1723] rounded-[14px] flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-[#D4F84B]" />
              </div>
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-mono tracking-wider text-neutral-300 uppercase">
                <Lock className="w-3 h-3 text-[#D4F84B]" />
                <span>Vivax Gateway Protocol • 256-Bit</span>
              </div>
              <h1 className="text-2xl font-black mt-2 tracking-tight">Admin Vivax Portal</h1>
              <p className="text-xs text-neutral-400 mt-1">
                Enter your administrative security passcode to gain console access.
              </p>
            </div>
          </div>

          {/* Lockout Warning */}
          {lockoutSeconds > 0 ? (
            <div className="p-4 rounded-2xl bg-rose-950/50 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3">
              <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
              <div>
                <p className="font-bold">Gateway Temporarily Locked</p>
                <p className="text-[11px] text-rose-300/80">
                  Multiple unauthorized passcode attempts detected. Lockout expires in{' '}
                  <span className="font-mono font-bold text-white">{lockoutSeconds}s</span>.
                </p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleGatewaySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
                  Security Passcode / Master Key
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-neutral-400">
                    <Key className="w-4 h-4" />
                  </div>
                  <input
                    type="password"
                    value={passcodeInput}
                    onChange={(e) => setPasscodeInput(e.target.value)}
                    placeholder="Enter security key..."
                    disabled={isVerifying}
                    className="w-full pl-10 pr-4 py-3 bg-[#131119] border border-white/10 rounded-xl text-sm font-mono text-white placeholder-neutral-500 focus:outline-none focus:border-[#D4F84B] transition"
                    autoFocus
                  />
                </div>
              </div>

              {loginError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{loginError}</span>
                </div>
              )}

              {failedLoginAttempts > 0 && failedLoginAttempts < 5 && (
                <p className="text-[11px] text-amber-400/90 font-medium text-center">
                  Notice: {5 - failedLoginAttempts} failed attempts before automated IP lockout.
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifying || !passcodeInput.trim()}
                className="w-full py-3 px-4 rounded-xl font-black text-sm bg-gradient-to-r from-[#D4F84B] via-[#FFE500] to-[#FF6B8B] text-[#1E1B24] hover:opacity-95 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Verifying Access...</span>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Authenticate Console</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Dev Hint Pill */}
          <div className="p-3 bg-white/5 rounded-xl border border-white/5 text-[11px] text-neutral-400 text-center">
            <span className="font-semibold text-neutral-300">Default Passcode: </span>
            <code className="text-[#D4F84B] font-mono bg-black/40 px-1.5 py-0.5 rounded">vivax2026</code>
            <p className="text-[10px] text-neutral-500 mt-1">
              (Configurable in .env via NEXT_PUBLIC_ADMIN_PASSCODE)
            </p>
          </div>

          <div className="text-center">
            <Link
              href="/"
              className="text-xs text-neutral-500 hover:text-neutral-300 transition"
            >
              ← Back to Z-Lab Public Portal
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. AUTHENTICATED VIVAX ADMIN CONSOLE
  // ───────────────────────────────────────────────────────────────────────────
  return (
    <main className="min-h-screen bg-[#F6F5F8] text-[#1E1B24] pb-16">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1E1B24] text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-bold border border-white/10 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="w-4 h-4 text-[#D4F84B]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-black/5 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-2xl tracking-tight text-[#1E1B24]">Z</span>
              <span className="rounded-lg bg-[#1E1B24] px-2 py-0.5 text-xs font-black text-[#D4F84B] tracking-wider uppercase">
                Vivax Admin
              </span>
            </div>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Secure Session Active
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              target="_blank"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl border border-black/10 bg-white hover:bg-neutral-50 transition text-neutral-700 shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Live Site</span>
            </Link>

            <button
              onClick={logoutAdmin}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100 transition shadow-sm"
              title="Terminate Admin Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none border-b border-black/5">
          {[
            { id: 'overview', label: 'Overview', icon: Activity },
            { id: 'tools', label: `Tools Manager (${TOOLS.length})`, icon: Wrench },
            { id: 'users', label: `Users & Roles (${usersList.length})`, icon: Users },
            { id: 'announcements', label: 'Announcements', icon: Bell },
            { id: 'feedback', label: `Feedback (${feedbackList.length})`, icon: MessageSquare },
            { id: 'audit', label: 'Security & Audit', icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-extrabold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#1E1B24] text-white shadow-md'
                    : 'bg-white text-neutral-600 hover:text-black hover:bg-neutral-100 border border-black/5'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#D4F84B]' : 'text-neutral-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ── TAB 1: OVERVIEW & ANALYTICS ─────────────────────────────────── */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Quick Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-semibold">Total Tools</span>
                  <Wrench className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-2xl font-black text-[#1E1B24]">{TOOLS.length}</div>
                <div className="text-[11px] text-emerald-600 font-medium">
                  {TOOLS.length - Object.values(toolOverrides).filter((o) => !o.enabled).length} active in browser
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-semibold">Registered Users</span>
                  <Users className="w-4 h-4 text-blue-500" />
                </div>
                <div className="text-2xl font-black text-[#1E1B24]">{usersList.length}</div>
                <div className="text-[11px] text-neutral-500 font-medium">
                  {usersList.filter((u) => u.status === 'active').length} active accounts
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-semibold">User Reports</span>
                  <MessageSquare className="w-4 h-4 text-amber-500" />
                </div>
                <div className="text-2xl font-black text-[#1E1B24]">{feedbackList.length}</div>
                <div className="text-[11px] text-amber-600 font-medium">
                  {feedbackList.filter((f) => f.status === 'new').length} pending review
                </div>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm space-y-1">
                <div className="flex items-center justify-between text-neutral-400">
                  <span className="text-xs font-semibold">Security Audit Events</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="text-2xl font-black text-[#1E1B24]">{auditLogs.length}</div>
                <div className="text-[11px] text-neutral-500 font-medium">All sessions encrypted</div>
              </div>
            </div>

            {/* Platform Control Center */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
                <h3 className="text-base font-black text-[#1E1B24] flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-neutral-600" />
                  <span>Platform System Status & Controls</span>
                </h3>
                <div className="divide-y divide-neutral-100 text-sm">
                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#1E1B24]">Browser Client-Side Processing</p>
                      <p className="text-xs text-neutral-500">
                        100% in-memory WebAssembly / JS execution for zero upload privacy
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      Normal (Active)
                    </span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#1E1B24]">Honeypot Trap Protection</p>
                      <p className="text-xs text-neutral-500">
                        Diverts bot crawlers from /admin directly to incident log
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                      Armed
                    </span>
                  </div>

                  <div className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#1E1B24]">Active Announcements</p>
                      <p className="text-xs text-neutral-500">
                        Top banner displayed on public user site
                      </p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                      {announcements.filter((a) => a.active).length} Broadcasting
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4">
                <h3 className="text-base font-black text-[#1E1B24] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  <span>Quick Actions</span>
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={() => setActiveTab('announcements')}
                    className="w-full text-left p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition border border-black/5 flex items-center justify-between text-xs font-bold"
                  >
                    <span>Post Global Banner</span>
                    <Bell className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => setActiveTab('tools')}
                    className="w-full text-left p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition border border-black/5 flex items-center justify-between text-xs font-bold"
                  >
                    <span>Toggle Tool Maintenance</span>
                    <Wrench className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                  <button
                    onClick={() => setActiveTab('audit')}
                    className="w-full text-left p-3 rounded-xl bg-neutral-50 hover:bg-neutral-100 transition border border-black/5 flex items-center justify-between text-xs font-bold"
                  >
                    <span>Inspect Security Logs</span>
                    <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB 2: TOOLS MANAGER ────────────────────────────────────────── */}
        {activeTab === 'tools' && (
          <div className="space-y-4">
            {/* Filter and Search Bar */}
            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search 44+ tools..."
                  value={toolSearch}
                  onChange={(e) => setToolSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-black text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  All ({TOOLS.length})
                </button>
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition ${
                      selectedCategoryFilter === cat
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {CATEGORY_INFO[cat].shortTitle}
                  </button>
                ))}
              </div>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTools.map((tool) => {
                const override = toolOverrides[tool.slug] || { enabled: true, isMaintenance: false };
                const isEnabled = override.enabled !== false;
                const isMaintenance = Boolean(override.isMaintenance);
                const currentBadge = override.badge !== undefined ? override.badge : tool.badge;

                return (
                  <div
                    key={tool.slug}
                    className={`bg-white rounded-2xl p-4 border transition-all ${
                      !isEnabled
                        ? 'border-rose-200 bg-rose-50/20 opacity-70'
                        : isMaintenance
                        ? 'border-amber-200 bg-amber-50/30'
                        : 'border-black/5 shadow-sm'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-extrabold text-sm text-[#1E1B24]">{tool.title}</h4>
                          {currentBadge && (
                            <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#FFE500] text-[#1E1B24]">
                              {currentBadge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-neutral-500 font-mono mt-0.5">/{tool.category}/{tool.slug}</p>
                      </div>

                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          !isEnabled
                            ? 'bg-rose-100 text-rose-700'
                            : isMaintenance
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {!isEnabled ? 'Disabled' : isMaintenance ? 'Maintenance' : 'Active'}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 mt-2 line-clamp-1">{tool.shortDescription}</p>

                    {/* Tool Controls */}
                    <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between gap-2">
                      {/* Enable/Disable Killswitch */}
                      <button
                        onClick={() => handleToggleTool(tool.slug, isEnabled)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                          isEnabled
                            ? 'bg-neutral-100 hover:bg-rose-100 hover:text-rose-700 text-neutral-700'
                            : 'bg-emerald-500 text-white'
                        }`}
                      >
                        <Power className="w-3.5 h-3.5" />
                        <span>{isEnabled ? 'Turn Off' : 'Enable'}</span>
                      </button>

                      {/* Maintenance Toggle */}
                      <button
                        onClick={() => handleToggleMaintenance(tool.slug, isMaintenance)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                          isMaintenance
                            ? 'bg-amber-500 text-white'
                            : 'bg-neutral-100 hover:bg-amber-100 hover:text-amber-800 text-neutral-700'
                        }`}
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>{isMaintenance ? 'Resume' : 'Maint.'}</span>
                      </button>

                      {/* Badge dropdown */}
                      <select
                        value={currentBadge || ''}
                        onChange={(e) => handleSetBadge(tool.slug, e.target.value)}
                        className="bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl px-2 py-1 text-[11px] font-semibold focus:outline-none"
                      >
                        <option value="">No Badge</option>
                        <option value="Popular">Popular</option>
                        <option value="Hot">Hot</option>
                        <option value="New">New</option>
                        <option value="Beta">Beta</option>
                      </select>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── TAB 3: USER MANAGEMENT & ROLES ──────────────────────────────── */}
        {activeTab === 'users' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by email or name..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={userRoleFilter}
                  onChange={(e) => setUserRoleFilter(e.target.value)}
                  className="bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                >
                  <option value="all">All Roles</option>
                  <option value="admin">Admins</option>
                  <option value="moderator">Moderators</option>
                  <option value="user">Regular Users</option>
                </select>

                <button
                  onClick={() => setShowAddUserModal(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-black text-white text-xs font-bold hover:bg-neutral-800 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add User</span>
                </button>
              </div>
            </div>

            {/* User Directory Table */}
            <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-5">User</th>
                      <th className="py-3.5 px-4">Role</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Usage</th>
                      <th className="py-3.5 px-4">Registered</th>
                      <th className="py-3.5 px-5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100 font-medium">
                    {filteredUsers.map((u) => (
                      <tr key={u.uid} className="hover:bg-neutral-50/60 transition">
                        <td className="py-3.5 px-5">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-400 to-pink-400 text-white font-black flex items-center justify-center text-xs">
                              {u.displayName.charAt(0).toUpperCase()}
                            </div>
                            <div>
                              <p className="font-bold text-[#1E1B24]">{u.displayName}</p>
                              <p className="text-[11px] text-neutral-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <select
                            value={u.role}
                            onChange={(e) => handleUpdateUserRole(u.uid, e.target.value as UserAccount['role'])}
                            className="bg-neutral-100 border border-neutral-200 text-neutral-800 rounded-lg px-2 py-1 text-[11px] font-bold"
                          >
                            <option value="user">User</option>
                            <option value="moderator">Moderator</option>
                            <option value="admin">Admin</option>
                          </select>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              u.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : u.status === 'suspended'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {u.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-neutral-600 font-mono">
                          {u.toolsUsedCount} tools run
                        </td>
                        <td className="py-3.5 px-4 text-neutral-400 text-[11px]">
                          {new Date(u.createdAt).toLocaleDateString()}
                        </td>
                        <td className="py-3.5 px-5 text-right space-x-1.5">
                          {u.status === 'active' ? (
                            <button
                              onClick={() => handleUpdateUserStatus(u.uid, 'banned')}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-50 text-rose-600 hover:bg-rose-100 transition"
                            >
                              Ban
                            </button>
                          ) : (
                            <button
                              onClick={() => handleUpdateUserStatus(u.uid, 'active')}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition"
                            >
                              Unban
                            </button>
                          )}
                          <button
                            onClick={() => handleDeleteUser(u.uid)}
                            className="p-1 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 transition"
                            title="Delete user"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add User Modal */}
            {showAddUserModal && (
              <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-white rounded-3xl p-6 max-w-sm w-full border border-black/10 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
                  <h3 className="font-black text-base text-[#1E1B24]">Add New User</h3>
                  <form onSubmit={handleCreateUser} className="space-y-3">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">Email</label>
                      <input
                        type="email"
                        required
                        value={newUserForm.email}
                        onChange={(e) => setNewUserForm({ ...newUserForm, email: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-black"
                        placeholder="user@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">Display Name</label>
                      <input
                        type="text"
                        value={newUserForm.displayName}
                        onChange={(e) => setNewUserForm({ ...newUserForm, displayName: e.target.value })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-black"
                        placeholder="Full name"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-600 mb-1">Role</label>
                      <select
                        value={newUserForm.role}
                        onChange={(e) => setNewUserForm({ ...newUserForm, role: e.target.value as any })}
                        className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold focus:outline-none"
                      >
                        <option value="user">User</option>
                        <option value="moderator">Moderator</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>

                    <div className="pt-2 flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddUserModal(false)}
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-xs font-bold rounded-xl bg-black text-white hover:bg-neutral-800"
                      >
                        Create User
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── TAB 4: ANNOUNCEMENTS & BANNERS ─────────────────────────────── */}
        {activeTab === 'announcements' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create Banner Form */}
            <div className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm space-y-4 h-fit">
              <h3 className="font-black text-base text-[#1E1B24] flex items-center gap-2">
                <Bell className="w-4 h-4 text-purple-600" />
                <span>Create Global Announcement</span>
              </h3>
              <form onSubmit={handleCreateAnnouncement} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Headline / Badge</label>
                  <input
                    type="text"
                    required
                    value={newAnnTitle}
                    onChange={(e) => setNewAnnTitle(e.target.value)}
                    placeholder="e.g. System Update, New Feature"
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Message</label>
                  <textarea
                    required
                    rows={3}
                    value={newAnnMsg}
                    onChange={(e) => setNewAnnMsg(e.target.value)}
                    placeholder="Describe what users need to know..."
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:border-black"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-600 mb-1">Alert Color / Style</label>
                  <select
                    value={newAnnType}
                    onChange={(e) => setNewAnnType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-bold focus:outline-none"
                  >
                    <option value="info">Info (Soft Blue)</option>
                    <option value="success">Success (Lime Pop)</option>
                    <option value="warning">Warning (Amber)</option>
                    <option value="alert">Alert (Rose Red)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-black text-white font-bold text-xs hover:bg-neutral-800 transition"
                >
                  Broadcast to Public Site
                </button>
              </form>
            </div>

            {/* Existing Announcements List */}
            <div className="lg:col-span-2 space-y-3">
              <h3 className="font-black text-base text-[#1E1B24]">Active & Past Announcements</h3>
              {announcements.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-3xl border border-black/5 text-neutral-400 text-xs">
                  No announcements recorded yet.
                </div>
              ) : (
                announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            ann.type === 'success'
                              ? 'bg-lime-100 text-lime-800'
                              : ann.type === 'warning'
                              ? 'bg-amber-100 text-amber-800'
                              : ann.type === 'alert'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {ann.type}
                        </span>
                        <h4 className="font-black text-sm text-[#1E1B24]">{ann.title}</h4>
                      </div>
                      <p className="text-xs text-neutral-600">{ann.message}</p>
                      <p className="text-[10px] text-neutral-400">{new Date(ann.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => handleToggleAnnouncement(ann.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition ${
                          ann.active
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                        }`}
                      >
                        {ann.active ? 'Broadcasting' : 'Hidden'}
                      </button>
                      <button
                        onClick={() => handleDeleteAnnouncement(ann.id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-neutral-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── TAB 5: FEEDBACK & BUG TRACKER ──────────────────────────────── */}
        {activeTab === 'feedback' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm flex items-center justify-between">
              <span className="text-xs font-bold text-neutral-600">
                Filter Reports ({feedbackList.length} total)
              </span>
              <div className="flex items-center gap-2">
                {(['all', 'bug', 'feature'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setFeedbackFilter(type)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold capitalize transition ${
                      feedbackFilter === type
                        ? 'bg-black text-white'
                        : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              {feedbackList
                .filter((f) => feedbackFilter === 'all' || f.type === feedbackFilter)
                .map((fb) => (
                  <div
                    key={fb.id}
                    className="bg-white p-5 rounded-2xl border border-black/5 shadow-sm space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                              fb.type === 'bug'
                                ? 'bg-rose-100 text-rose-700'
                                : fb.type === 'feature'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-neutral-100 text-neutral-700'
                            }`}
                          >
                            {fb.type}
                          </span>
                          {fb.toolTitle && (
                            <span className="font-bold text-xs text-[#1E1B24] bg-neutral-100 px-2 py-0.5 rounded">
                              Tool: {fb.toolTitle}
                            </span>
                          )}
                          <span className="text-xs text-neutral-400 font-mono">from: {fb.userEmail}</span>
                        </div>
                        <p className="text-xs text-neutral-700 mt-2 font-medium">{fb.message}</p>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <select
                          value={fb.status}
                          onChange={(e) => handleFeedbackStatus(fb.id, e.target.value as any)}
                          className="bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl px-2.5 py-1 text-xs font-bold"
                        >
                          <option value="new">New</option>
                          <option value="investigating">Investigating</option>
                          <option value="resolved">Resolved</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* ── TAB 6: SECURITY & AUDIT LOGS ────────────────────────────────── */}
        {activeTab === 'audit' && (
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-2xl border border-black/5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Log Filter:</span>
                <select
                  value={auditCategoryFilter}
                  onChange={(e) => setAuditCategoryFilter(e.target.value)}
                  className="bg-neutral-50 border border-neutral-200 text-neutral-700 rounded-xl px-3 py-1.5 text-xs font-bold focus:outline-none"
                >
                  <option value="all">All Categories</option>
                  <option value="AUTH">Authentication</option>
                  <option value="TOOL_MOD">Tool Modifications</option>
                  <option value="USER_MOD">User Moderation</option>
                  <option value="SECURITY">Security Incidents</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(auditLogs, null, 2));
                    const dl = document.createElement('a');
                    dl.setAttribute('href', dataStr);
                    dl.setAttribute('download', `vivax_audit_${Date.now()}.json`);
                    dl.click();
                  }}
                  className="px-3 py-1.5 rounded-xl border border-black/10 bg-white text-xs font-bold hover:bg-neutral-50 transition"
                >
                  Export Audit JSON
                </button>
                <button
                  onClick={() => {
                    if (confirm('Clear audit logs history?')) {
                      AdminStore.clearAuditLogs();
                      setAuditLogs([]);
                      showToast('Audit trail cleared');
                    }
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-700 text-xs font-bold hover:bg-rose-100 transition"
                >
                  Clear Logs
                </button>
              </div>
            </div>

            {/* Audit Log Table */}
            <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs font-mono">
                  <thead>
                    <tr className="bg-neutral-50/80 border-b border-neutral-100 text-neutral-500 font-bold uppercase tracking-wider text-[10px]">
                      <th className="py-3.5 px-4">Timestamp</th>
                      <th className="py-3.5 px-4">Event</th>
                      <th className="py-3.5 px-4">Actor</th>
                      <th className="py-3.5 px-4">Client IP</th>
                      <th className="py-3.5 px-4">Status</th>
                      <th className="py-3.5 px-4">Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {filteredAudit.map((log) => (
                      <tr key={log.id} className="hover:bg-neutral-50/60 transition">
                        <td className="py-3 px-4 text-neutral-400 whitespace-nowrap">
                          {new Date(log.timestamp).toLocaleTimeString()}
                        </td>
                        <td className="py-3 px-4 font-bold text-[#1E1B24]">{log.action}</td>
                        <td className="py-3 px-4 text-neutral-600">{log.actor}</td>
                        <td className="py-3 px-4 text-neutral-500 text-[11px]">{log.ip}</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              log.status === 'success'
                                ? 'bg-emerald-100 text-emerald-800'
                                : log.status === 'blocked'
                                ? 'bg-rose-100 text-rose-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {log.status}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-neutral-700 text-[11px] font-sans">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
