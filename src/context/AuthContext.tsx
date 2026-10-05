import React, {createContext, useCallback, useContext, useEffect, useState} from 'react';
import {User, UserRole} from '../types/app';

export interface ManagedUser extends User {
  status: 'active' | 'suspended';
  createdAt: string;
}

interface AuthContextValue {
  enabled: boolean;
  loading: boolean;
  error: string | null;
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
  const [user, setUser] = useState<ManagedUser | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);

  const refreshSession = useCallback(async () => {
    if (!enabled) return;
    setLoading(true);
    setError(null);
    try {
      const result = await apiRequest<{user: ManagedUser | null}>('/api/auth/me');
      setUser(result.user);
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Server autentikasi tidak dapat dijangkau.');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    void refreshSession();
  }, [refreshSession]);

  const authenticate = async (endpoint: string, data: Record<string, string>) => {
    setError(null);
    const result = await apiRequest<{user: ManagedUser}>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    setUser(result.user);
  };

  const login = (email: string, password: string) => authenticate('/api/auth/login', {email, password});
  const register = (name: string, email: string, phone: string, password: string) => (
    authenticate('/api/auth/register', {name, email, phone, password})
  );

  const logout = async () => {
    await apiRequest<void>('/api/auth/logout', {method: 'POST'});
    setUser(null);
  };

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
      enabled, loading, error, user, login, register, logout, listUsers, updateUser, refreshSession,
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
