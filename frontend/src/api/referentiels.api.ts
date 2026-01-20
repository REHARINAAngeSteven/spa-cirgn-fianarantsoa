// src/api/referentiels.api.ts
import api from "./api";
import type { Unite, Fonction, MotifAbsence } from "../app/types/backend";

export const referentielsApi = {
  // =====================
  // UNITES
  // =====================
  
  /**
   * Récupère toutes les unités
   */
  getAllUnites: async (): Promise<Unite[]> => {
    const response = await api.get("/referentiels/unites");
    return response.data;
  },

  /**
   * Récupère une unité par son ID
   */
  getUniteById: async (id: number): Promise<Unite> => {
    const response = await api.get(`/referentiels/unites/${id}`);
    return response.data;
  },

  /**
   * Crée une nouvelle unité (ADMIN uniquement)
   */
  createUnite: async (data: Omit<Unite, "id_unite">): Promise<Unite> => {
    const response = await api.post("/referentiels/unites", data);
    return response.data;
  },

  /**
   * Met à jour une unité (ADMIN uniquement)
   */
  updateUnite: async (id: number, data: Partial<Unite>): Promise<Unite> => {
    const response = await api.put(`/referentiels/unites/${id}`, data);
    return response.data;
  },

  /**
   * Supprime une unité (ADMIN uniquement)
   */
  deleteUnite: async (id: number): Promise<void> => {
    await api.delete(`/referentiels/unites/${id}`);
  },

  // =====================
  // FONCTIONS
  // =====================

  /**
   * Récupère toutes les fonctions
   */
  getAllFonctions: async (): Promise<Fonction[]> => {
    const response = await api.get("/referentiels/fonctions");
    return response.data;
  },

  /**
   * Récupère une fonction par son ID
   */
  getFonctionById: async (id: number): Promise<Fonction> => {
    const response = await api.get(`/referentiels/fonctions/${id}`);
    return response.data;
  },

  /**
   * Crée une nouvelle fonction (ADMIN uniquement)
   */
  createFonction: async (data: Omit<Fonction, "id_fonction">): Promise<Fonction> => {
    const response = await api.post("/referentiels/fonctions", data);
    return response.data;
  },

  /**
   * Met à jour une fonction (ADMIN uniquement)
   */
  updateFonction: async (id: number, data: Partial<Fonction>): Promise<Fonction> => {
    const response = await api.put(`/referentiels/fonctions/${id}`, data);
    return response.data;
  },

  /**
   * Supprime une fonction (ADMIN uniquement)
   */
  deleteFonction: async (id: number): Promise<void> => {
    await api.delete(`/referentiels/fonctions/${id}`);
  },

  // =====================
  // MOTIFS ABSENCE
  // =====================

  /**
   * Récupère tous les motifs d'absence
   */
  getAllMotifs: async (): Promise<MotifAbsence[]> => {
    const response = await api.get("/referentiels/motifs");
    return response.data;
  },

  /**
   * Récupère un motif par son ID (CHARGE_SPA ou ADMIN)
   */
  getMotifById: async (id: number): Promise<MotifAbsence> => {
    const response = await api.get(`/referentiels/motifs/${id}`);
    return response.data;
  },

  /**
   * Récupère les motifs par type (CHARGE_SPA ou ADMIN)
   */
  getMotifByType: async (type: string): Promise<MotifAbsence[]> => {
    const response = await api.get(`/referentiels/motifs/type/${type}`);
    return response.data;
  },

  /**
   * Crée un nouveau motif (ADMIN uniquement)
   */
  createMotif: async (data: Omit<MotifAbsence, "id_motif">): Promise<MotifAbsence> => {
    const response = await api.post("/referentiels/motifs", data);
    return response.data;
  },

  /**
   * Met à jour un motif (ADMIN uniquement)
   */
  updateMotif: async (id: number, data: Partial<MotifAbsence>): Promise<MotifAbsence> => {
    const response = await api.put(`/referentiels/motifs/${id}`, data);
    return response.data;
  },

  /**
   * Supprime un motif (ADMIN uniquement)
   */
  deleteMotif: async (id: number): Promise<void> => {
    await api.delete(`/referentiels/motifs/${id}`);
  },
};