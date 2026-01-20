// src/api/auth.api.ts
import api from "./api";

export interface LoginPayload {
  login: string;
  motDePasse: string;
}

export interface CompteInfo {
  id: number;
  login: string;
  role: "ADMIN" | "CHARGE_SPA" | "MILITAIRE";
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  compte: CompteInfo;
}

export interface RefreshTokenPayload {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
  refreshToken: string;
}

export interface MeResponse {
  id_compte: number;
  id_militaire: number;
  login: string;
  role: "ADMIN" | "CHARGE_SPA" | "MILITAIRE";
  est_valide_par_admin: boolean;
  unite_id?: number; // ID de l'unité du militaire
}

export const authApi = {
  /**
   * Authentification d'un utilisateur
   * Retourne les tokens et les infos du compte
   */
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post("/auth/login", payload);
    return response.data;
  },

  /**
   * Récupère les informations de l'utilisateur connecté
   * Nécessite un token valide
   */
  me: async (): Promise<MeResponse> => {
    const response = await api.get("/auth/me");
    return response.data;
  },

  /**
   * Rafraîchit le token d'accès avec un refresh token
   * Route publique (ne nécessite pas d'auth)
   */
  refreshToken: async (refreshToken: string): Promise<RefreshTokenResponse> => {
    const response = await api.post("/auth/refresh", { refreshToken });
    return response.data;
  },

  /**
   * Déconnexion locale (supprime les tokens du localStorage)
   */
  logout: () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("currentUser");
  },
};