"use client";

import * as React from "react";
import type { User, UserRole } from "@/types";

interface AuthContextValue {
  user: User | null;
  role: UserRole;
  setUser: (user: User | null) => void;
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
  const [user, setUserState] = React.useState<User | null>(() => DEMO_USERS.admin);
  const [isLoading] = React.useState(false);

  const setUser = React.useCallback((newUser: User | null) => {
    setUserState(newUser);
  }, []);

  const value: AuthContextValue = {
    user,
    role: user?.role ?? "public",
    setUser,
    isLoading,
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
