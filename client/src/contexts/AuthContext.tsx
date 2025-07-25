import { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  userId: string | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // For migration purposes, we'll use a default user ID
    // In a real app, this would come from authentication
    const defaultUserId = 'default-user-id';
    setUserId(defaultUserId);
    setIsAuthenticated(true);
  }, []);

  const login = async (username: string, password: string) => {
    // TODO: Implement actual authentication
    setUserId('default-user-id');
    setIsAuthenticated(true);
  };

  const logout = () => {
    setUserId(null);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ userId, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}