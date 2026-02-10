"use client";

import {
  createContext,
  useContext,
  type ReactNode,
} from "react";
import type { Role } from "@/lib/constants/app";

export interface AuthUser {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
}

export interface AuthOrg {
  id: string;
  name: string;
  slug: string;
  role: Role;
}

interface AuthContextValue {
  user: AuthUser | null;
  org: AuthOrg | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isDemo: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  org: null,
  isLoading: true,
  isAuthenticated: false,
  isDemo: false,
});

export function AuthProvider({
  children,
  user,
  org,
  isLoading = false,
  isDemo = false,
}: {
  children: ReactNode;
  user: AuthUser | null;
  org: AuthOrg | null;
  isLoading?: boolean;
  isDemo?: boolean;
}) {
  return (
    <AuthContext.Provider
      value={{
        user,
        org,
        isLoading,
        isAuthenticated: !!user,
        isDemo,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export function useRequireAuth() {
  const auth = useAuth();
  if (!auth.isAuthenticated && !auth.isLoading) {
    throw new Error("Authentication required");
  }
  return auth as AuthContextValue & { user: AuthUser; org: AuthOrg };
}
