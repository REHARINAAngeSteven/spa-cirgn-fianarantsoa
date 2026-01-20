// src/api/passation.api.ts

import api from "./api";
import type { Passation } from "../app/types/backend";

// Types pour les requêtes
export interface InitierPassationData {
  id_sortant: number;
  id_entrant: number;
  id_unite: number;
  notes_consignes?: string;
  nouveau_mdp: string;
}

export interface PassationResponse {
  success: boolean;
  data: Passation;
  message?: string;
}

export interface PassationsListResponse {
  success: boolean;
  data: Passation[];
}

export const passationApi = {
  /**
   * Initier une nouvelle passation (CHARGE_SPA uniquement)
   * Nécessite que l'unité ne soit pas verrouillée
   * Crée une passation EN_ATTENTE et verrouille l'unité
   */
  initier: async (data: InitierPassationData): Promise<Passation> => {
    const response = await api.post<PassationResponse>("/passations", data);
    return response.data.data;
  },

  /**
   * Valider une passation (ADMIN uniquement)
   * Active le nouveau mot de passe du compte entrant
   * Déverrouille l'unité
   */
  valider: async (id: number): Promise<Passation> => {
    const response = await api.put<PassationResponse>(`/passations/${id}/valider`);
    return response.data.data;
  },

  /**
   * Rejeter une passation (ADMIN uniquement)
   * Passe le statut à REJETEE
   * Déverrouille l'unité
   */
  rejeter: async (id: number): Promise<Passation> => {
    const response = await api.put<PassationResponse>(`/passations/${id}/rejeter`);
    return response.data.data;
  },

  /**
   * Récupère la liste de toutes les passations (ADMIN uniquement)
   * Triées par date de création décroissante
   */
  getAll: async (): Promise<Passation[]> => {
    const response = await api.get<PassationsListResponse>("/passations");
    return response.data.data;
  },
};