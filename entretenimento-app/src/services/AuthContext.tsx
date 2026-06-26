import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { api } from './api';
import * as authService from './auth';

interface User {
  id: number;
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: (idToken: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function getStorage() {
  try {
    return localStorage;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storage = getStorage();

    if (storage) {
      const storedToken = storage.getItem('@watchandsave:token');
      const storedUser = storage.getItem('@watchandsave:user');

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
      }
    }

    setLoading(false);
  }, []);

  function persist(token: string, user: User) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    const storage = getStorage();
    if (storage) {
      storage.setItem('@watchandsave:token', token);
      storage.setItem('@watchandsave:user', JSON.stringify(user));
    }
  }

  function clearStorage() {
    delete api.defaults.headers.common['Authorization'];

    const storage = getStorage();
    if (storage) {
      storage.removeItem('@watchandsave:token');
      storage.removeItem('@watchandsave:user');
    }
  }

  async function login(email: string, password: string) {
    const response = await authService.login(email, password);
    setUser(response.user);
    setToken(response.token);
    persist(response.token, response.user);
  }

  async function register(name: string, email: string, password: string) {
    const response = await authService.register(name, email, password);
    setUser(response.user);
    setToken(response.token);
    persist(response.token, response.user);
  }

  async function loginWithGoogle(idToken: string) {
    const response = await authService.loginWithGoogle(idToken);
    setUser(response.user);
    setToken(response.token);
    persist(response.token, response.user);
  }

  function logout() {
    setUser(null);
    setToken(null);
    clearStorage();
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, loginWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
