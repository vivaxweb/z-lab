/**
 * Vivax Admin Store
 * Centralized data management for Admin Panel controls:
 * - Tool Status & Maintenance switches
 * - User Directory & Moderation
 * - Global Announcements / Banners
 * - User Feedback & Bug Reports
 * - Security & Audit Trail Logs
 */

export interface ToolStatusOverride {
  enabled: boolean;
  isMaintenance: boolean;
  maintenanceMessage?: string;
  badge?: string;
}

export interface UserAccount {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'moderator' | 'user';
  status: 'active' | 'suspended' | 'banned';
  createdAt: string;
  lastLoginAt: string;
  toolsUsedCount: number;
}

export interface GlobalAnnouncement {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'alert' | 'success';
  active: boolean;
  createdAt: string;
}

export interface UserFeedback {
  id: string;
  userEmail: string;
  toolSlug?: string;
  toolTitle?: string;
  type: 'bug' | 'feature' | 'general';
  message: string;
  status: 'new' | 'investigating' | 'resolved';
  createdAt: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category: 'AUTH' | 'TOOL_MOD' | 'USER_MOD' | 'SYSTEM' | 'SECURITY';
  status: 'success' | 'warning' | 'blocked';
  ip: string;
  details: string;
}

const STORAGE_KEY_TOOLS = 'vivax_admin_tools_override';
const STORAGE_KEY_USERS = 'vivax_admin_users';
const STORAGE_KEY_ANNOUNCEMENTS = 'vivax_admin_announcements';
const STORAGE_KEY_FEEDBACK = 'vivax_admin_feedback';
const STORAGE_KEY_AUDIT = 'vivax_admin_audit_logs';

// Default initial users
const INITIAL_USERS: UserAccount[] = [
  {
    uid: 'usr_vivax_01',
    email: 'admin@vivax.local',
    displayName: 'Vivax Root Admin',
    role: 'admin',
    status: 'active',
    createdAt: '2026-01-10T08:00:00Z',
    lastLoginAt: new Date().toISOString(),
    toolsUsedCount: 142,
  },
  {
    uid: 'usr_test_02',
    email: 'sarah.creator@example.com',
    displayName: 'Sarah Chen',
    role: 'user',
    status: 'active',
    createdAt: '2026-02-14T11:20:00Z',
    lastLoginAt: '2026-03-29T14:10:00Z',
    toolsUsedCount: 68,
  },
  {
    uid: 'usr_test_03',
    email: 'alex.dev@zlab.io',
    displayName: 'Alex Rivers',
    role: 'moderator',
    status: 'active',
    createdAt: '2026-03-01T09:15:00Z',
    lastLoginAt: '2026-04-02T19:40:00Z',
    toolsUsedCount: 115,
  },
  {
    uid: 'usr_test_04',
    email: 'spammer_bot99@trashmail.com',
    displayName: 'Spam Bot 99',
    role: 'user',
    status: 'banned',
    createdAt: '2026-03-20T04:22:00Z',
    lastLoginAt: '2026-03-20T04:22:00Z',
    toolsUsedCount: 2,
  },
];

// Default initial announcement
const INITIAL_ANNOUNCEMENTS: GlobalAnnouncement[] = [
  {
    id: 'ann_1',
    title: 'Version 2.0 Live',
    message: 'Welcome to Z-Lab v2.0! All tools process 100% in your browser with zero data uploads.',
    type: 'success',
    active: true,
    createdAt: '2026-01-01T00:00:00Z',
  },
];

// Default initial feedback
const INITIAL_FEEDBACK: UserFeedback[] = [
  {
    id: 'fb_1',
    userEmail: 'sarah.creator@example.com',
    toolSlug: 'image-compressor',
    toolTitle: 'Image Compressor',
    type: 'feature',
    message: 'Would love an option to batch export all compressed images directly as a single .ZIP archive!',
    status: 'investigating',
    createdAt: '2026-04-01T15:30:00Z',
  },
  {
    id: 'fb_2',
    userEmail: 'alex.dev@zlab.io',
    toolSlug: 'qr-scanner',
    toolTitle: 'QR Scanner',
    type: 'bug',
    message: 'Camera permission denied state could have a friendlier retry prompt on Safari iOS.',
    status: 'new',
    createdAt: '2026-04-05T18:12:00Z',
  },
];

// Default audit trail
const INITIAL_AUDIT: AuditLogEntry[] = [
  {
    id: 'aud_1',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    actor: 'admin@vivax.local',
    action: 'ADMIN_LOGIN_SUCCESS',
    category: 'AUTH',
    status: 'success',
    ip: '192.168.1.100 (Verified)',
    details: 'Authenticated via Vivax Secure Gateway with PIN challenge.',
  },
  {
    id: 'aud_2',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    actor: 'anonymous_scanner',
    action: 'UNAUTHORIZED_ACCESS_ATTEMPT',
    category: 'SECURITY',
    status: 'blocked',
    ip: '45.143.201.88 (External)',
    details: 'Attempted to access default /admin route; diverted to honeypot trap.',
  },
];

// Helper to safely access browser storage
function getStored<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') return defaultValue;
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch {
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // quota exceeded or private mode
  }
}

