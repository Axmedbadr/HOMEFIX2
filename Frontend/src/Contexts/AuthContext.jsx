import { createContext, useContext, useState, useEffect } from 'react';
import { checkAuthStatus, login, logout } from '../lib/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus()
      .then(response => {
        if (response.success) {
          setUser(response.user);
          setIsAuthenticated(true);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await login(email, password);
      if (response.success) {
        setUser(response.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        return { success: false, message: response.message };
      }
    } catch (error) {
      return { success: false, message: 'Network error occurred' };
    }
  };

  const signOut = async () => {
    try {
      await logout();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      loading,
      signIn,
      signOut
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};