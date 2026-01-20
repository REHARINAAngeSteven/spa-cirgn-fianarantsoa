// Types de base fait par figma pour les donnée mock et l'interface utilisateur
export type UserRole = 'CHARGE_SPA' | 'ADMIN';

export type ValidationStatus = 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE';

export interface User {
  id: string;
  matricule: string;
  password: string;
  nom: string;
  prenom: string;
  grade: string;
  role: UserRole;
  uniteId?: string; // Pour les Chargés SPA
}

export interface Unite {
  id: string;
  nom: string;
  code: string;
  validationStatus: ValidationStatus;
  passationEnAttente: boolean;
}

export interface Grade {
  id: string;
  nom: string;
  abreviation: string;
  ordre: number;
}

export interface Motif {
  id: string;
  code: string;
  libelle: string;
  categorie: 'absence' | 'permission' | 'mission' | 'autre';
}

export interface Personnel {
  id: string;
  matricule: string;
  nom: string;
  prenom: string;
  gradeId: string;
  uniteId: string;
  situation: 'present' | 'absent';
  motifId?: string;
  dateDebut?: string;
  dateFin?: string;
  remarque?: string;
}

export interface Passation {
  id: string;
  uniteId: string;
  ancienTitulaireId: string;
  nouveauTitulaireId: string;
  datePassation: string;
  notesOperationnelles: string;
  notesSecutite: string;
  nouveauMatricule?: string; // Pour le futur désigné
  nouveauMotDePasse?: string; // Hash du nouveau mot de passe
  status: ValidationStatus;
  validePar?: string; // ID de l'admin qui a validé
  dateValidation?: string;
}

export interface PasswordResetRequest {
  id: string;
  userId: string;
  nouveauMotDePasse: string; // Hash
  dateCreation: string;
  status: ValidationStatus;
  validePar?: string;
  dateValidation?: string;
}

export interface HistoriqueValidation {
  id: string;
  type: 'passation' | 'password_reset' | 'creation_compte';
  entityId: string; // ID de la passation, reset request, etc.
  adminId: string;
  action: 'validated' | 'rejected';
  date: string;
  commentaire?: string;
}
