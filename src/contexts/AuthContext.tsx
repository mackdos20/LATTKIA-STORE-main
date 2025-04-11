import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/lib/db/models';
import { getToken, getUserFromToken, removeToken, setToken } from '@/utils/auth';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = getToken();
    if (token) {
      const userData = getUserFromToken(token);
      setUser(userData);
    }
  }, []);

  const login = (token: string) => {
    setToken(token);
    const userData = getUserFromToken(token);
    setUser(userData);
  };

  const logout = () => {
    removeToken();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'ADMIN',
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 