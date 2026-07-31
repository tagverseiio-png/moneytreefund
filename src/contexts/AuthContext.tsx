import { createContext, useContext, useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

export interface User {
  uid: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  role: string | null;
  loading: boolean;
  checkAuth: () => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await api.get('/auth/me');
      if (response.data.success) {
        const { uid, email, role } = response.data.data;
        setUser({ uid, email });
        setRole(role || 'Client');
      } else {
        setUser(null);
        setRole(null);
      }
    } catch (error) {
      console.error("Error verifying authentication:", error);
      setUser(null);
      setRole(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const signOut = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      console.error("Error logging out", err);
    } finally {
      setUser(null);
      setRole(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, loading, checkAuth, signOut }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
