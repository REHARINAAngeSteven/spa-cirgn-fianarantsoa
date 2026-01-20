// frontend/src/types/backend.ts


// ===========================
// ENUMS
// =========================== 

export type Role = 'ADMIN' | 'CHARGE_SPA' | 'MILITAIRE';
export type TypeMotif = 'absent' | 'indisponible';
export type StatutPassation = 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE';


// ===========================
//  MILITAIRE
// =========================== 

export interface Militaire {
  id_militaire: number;
  im: string;
  nom: string;
  prenom: string;
  cin: string;
  id_unite: number;
  id_fonction: number;
  est_actif: boolean;
  // relations facultatives
  unite?: Unite;
  fonction?: Fonction;
  compte?: Compte;
}

// ===========================
// COMPTE
// ===========================

export interface Compte {
  id_compte: number;
  id_militaire: number;
  login: string;
  role: Role;
  est_valide_par_admin: boolean;
  // relation optionnelle
  militaire?: Militaire;
}


// ==========================
// Référentiels
// ==========================

export interface MotifAbsence {
  id_motif: number;
  libelle: string;
  type_motif: TypeMotif;
}
export interface Unite {
  id_unite: number;
  nom_unite: string;
  saisie_autorisee: boolean;
}

export interface Fonction {
  id_fonction: number;
  nom_fonction: string;
}


// ==========================
// Passation et Situation SPA
// ==========================

export interface Passation {
  id_passation: number;
  id_unite: number;
  id_sortant: number;
  id_entrant: number;
  notes_consignes?: string;
  nouveau_mdp_attente?: string;
  statut: StatutPassation;
  date_creation: string; // ISO string
  id_admin_validateur?: number;
  date_validation?: string; // ISO string
  // relations optionnelles
  unite?: Unite;
  sortant?: Compte;
  entrant?: Compte;
  adminValidateur?: Compte;
}

export interface SituationSPA {
  id_spa: number;
  id_militaire: number;
  date_situation: string; // YYYY-MM-DD
  est_present: boolean;
  id_motif?: number;
  commentaire?: string;
  est_previsionnel: boolean;
  enregistre_par: number;
  date_enregistrement: string; // ISO string
  // relations optionnelles
  militaire?: Militaire;
  motif?: MotifAbsence;
  enregistreParCompte?: Compte;
}
