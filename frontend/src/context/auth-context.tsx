"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "CUSTOMER" | "ADMIN";
  phone?: string | null;
};

type AuthSession = {
  user: AuthUser;
  token: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  token: string | null;
  isReady: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const STORAGE_KEY = "silk-shadow-auth";
const CHANGE_EVENT = "silk-shadow:auth-change";
const AuthContext = createContext<AuthContextValue | null>(null);

let cachedRaw: string | null | undefined;
let cachedSession: AuthSession | null = null;

function getAuthSnapshot(): AuthSession | null {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === cachedRaw) return cachedSession;

  cachedRaw = raw;
  try {
    const parsed = raw ? (JSON.parse(raw) as Partial<AuthSession>) : null;
    cachedSession =
      parsed?.token && parsed.user?.id && parsed.user.email
        ? (parsed as AuthSession)
        : null;
  } catch {
    cachedSession = null;
  }

  return cachedSession;
}

function subscribeToAuth(onStoreChange: () => void) {
  const handleLocalChange = () => onStoreChange();
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) return;
    cachedRaw = undefined;
    onStoreChange();
  };

  window.addEventListener(CHANGE_EVENT, handleLocalChange);
  window.addEventListener("storage", handleStorageChange);
  return () => {
    window.removeEventListener(CHANGE_EVENT, handleLocalChange);
    window.removeEventListener("storage", handleStorageChange);
  };
}

function saveAuthSession(session: AuthSession | null) {
  cachedSession = session;

  if (session) {
    cachedRaw = JSON.stringify(session);
    window.localStorage.setItem(STORAGE_KEY, cachedRaw);
  } else {
    cachedRaw = null;
    window.localStorage.removeItem(STORAGE_KEY);
  }

  window.dispatchEvent(new Event(CHANGE_EVENT));
}

async function authenticate(
  path: "/auth/login" | "/auth/register",
  body: Record<string, string>
) {
  const response = await fetch(API_URL + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
  });

  const data = (await response.json().catch(() => ({}))) as {
    user?: AuthUser;
    token?: string;
    error?: string;
  };

  if (!response.ok) {
    throw new Error(data.error || "Unable to sign in. Please try again.");
  }

  if (!data.user || !data.token) {
    throw new Error("The server returned an invalid login response.");
  }

  saveAuthSession({ user: data.user, token: data.token });
}

function subscribeToHydration() {
  return () => {};
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const session = useSyncExternalStore(
    subscribeToAuth,
    getAuthSnapshot,
    () => null
  );
  const isReady = useSyncExternalStore(
    subscribeToHydration,
    () => true,
    () => false
  );

  useEffect(() => {
    if (!session?.token) return;

    const controller = new AbortController();
    fetch(API_URL + "/auth/me", {
      headers: { Authorization: "Bearer " + session.token },
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (response.status === 401) {
          saveAuthSession(null);
          return null;
        }
        if (!response.ok) return null;
        return response.json() as Promise<AuthUser>;
      })
      .then((user) => {
        if (user && !controller.signal.aborted) {
          saveAuthSession({ token: session.token, user });
        }
      })
      .catch(() => {});

    return () => controller.abort();
  }, [session?.token]);

  const login = useCallback(async (email: string, password: string) => {
    await authenticate("/auth/login", {
      email: email.trim().toLowerCase(),
      password,
    });
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    await authenticate("/auth/register", {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
  }, []);

  const logout = useCallback(() => saveAuthSession(null), []);

  const value = useMemo(
    () => ({
      user: session?.user || null,
      isAuthenticated: Boolean(session),
      token: session?.token || null,
      isReady,
      login,
      register,
      logout,
    }),
    [session, isReady, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
}
