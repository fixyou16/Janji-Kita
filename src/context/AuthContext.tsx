import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import type {User, UserRole} from '../types/app';
import type {Session} from '@supabase/supabase-js';
import {supabase} from '../lib/supabase';

export interface ManagedUser extends User {
  status: 'active' | 'suspended';
  createdAt: string;
}

interface AuthContextValue {
  enabled: boolean;
  loading: boolean;
  error: string | null;
  notice: string | null;
  user: ManagedUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, phone: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  listUsers: () => Promise<ManagedUser[]>;
  updateUser: (id: string, updates: {role?: Exclude<UserRole, 'super_admin'>; status?: 'active' | 'suspended'}) => Promise<ManagedUser>;
  refreshSession: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

async function apiRequest<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    credentials: 'same-origin',
    headers: {
      ...(init?.body ? {'Content-Type': 'application/json'} : {}),
      ...init?.headers,
    },
  });
  if (!response.ok) {
    const result = await response.json().catch(() => ({})) as {error?: string};
    throw new Error(result.error || `Permintaan gagal (${response.status}).`);
  }
  if (response.status === 204) return undefined as T;
  return response.json() as Promise<T>;
}

export const AuthProvider: React.FC<{enabled: boolean; children: React.ReactNode}> = ({enabled, children}) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<ManagedUser | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const loadProfile = useCallback(async (nextSession: Session | null) => {
    if (!enabled || !supabase || !nextSession?.user) {
      setUser(null);
      setLoading(false);
      return;
    }

    setLoading(true);
    const {data, error: profileError} = await supabase
      .from('profiles')
      .select('id, full_name, role, created_at')
      .eq('id', nextSession.user.id)
      .single();

    if (profileError || !data) {
      setUser(null);
      setError(profileError?.message || 'Profil akun tidak ditemukan.');
      setLoading(false);
      return;
    }

    const appRole: UserRole = data.role === 'admin'
      ? 'super_admin'
      : data.role === 'reseller'
        ? 'reseller'
        : 'customer';

    setUser({
      id: data.id,
      name: data.full_name || nextSession.user.email || 'Pengguna',
      email: nextSession.user.email || '',
      phone: typeof nextSession.user.user_metadata?.phone === 'string' ? nextSession.user.user_metadata.phone : '',
      role: appRole,
      avatar: '',
      status: 'active',
      createdAt: data.created_at || nextSession.user.created_at,
    });
    setError(null);
    setLoading(false);
  }, [enabled]);

  const refreshSession = useCallback(async () => {
    if (!enabled || !supabase) return;
    setLoading(true);
    setError(null);
    const {data, error: sessionError} = await supabase.auth.getSession();
    if (sessionError) {
      setError(sessionError.message);
      setLoading(false);
      return;
    }
    setSession(data.session);
    await loadProfile(data.session);
  }, [enabled, loadProfile]);

  useEffect(() => {
    if (!enabled || !supabase) {
      setLoading(false);
      return;
    }

    let mounted = true;
    supabase.auth.getSession().then(({data, error: sessionError}) => {
      if (!mounted) return;
      if (sessionError) setError(sessionError.message);
      setSession(data.session);
      void loadProfile(data.session);
    });

    const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setNotice(null);
      // Defer profile lookup so Supabase's auth callback can finish first.
      Promise.resolve().then(() => {
        if (mounted) void loadProfile(nextSession);
      });
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, [enabled, loadProfile]);

  const login = async (email: string, password: string) => {
    if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
    setError(null);
    setNotice(null);
    const {error: signInError} = await supabase.auth.signInWithPassword({email: email.trim(), password});
    if (signInError) throw signInError;
  };

  const register = async (name: string, email: string, phone: string, password: string) => {
    if (!supabase) throw new Error('Supabase belum dikonfigurasi.');
    setError(null);
    setNotice(null);
    const {data, error: signUpError} = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {data: {full_name: name.trim(), phone: phone.trim()}},
    });
    if (signUpError) throw signUpError;
    if (!data.session) {
      setNotice('Akun berhasil dibuat. Periksa email untuk verifikasi sebelum masuk.');
    }
  };

  const logout = async () => {
    if (!supabase) return;
    const {error: signOutError} = await supabase.auth.signOut();
    if (signOutError) throw signOutError;
    setSession(null);
    setUser(null);
  };

  // These legacy admin endpoints are retained for compatibility with the older account portal.
  // The main app uses the Supabase profile role and protected app views.
  const listUsers = async () => {
    const result = await apiRequest<{users: ManagedUser[]}>('/api/admin/users');
    return result.users;
  };

  const updateUser = async (
    id: string,
    updates: {role?: Exclude<UserRole, 'super_admin'>; status?: 'active' | 'suspended'},
  ) => {
    const result = await apiRequest<{user: ManagedUser}>(`/api/admin/users/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });
    return result.user;
  };

  return (
    <AuthContext.Provider value={{
      enabled, loading, error, notice, user, login, register, logout, listUsers, updateUser, refreshSession,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
