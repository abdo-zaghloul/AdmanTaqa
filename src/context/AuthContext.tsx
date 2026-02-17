import React, { createContext, useContext, useState, useEffect } from "react";
import type { User, Organization, AuthData } from "../types/auth";

interface AuthContextType {
  user: User | null;
  organization: Organization | null;
  accessToken: string | null;
  login: (data: AuthData) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      setAccessToken(token);
    }
    setIsLoading(false);
  }, []);

  const login = (data: AuthData) => {
    setUser(data.user);
    setOrganization(data.organization);
    setAccessToken(data.accessToken);
    localStorage.setItem("access_token", data.accessToken);
  };

  const logout = () => {
    setUser(null);
    setOrganization(null);
    setAccessToken(null);
    localStorage.removeItem("access_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        organization,
        accessToken,
        login,
        logout,
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
