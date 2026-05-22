import React, { useState } from 'react';
import type { ReactNode } from 'react';
import { AuthContext } from './AuthContextValue';
import type { AuthContextType } from './AuthContextValue';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));
  const [email, setEmail] = useState<string | null>(() => localStorage.getItem('email'));

  const login = async (email: string, password: string, rememberMe = false) => {
    const response = await fetch('http://localhost:9090/pet/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    const data = await response.json();
    setToken(data.token);
    setEmail(data.email);
    localStorage.setItem('token', data.token);
    localStorage.setItem('email', data.email);
    if (rememberMe) {
      localStorage.setItem('savedEmail', email);
    } else {
      localStorage.removeItem('savedEmail');
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    const response = await fetch('http://localhost:9090/pet/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, fullName }),
    });

    if (!response.ok) {
      throw new Error('Registration failed');
    }

    // After registration, automatically log in
    await login(email, password);
  };

  const logout = () => {
    setToken(null);
    setEmail(null);
    localStorage.removeItem('token');
    localStorage.removeItem('email');
  };

  const value: AuthContextType = {
    token,
    email,
    isAuthenticated: !!token,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};