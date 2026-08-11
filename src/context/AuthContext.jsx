import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  getProfile,
  getStoredToken,
  login as apiLogin,
  setStoredToken,
  setUnauthorizedHandler,
  signup as apiSignup,
} from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const logout = useCallback(() => {
    setStoredToken(null);
    setUser(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    const token = getStoredToken();
    if (!token) {
      setUser(null);
      return null;
    }

    try {
      const profile = await getProfile();
      setUser(profile);
      return profile;
    } catch {
      setStoredToken(null);
      setUser(null);
      return null;
    }
  }, []);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      setUser(null);
    });

    refreshProfile().finally(() => setIsLoading(false));
  }, [refreshProfile]);

  const login = useCallback(async (email, password) => {
    const data = await apiLogin(email, password);
    setStoredToken(data.access_token);
    setUser(data.user);
    return data;
  }, []);

  const signup = useCallback(async (username, email, password) => {
    const data = await apiSignup(username, email, password);
    setStoredToken(data.access_token);
    setUser(data.user);
    return data;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      signup,
      logout,
      refreshProfile,
    }),
    [user, isLoading, login, signup, logout, refreshProfile],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
