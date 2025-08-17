import React, { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../api';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string, role: 'teacher' | 'student') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const u = localStorage.getItem('exam-app-user');
    return u ? (JSON.parse(u) as User) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('exam-app-user', JSON.stringify(user));
    else localStorage.removeItem('exam-app-user');
  }, [user]);

  const login = async (username: string, password: string) => {
    const loggedInUser = await api.login(username, password);
    setUser(loggedInUser);
  };

  const register = async (username: string, password: string, role: 'teacher' | 'student') => {
    const registeredUser = await api.register(username, password, role);
    setUser(registeredUser);
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};