// src/api/situation.api.ts
import api from "./api";
import type { SituationSPA } from "../app/types/backend";

/**
 * Payload pour créer ou mettre à jour une situation
 * Le backend utilise un upsert basé sur (id_militaire, date_situation)
 */
export interface CreateOrUpdateSituationPayload {
  idMilitaire: number;
  date_situation: string; // Format YYYY-MM-DD
  motifId?: number; // Optionnel si présent
  commentaire?: string;
  est_previsionnel?: boolean;
}

export const situationsSpaApi = {
  /**
   * Créer ou mettre à jour une situation SPA (CHARGE_SPA uniquement)
   * Utilise un upsert basé sur (id_militaire, date_situation)
   * Nécessite que l'unité ne soit pas verrouillée
   */
  createOrUpdate: async (
    payload: CreateOrUpdateSituationPayload
  ): Promise<SituationSPA> => {
    const response = await api.post("/situations", payload);
    return response.data.data;
  },

  /**
   * Récupère toutes les situations d'une unité pour une date donnée (CHARGE_SPA uniquement)
   * Filtre automatiquement par l'unité du user connecté
   */
  getByDate: async (date: string): Promise<SituationSPA[]> => {
    const response = await api.get("/situations", {
      params: { date }
    });
    return response.data.data;
  },
};