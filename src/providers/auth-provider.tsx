"use client";

import * as React from "react";
import type { User, UserRole } from "@/types";

const STORAGE_KEY = "smc-user";

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as unknown;
    if (
      data &&
      typeof data === "object" &&
      typeof (data as User).id === "string" &&
      typeof (data as User).name === "string" &&
      typeof (data as User).email === "string" &&
      typeof (data as User).role === "string"
    ) {
      const u = data as User;
      return {
        id: u.id,
        name: u.name,
        email: u.email,
        role: u.role as UserRole,
        departmentId: typeof u.departmentId === "string" ? u.departmentId : undefined,
        avatar: typeof u.avatar === "string" ? u.avatar : undefined,
      };
    }
  } catch {
    // ignore
  }
  return null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface AuthContextValue {
  user: User | null;
  role: UserRole;
  setUser: (user: User | null) => void;
  login: (credentials: LoginCredentials) => Promise<{ error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = React.createContext<AuthContextValue | undefined>(undefined);

const DEMO_USERS: Record<UserRole, User> = {
  admin: {
    id: "1",
    name: "Municipal Admin",
    email: "admin@municipal.gov",
    role: "admin",
    avatar: undefined,
  },
  department_head: {
    id: "2",
    name: "Dept. Head Singh",
    email: "head@municipal.gov",
    role: "department_head",
    departmentId: "dept-1",
    avatar: undefined,
  },
  staff: {
    id: "3",
    name: "Staff Kumar",
    email: "staff@municipal.gov",
    role: "staff",
    departmentId: "dept-1",
    avatar: undefined,
  },
  auditor: {
    id: "4",
    name: "Auditor Sharma",
    email: "auditor@municipal.gov",
    role: "auditor",
    avatar: undefined,
  },
  public: {
    id: "5",
    name: "Citizen Rao",
    email: "citizen@email.com",
    role: "public",
    avatar: undefined,
  },
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUserState] = React.useState<User | null>(null);
  const [hasHydrated, setHasHydrated] = React.useState(false);

  React.useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUserState(stored);
    setHasHydrated(true);
  }, []);

  const setUser = React.useCallback((newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          departmentId: newUser.departmentId,
          avatar: newUser.avatar,
        })
      );
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const login = React.useCallback(async (credentials: LoginCredentials): Promise<{ error?: string }> => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: credentials.email.trim(),
          password: credentials.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        return { error: data.error ?? "Login failed" };
      }
      if (data.user) {
        setUser({
          id: data.user.id,
          name: data.user.name,
          email: data.user.email,
          role: data.user.role,
          departmentId: data.user.departmentId,
          avatar: data.user.avatar,
        });
        return {};
      }
      return { error: "Invalid response" };
    } catch {
      return { error: "Network error" };
    }
  }, [setUser]);

  const logout = React.useCallback(() => {
    setUser(null);
  }, [setUser]);

  const value: AuthContextValue = {
    user,
    role: user?.role ?? "public",
    setUser,
    login,
    logout,
    isLoading: !hasHydrated,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}

export { DEMO_USERS };