export const AdminStore = {
  // Tool Overrides
  getToolOverrides(): Record<string, ToolStatusOverride> {
    return getStored<Record<string, ToolStatusOverride>>(STORAGE_KEY_TOOLS, {});
  },

  setToolOverride(slug: string, override: Partial<ToolStatusOverride>) {
    const existing = this.getToolOverrides();
    const current = existing[slug] || { enabled: true, isMaintenance: false };
    const updated = {
      ...existing,
      [slug]: {
        enabled: override.enabled !== undefined ? override.enabled : current.enabled,
        isMaintenance: override.isMaintenance !== undefined ? override.isMaintenance : current.isMaintenance,
        maintenanceMessage: override.maintenanceMessage !== undefined ? override.maintenanceMessage : current.maintenanceMessage,
        badge: override.badge !== undefined ? override.badge : current.badge,
      },
    };
    setStored(STORAGE_KEY_TOOLS, updated);
    this.addAuditLog('admin@vivax.local', 'TOOL_STATUS_UPDATE', 'TOOL_MOD', 'success', `Tool [${slug}] status updated.`);
    return updated;
  },

  // Users Directory
  getUsers(): UserAccount[] {
    return getStored<UserAccount[]>(STORAGE_KEY_USERS, INITIAL_USERS);
  },

  updateUserStatus(uid: string, status: UserAccount['status']) {
    const users = this.getUsers().map((u) => (u.uid === uid ? { ...u, status } : u));
    setStored(STORAGE_KEY_USERS, users);
    this.addAuditLog('admin@vivax.local', 'USER_STATUS_CHANGE', 'USER_MOD', 'success', `User [${uid}] changed to [${status}].`);
    return users;
  },

  updateUserRole(uid: string, role: UserAccount['role']) {
    const users = this.getUsers().map((u) => (u.uid === uid ? { ...u, role } : u));
    setStored(STORAGE_KEY_USERS, users);
    this.addAuditLog('admin@vivax.local', 'USER_ROLE_CHANGE', 'USER_MOD', 'success', `User [${uid}] role updated to [${role}].`);
    return users;
  },

  deleteUser(uid: string) {
    const users = this.getUsers().filter((u) => u.uid !== uid);
    setStored(STORAGE_KEY_USERS, users);
    this.addAuditLog('admin@vivax.local', 'USER_DELETED', 'USER_MOD', 'warning', `User [${uid}] purged from database.`);
    return users;
  },

  addUser(user: UserAccount) {
    const users = [user, ...this.getUsers()];
    setStored(STORAGE_KEY_USERS, users);
    return users;
  },

  // Announcements
  getAnnouncements(): GlobalAnnouncement[] {
    return getStored<GlobalAnnouncement[]>(STORAGE_KEY_ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  },

  addAnnouncement(ann: Omit<GlobalAnnouncement, 'id' | 'createdAt'>) {
    const item: GlobalAnnouncement = {
      ...ann,
      id: 'ann_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    const list = [item, ...this.getAnnouncements()];
    setStored(STORAGE_KEY_ANNOUNCEMENTS, list);
    this.addAuditLog('admin@vivax.local', 'ANNOUNCEMENT_CREATED', 'SYSTEM', 'success', `Announcement created: "${ann.title}"`);
    return list;
  },

  toggleAnnouncement(id: string) {
    const list = this.getAnnouncements().map((a) => (a.id === id ? { ...a, active: !a.active } : a));
    setStored(STORAGE_KEY_ANNOUNCEMENTS, list);
    return list;
  },

  deleteAnnouncement(id: string) {
    const list = this.getAnnouncements().filter((a) => a.id !== id);
    setStored(STORAGE_KEY_ANNOUNCEMENTS, list);
    return list;
  },

  // Feedback
  getFeedback(): UserFeedback[] {
    return getStored<UserFeedback[]>(STORAGE_KEY_FEEDBACK, INITIAL_FEEDBACK);
  },

  addFeedback(fb: Omit<UserFeedback, 'id' | 'status' | 'createdAt'>) {
    const item: UserFeedback = {
      ...fb,
      id: 'fb_' + Date.now(),
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    const list = [item, ...this.getFeedback()];
    setStored(STORAGE_KEY_FEEDBACK, list);
    return list;
  },

  updateFeedbackStatus(id: string, status: UserFeedback['status']) {
    const list = this.getFeedback().map((f) => (f.id === id ? { ...f, status } : f));
    setStored(STORAGE_KEY_FEEDBACK, list);
    return list;
  },

  // Audit Logs
  getAuditLogs(): AuditLogEntry[] {
    return getStored<AuditLogEntry[]>(STORAGE_KEY_AUDIT, INITIAL_AUDIT);
  },

  addAuditLog(
    actor: string,
    action: string,
    category: AuditLogEntry['category'],
    status: AuditLogEntry['status'],
    details: string,
    ip = '127.0.0.1 (Internal)'
  ) {
    const entry: AuditLogEntry = {
      id: 'aud_' + Date.now() + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toISOString(),
      actor,
      action,
      category,
      status,
      ip,
      details,
    };
    const logs = [entry, ...this.getAuditLogs()].slice(0, 100); // keep recent 100 logs
    setStored(STORAGE_KEY_AUDIT, logs);
    return logs;
  },

  clearAuditLogs() {
    setStored(STORAGE_KEY_AUDIT, []);
    return [];
  },
};
