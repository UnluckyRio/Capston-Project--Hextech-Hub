import { createContext, useContext, useEffect, useMemo, useState } from "react";

// Context di autenticazione: gestisce token JWT e helper
type AuthContextValue = {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string, remember?: boolean) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("hextech.jwt");
      if (stored) setToken(stored);
    } catch {/* noop */}
  }, []);

  const login = (t: string, remember = true) => {
    setToken(t);
    if (remember) {
      try { localStorage.setItem("hextech.jwt", t); } catch {/* noop */}
    }
  };

  const logout = () => {
    setToken(null);
    try { localStorage.removeItem("hextech.jwt"); } catch {/* noop */}
  };

  const value = useMemo<AuthContextValue>(() => ({
    isAuthenticated: !!token,
    token,
    login,
    logout,
  }), [token]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}