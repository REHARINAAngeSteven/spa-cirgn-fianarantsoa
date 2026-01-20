import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../../api/auth.api';
import type { CompteInfo, MeResponse } from '../../api/auth.api';

interface AuthContextType {
  currentUser: MeResponse | null;
  login: (matricule: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  isAdmin?: boolean;
  isChargeSpa?: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<MeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        try {
          // Récupérer les infos complètes de l'utilisateur via /auth/me
          const user = await authApi.me();
          setCurrentUser(user);
        } catch (error) {
          // Token invalide ou expiré, nettoyer
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * 🔐 LOGIN VIA BACKEND
   */
  const login = async (matricule: string, motDePasse: string): Promise<boolean> => {
    try {
      const res = await authApi.login({
        login: matricule,
        motDePasse: motDePasse,
      });

      // Sauvegarder les tokens
      localStorage.setItem('accessToken', res.accessToken);
      localStorage.setItem('refreshToken', res.refreshToken);

      // Récupérer les infos complètes du compte via /auth/me
      const user = await authApi.me();
      setCurrentUser(user);

      return true;
    } catch (error) {
      console.error('Erreur de connexion:', error);
      return false;
    }
  };

  const logout = () => {
    authApi.logout(); // Supprime les tokens du localStorage
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        login,
        logout,
        isAuthenticated: !!currentUser,
        isLoading,
        isAdmin: currentUser?.role === 'ADMIN',
        isChargeSpa: currentUser?.role === 'CHARGE_SPA',
      }}
    >
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