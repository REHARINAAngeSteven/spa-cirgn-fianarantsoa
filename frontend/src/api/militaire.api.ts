// src/api/militaire.api.ts
import api from "./api";
import type { Militaire } from "../app/types/backend";

export interface CreateMilitairePayload {
  im: string;
  nom: string;
  prenom: string;
  cin: string;
  id_unite: number;
  id_fonction: number;
  est_actif?: boolean;
}

export interface UpdateMilitairePayload {
  im?: string;
  nom?: string;
  prenom?: string;
  cin?: string;
  id_unite?: number;
  id_fonction?: number;
  est_actif?: boolean;
}

export const militairesApi = {
  /**
   * Récupère tous les militaires
   * - ADMIN : tous les militaires
   * - CHARGE_SPA : uniquement les militaires de son unité
   */
  getAll: async (): Promise<Militaire[]> => {
    const response = await api.get("/militaires");
    return response.data.data;
  },

  /**
   * Récupère un militaire par son ID
   * - ADMIN : accès complet
   * - CHARGE_SPA : uniquement si le militaire est dans son unité
   */
  getById: async (id: number): Promise<Militaire> => {
    const response = await api.get(`/militaires/${id}`);
    return response.data.data;
  },

  /**
   * Crée un nouveau militaire (ADMIN uniquement)
   */
  create: async (payload: CreateMilitairePayload): Promise<Militaire> => {
    const response = await api.post("/militaires", payload);
    return response.data.data;
  },

  /**
   * Met à jour un militaire (ADMIN uniquement)
   */
  update: async (
    id: number,
    payload: UpdateMilitairePayload
  ): Promise<Militaire> => {
    const response = await api.put(`/militaires/${id}`, payload);
    return response.data.data;
  },

  /**
   * Supprime un militaire (ADMIN uniquement)
   */
  delete: async (id: number): Promise<void> => {
    await api.delete(`/militaires/${id}`);
  },
};