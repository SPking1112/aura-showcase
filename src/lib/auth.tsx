import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

const AUTH_KEY = "portal_auth_v1";
const ADMIN_USER = "admin";
const ADMIN_PASS = "1234";

type AuthState = {
  isAuthenticated: boolean;
  username: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(AUTH_KEY);
      if (raw) setUsername(JSON.parse(raw).username);
    } catch {
      /* ignore */
    }
    setHydrated(true);
  }, []);

  const login = async (u: string, p: string) => {
    await new Promise((r) => setTimeout(r, 400));
    if (u.trim() !== ADMIN_USER || p !== ADMIN_PASS) {
      throw new Error("Invalid credentials");
    }
    localStorage.setItem(AUTH_KEY, JSON.stringify({ username: u }));
    setUsername(u);
  };

  const logout = () => {
    localStorage.removeItem(AUTH_KEY);
    setUsername(null);
  };

  if (!hydrated) return null;

  return (
    <AuthContext.Provider
      value={{ isAuthenticated: !!username, username, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
