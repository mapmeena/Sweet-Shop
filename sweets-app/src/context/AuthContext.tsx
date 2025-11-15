import { createContext, useContext, useState, type ReactNode } from 'react'
import axios from 'axios';
import api from '../api';

export interface User {
  id: string
  username: string
  email: string
  role: 'user' | 'admin'
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Login using backend API
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // POST to backend login endpoint
      const res = await api.post('/api/auth/login', { email, password });
      const { token, user } = res.data;
      const userData: User = {
        id: user.id,
        username: user.name,
        email: user.email,
        role: user.is_admin ? 'admin' : 'user',
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || 'Login failed');
      } else {
        alert('Login failed');
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Register using backend API
  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      // POST to backend register endpoint
      const res = await api.post('/api/auth/register', { name: username, email, password });
      const { token, user } = res.data;
      const userData: User = {
        id: user.id,
        username: user.name,
        email: user.email,
        role: user.is_admin ? 'admin' : 'user',
      };
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.error || 'Registration failed');
      } else {
        alert('Registration failed');
      }
    } finally {
      setIsLoading(false);
    }
  }

  // Logout clears user and token
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }

  // Initialize user from localStorage
  useState(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  })

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
