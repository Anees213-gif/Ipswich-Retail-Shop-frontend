// Admin authentication hook and context
import { createContext, useContext, useState, useEffect } from 'react';
import type { AdminUser } from '@/types';
import { api } from '@/lib/api';

interface AuthContextType {
  user: AdminUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing authentication
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const user = await api.getCurrentUser();
      if (user) {
        setUser({
          id: user.id.toString(),
          email: user.email,
          role: 'admin',
          isAuthenticated: true,
        });
      }
    } catch (error) {
      // User not authenticated
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await api.adminLogin(email, password);
      if (result.success) {
        // Check auth status to get user info
        await checkAuthStatus();
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    try {
      await api.adminLogout();
    } catch (error) {
      // Continue with logout even if API call fails
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      isAuthenticated: !!user?.isAuthenticated,
      isLoading,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    // Return a default context to prevent crashes during development
    return {
      user: null,
      login: async () => false,
      logout: () => {},
      isAuthenticated: false,
      isLoading: false,
    };
  }
  return context;
};