// src/api/compte.api.ts
import api from "./api";
import type { Compte } from "../app/types/backend";

export interface CreateComptePayload {
  id_militaire: number;
  login: string;
  motDePasse: string;
  role: "ADMIN" | "CHARGE_SPA" | "MILITAIRE";
}

export interface UpdateComptePayload {
  role?: "ADMIN" | "CHARGE_SPA" | "MILITAIRE";
  est_valide_par_admin?: boolean;
}

export interface ResetPasswordPayload {
  nouveauMotDePasse: string;
}

export const comptesApi = {
  /**
   * Récupère tous les comptes (ADMIN uniquement)
   */
  getAll: async (): Promise<Compte[]> => {
    const response = await api.get("/comptes");
    return response.data.data;
  },

  /**
   * Récupère un compte par son ID (ADMIN uniquement)
   */
  getById: async (id: number): Promise<Compte> => {
    const response = await api.get(`/comptes/${id}`);
    return response.data.data;
  },

  /**
   * Crée un nouveau compte (ADMIN uniquement)
   */
  create: async (payload: CreateComptePayload): Promise<Compte> => {
    const response = await api.post("/comptes", payload);
    return response.data.data;
  },

  /**
   * Met à jour un compte (ADMIN uniquement)
   */
  update: async (
    id: number,
    payload: UpdateComptePayload
  ): Promise<Compte> => {
    const response = await api.put(`/comptes/${id}`, payload);
    return response.data.data;
  },

  /**
   * Supprime un compte (ADMIN uniquement)
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/comptes/${id}`);
  },

  /**
   * Réinitialise le mot de passe d'un compte (ADMIN uniquement)
   */
  resetPassword: async (id: number, nouveauMotDePasse: string): Promise<void> => {
    await api.post(`/comptes/${id}/reset-password`, { nouveauMotDePasse });
  },
};