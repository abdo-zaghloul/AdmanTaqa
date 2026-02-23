import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, Organization, AuthData, AuthRole } from "../types/auth";
import { buildPermissionHelpers } from "@/lib/permissions";
import { authService } from "@/api/services/authService";

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  roles: AuthRole[];
  permissions: string[];
  accessToken: string | null;
  login: (data: AuthData) => void;
  logout: () => void;
  hasPermission: (code: string) => boolean;
  hasAnyPermission: (codes: string[]) => boolean;
  hasAllPermissions: (codes: string[]) => boolean;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [roles, setRoles] = useState<AuthRole[]>([]);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setIsLoading(false);
      return;
    }

    setAccessToken(token);
    void (async () => {
      try {
        const me = await authService.me();
        if (me.success && me.data) {
          setUser(me.data.user);
          setOrganization(me.data.organization);
          setRoles(me.data.roles ?? []);
          setPermissions(me.data.permissions ?? []);
        }
      } catch {
        // If token is stale, keep fallback auth state based on token only.
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  const login = (data: AuthData) => {
    setUser(data.user);
    setOrganization(data.organization);
    setRoles(data.roles ?? []);
    setPermissions(data.permissions ?? []);
    setAccessToken(data.accessToken);
    localStorage.setItem("access_token", data.accessToken);
    if (data.refreshToken) {
      localStorage.setItem("refresh_token", data.refreshToken);
    }
  };

  const logout = () => {
    setUser(null);
    setOrganization(null);
    setRoles([]);
    setPermissions([]);
    setAccessToken(null);
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  };

  const { hasPermission, hasAnyPermission, hasAllPermissions } =
    buildPermissionHelpers({ permissions });

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        roles,
        permissions,
        accessToken,
        login,
        logout,
        hasPermission,
        hasAnyPermission,
        hasAllPermissions,
        isAuthenticated: !!accessToken,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
