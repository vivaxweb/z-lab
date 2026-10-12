'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AdminStore, UserAccount } from '@/lib/admin-store';
import { isFirebaseConfigured, auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from 'firebase/auth';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'admin' | 'moderator' | 'user';
  createdAt?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAdmin: boolean;
  isAdminSessionActive: boolean;
  failedLoginAttempts: number;
  lockoutSeconds: number;
  favorites: string[];
  recentTools: string[];
  loginUser: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  registerUser: (email: string, pass: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logoutUser: () => Promise<void>;
  verifyAdminAccess: (passcode: string) => { success: boolean; error?: string };
  logoutAdmin: () => void;
  toggleFavorite: (slug: string) => void;
  addRecentTool: (slug: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MASTER_ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || 'vivax2026';
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminSessionActive, setIsAdminSessionActive] = useState(false);
  const [failedLoginAttempts, setFailedLoginAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentTools, setRecentTools] = useState<string[]>([]);

  // Load initial local data & check session
  useEffect(() => {
    try {
      // 1. Check favorites
      const savedFavs = localStorage.getItem('zlab_favorites');
      if (savedFavs) setFavorites(JSON.parse(savedFavs));

      // 2. Check recent tools
      const savedRecents = localStorage.getItem('zlab_recent_tools');
      if (savedRecents) setRecentTools(JSON.parse(savedRecents));

      // 3. Check active admin session token
      const adminToken = sessionStorage.getItem('vivax_admin_session');
      const adminExpiry = sessionStorage.getItem('vivax_admin_expiry');
      if (adminToken && adminExpiry && Number(adminExpiry) > Date.now()) {
        setIsAdminSessionActive(true);
      } else {
        sessionStorage.removeItem('vivax_admin_session');
        sessionStorage.removeItem('vivax_admin_expiry');
      }

      // 4. Check lockout state
      const lockUntil = localStorage.getItem('vivax_lockout_until');
      if (lockUntil && Number(lockUntil) > Date.now()) {
        const remaining = Math.ceil((Number(lockUntil) - Date.now()) / 1000);
        setLockoutSeconds(remaining);
      }
    } catch {
      // Ignore storage errors
    }

    // Firebase Auth listener if active
    if (isFirebaseConfigured && auth) {
      const unsubscribe = onAuthStateChanged(auth, (fbUser) => {
        if (fbUser) {
          const registeredUsers = AdminStore.getUsers();
          const match = registeredUsers.find((u) => u.email.toLowerCase() === fbUser.email?.toLowerCase());
          setUser({
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || fbUser.email?.split('@')[0] || 'User',
            role: match?.role || 'user',
          });
        } else {
          // Check local simulated user
          const localUser = localStorage.getItem('zlab_current_user');
          if (localUser) {
            setUser(JSON.parse(localUser));
          } else {
            setUser(null);
          }
        }
        setIsLoading(false);
      });
      return () => unsubscribe();
    } else {
      // Offline / Local Simulation Mode
      try {
        const localUser = localStorage.getItem('zlab_current_user');
        if (localUser) {
          setUser(JSON.parse(localUser));
        }
      } catch {
        // ignore
      }
      setIsLoading(false);
    }
  }, []);

  // Lockout countdown timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const interval = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (prev <= 1) {
          localStorage.removeItem('vivax_lockout_until');
          setFailedLoginAttempts(0);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockoutSeconds]);

  // User Login
  const loginUser = useCallback(async (email: string, pass: string) => {
    if (isFirebaseConfigured && auth) {
      try {
        const res = await signInWithEmailAndPassword(auth, email, pass);
        const registeredUsers = AdminStore.getUsers();
        const match = registeredUsers.find((u) => u.email.toLowerCase() === res.user.email?.toLowerCase());
        const authUser: AuthUser = {
          uid: res.user.uid,
          email: res.user.email || email,
          displayName: res.user.displayName || email.split('@')[0],
          role: match?.role || 'user',
        };
        setUser(authUser);
        localStorage.setItem('zlab_current_user', JSON.stringify(authUser));
        return { success: true };
      } catch (err: unknown) {
        return { success: false, error: (err as Error).message };
      }
    } else {
      // Local Sandbox login
      const registeredUsers = AdminStore.getUsers();
      const existing = registeredUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
      if (existing) {
        if (existing.status === 'banned') {
          return { success: false, error: 'This account has been suspended by an administrator.' };
        }
        const authUser: AuthUser = {
          uid: existing.uid,
          email: existing.email,
          displayName: existing.displayName,
          role: existing.role,
        };
        setUser(authUser);
        localStorage.setItem('zlab_current_user', JSON.stringify(authUser));
        return { success: true };
      } else {
        // Auto-create local user for friendly onboarding
        const newUser: UserAccount = {
          uid: 'usr_' + Date.now(),
          email,
          displayName: email.split('@')[0],
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          toolsUsedCount: 0,
        };
        AdminStore.addUser(newUser);
        const authUser: AuthUser = {
          uid: newUser.uid,
          email: newUser.email,
          displayName: newUser.displayName,
          role: newUser.role,
        };
        setUser(authUser);
        localStorage.setItem('zlab_current_user', JSON.stringify(authUser));
        return { success: true };
      }
    }
  }, []);

  // User Register
  const registerUser = useCallback(async (email: string, pass: string, name: string) => {
    if (isFirebaseConfigured && auth) {
      try {
        const res = await createUserWithEmailAndPassword(auth, email, pass);
        if (res.user) {
          await updateProfile(res.user, { displayName: name });
        }
        const newUser: UserAccount = {
          uid: res.user.uid,
          email,
          displayName: name,
          role: 'user',
          status: 'active',
          createdAt: new Date().toISOString(),
          lastLoginAt: new Date().toISOString(),
          toolsUsedCount: 0,
        };
        AdminStore.addUser(newUser);
        const authUser: AuthUser = {
          uid: res.user.uid,
          email,
          displayName: name,
          role: 'user',
        };
        setUser(authUser);
        localStorage.setItem('zlab_current_user', JSON.stringify(authUser));
        return { success: true };
      } catch (err: unknown) {
        return { success: false, error: (err as Error).message };
      }
    } else {
      const registeredUsers = AdminStore.getUsers();
      if (registeredUsers.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
        return { success: false, error: 'An account with this email already exists.' };
      }
      const newUser: UserAccount = {
        uid: 'usr_' + Date.now(),
        email,
        displayName: name,
        role: 'user',
        status: 'active',
        createdAt: new Date().toISOString(),
        lastLoginAt: new Date().toISOString(),
        toolsUsedCount: 0,
      };
      AdminStore.addUser(newUser);
      const authUser: AuthUser = {
        uid: newUser.uid,
        email: newUser.email,
        displayName: newUser.displayName,
        role: newUser.role,
      };
      setUser(authUser);
      localStorage.setItem('zlab_current_user', JSON.stringify(authUser));
      return { success: true };
    }
  }, []);

  // User Logout
  const logoutUser = useCallback(async () => {
    if (isFirebaseConfigured && auth) {
      await signOut(auth);
    }
    setUser(null);
    localStorage.removeItem('zlab_current_user');
  }, []);

  // Admin Access Verification for /adminvivax
  const verifyAdminAccess = useCallback(
    (passcode: string) => {
      // Check lockout
      if (lockoutSeconds > 0) {
        return {
          success: false,
          error: `Gateway locked due to multiple failed attempts. Try again in ${lockoutSeconds}s.`,
        };
      }

      if (passcode.trim() === MASTER_ADMIN_PASSCODE) {
        // Success
        setFailedLoginAttempts(0);
        setIsAdminSessionActive(true);
        const sessionToken = 'vx_' + Math.random().toString(36).substring(2) + Date.now();
        const expiry = Date.now() + 30 * 60 * 1000; // 30 min session
        sessionStorage.setItem('vivax_admin_session', sessionToken);
        sessionStorage.setItem('vivax_admin_expiry', expiry.toString());

        AdminStore.addAuditLog(
          user?.email || 'admin@vivax.local',
          'ADMIN_GATEWAY_SUCCESS',
          'AUTH',
          'success',
          'Authenticated with master passcode at /adminvivax.'
        );
        return { success: true };
      } else {
        // Failed attempt
        const newAttempts = failedLoginAttempts + 1;
        setFailedLoginAttempts(newAttempts);

        AdminStore.addAuditLog(
          user?.email || 'unauthorized_visitor',
          'ADMIN_GATEWAY_FAILED',
          'SECURITY',
          'warning',
          `Failed passcode attempt (#${newAttempts}) at /adminvivax.`
        );

        if (newAttempts >= MAX_FAILED_ATTEMPTS) {
          const lockUntil = Date.now() + LOCKOUT_DURATION_MS;
          localStorage.setItem('vivax_lockout_until', lockUntil.toString());
          setLockoutSeconds(Math.ceil(LOCKOUT_DURATION_MS / 1000));
          return {
            success: false,
            error: `Maximum attempts reached. High-security gateway locked for 15 minutes.`,
          };
        }

        return {
          success: false,
          error: `Invalid security passcode. ${MAX_FAILED_ATTEMPTS - newAttempts} attempts remaining.`,
        };
      }
    },
    [failedLoginAttempts, lockoutSeconds, user]
  );

  const logoutAdmin = useCallback(() => {
    setIsAdminSessionActive(false);
    sessionStorage.removeItem('vivax_admin_session');
    sessionStorage.removeItem('vivax_admin_expiry');
    AdminStore.addAuditLog(
      user?.email || 'admin@vivax.local',
      'ADMIN_SESSION_TERMINATED',
      'AUTH',
      'success',
      'Admin session logged out.'
    );
  }, [user]);

  // Favorites Management
  const toggleFavorite = useCallback((slug: string) => {
    setFavorites((prev) => {
      const next = prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug];
      localStorage.setItem('zlab_favorites', JSON.stringify(next));
      return next;
    });
  }, []);

  // Recent Tools Tracking
  const addRecentTool = useCallback((slug: string) => {
    setRecentTools((prev) => {
      const next = [slug, ...prev.filter((s) => s !== slug)].slice(0, 12);
      localStorage.setItem('zlab_recent_tools', JSON.stringify(next));
      return next;
    });
  }, []);

  const isAdmin = user?.role === 'admin' || isAdminSessionActive;

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin,
        isAdminSessionActive,
        failedLoginAttempts,
        lockoutSeconds,
        favorites,
        recentTools,
        loginUser,
        registerUser,
        logoutUser,
        verifyAdminAccess,
        logoutAdmin,
        toggleFavorite,
        addRecentTool,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
