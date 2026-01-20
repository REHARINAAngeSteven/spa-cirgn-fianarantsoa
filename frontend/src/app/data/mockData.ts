import type { 
  User, Unite, Grade, Motif, Personnel, Passation, 
  PasswordResetRequest, HistoriqueValidation 
} from '../types';

// Grades militaires
export const grades: Grade[] = [
  { id: '1', nom: 'Soldat', abreviation: 'SDT', ordre: 1 },
  { id: '2', nom: 'Caporal', abreviation: 'CPL', ordre: 2 },
  { id: '3', nom: 'Caporal-Chef', abreviation: 'CCH', ordre: 3 },
  { id: '4', nom: 'Sergent', abreviation: 'SGT', ordre: 4 },
  { id: '5', nom: 'Sergent-Chef', abreviation: 'SCH', ordre: 5 },
  { id: '6', nom: 'Adjudant', abreviation: 'ADJ', ordre: 6 },
  { id: '7', nom: 'Adjudant-Chef', abreviation: 'ADC', ordre: 7 },
  { id: '8', nom: 'Major', abreviation: 'MAJ', ordre: 8 },
  { id: '9', nom: 'Sous-Lieutenant', abreviation: 'SLT', ordre: 9 },
  { id: '10', nom: 'Lieutenant', abreviation: 'LTN', ordre: 10 },
  { id: '11', nom: 'Capitaine', abreviation: 'CNE', ordre: 11 },
];

// Motifs d'absence
export const motifs: Motif[] = [
  { id: '1', code: 'PERM', libelle: 'Permission', categorie: 'permission' },
  { id: '2', code: 'MISS', libelle: 'Mission', categorie: 'mission' },
  { id: '3', code: 'FORM', libelle: 'Formation', categorie: 'mission' },
  { id: '4', code: 'MALD', libelle: 'Maladie', categorie: 'absence' },
  { id: '5', code: 'HOSP', libelle: 'Hospitalisation', categorie: 'absence' },
  { id: '6', code: 'CONG', libelle: 'Congé', categorie: 'permission' },
  { id: '7', code: 'FORM_EXT', libelle: 'Formation Externe', categorie: 'mission' },
];

// Unités
export const unites: Unite[] = [
  { id: '1', nom: '1ère Compagnie', code: '1CIE', validationStatus: 'validated', passationEnAttente: false },
  { id: '2', nom: '2ème Compagnie', code: '2CIE', validationStatus: 'pending', passationEnAttente: true },
  { id: '3', nom: '3ème Compagnie', code: '3CIE', validationStatus: 'validated', passationEnAttente: false },
  { id: '4', nom: 'Compagnie de Commandement', code: 'CCL', validationStatus: 'blocked', passationEnAttente: false },
  { id: '5', nom: 'Section d\'Éclairage et d\'Appui', code: 'SEA', validationStatus: 'validated', passationEnAttente: false },
];

// Utilisateurs
export const users: User[] = [
  // Admins
  {
    id: 'admin-1',
    matricule: 'ADM001',
    password: 'admin123', // En production, ce serait hashé
    nom: 'Durand',
    prenom: 'Pierre',
    grade: 'Capitaine',
    role: 'admin',
  },
  // Chargés SPA
  {
    id: 'user-1',
    matricule: 'SPA001',
    password: 'spa123',
    nom: 'Martin',
    prenom: 'Jean',
    grade: 'Sergent-Chef',
    role: 'charge_spa',
    uniteId: '1',
  },
  {
    id: 'user-2',
    matricule: 'SPA002',
    password: 'spa123',
    nom: 'Bernard',
    prenom: 'Marie',
    grade: 'Sergent',
    role: 'charge_spa',
    uniteId: '2',
  },
  {
    id: 'user-3',
    matricule: 'SPA003',
    password: 'spa123',
    nom: 'Dubois',
    prenom: 'Luc',
    grade: 'Adjudant',
    role: 'charge_spa',
    uniteId: '3',
  },
  {
    id: 'user-4',
    matricule: 'SPA004',
    password: 'spa123',
    nom: 'Petit',
    prenom: 'Sophie',
    grade: 'Sergent-Chef',
    role: 'charge_spa',
    uniteId: '4',
  },
];

// Personnel
export const personnel: Personnel[] = [
  // 1ère Compagnie
  { id: 'p1', matricule: 'M001', nom: 'Lefebvre', prenom: 'Antoine', gradeId: '2', uniteId: '1', situation: 'present' },
  { id: 'p2', matricule: 'M002', nom: 'Moreau', prenom: 'Claire', gradeId: '3', uniteId: '1', situation: 'absent', motifId: '1', dateDebut: '2026-01-05', dateFin: '2026-01-10' },
  { id: 'p3', matricule: 'M003', nom: 'Simon', prenom: 'Thomas', gradeId: '1', uniteId: '1', situation: 'present' },
  { id: 'p4', matricule: 'M004', nom: 'Laurent', prenom: 'Emma', gradeId: '4', uniteId: '1', situation: 'present' },
  { id: 'p5', matricule: 'M005', nom: 'Michel', prenom: 'Lucas', gradeId: '1', uniteId: '1', situation: 'absent', motifId: '2', dateDebut: '2026-01-08', dateFin: '2026-01-12' },
  
  // 2ème Compagnie
  { id: 'p6', matricule: 'M006', nom: 'Garcia', prenom: 'Hugo', gradeId: '3', uniteId: '2', situation: 'present' },
  { id: 'p7', matricule: 'M007', nom: 'David', prenom: 'Léa', gradeId: '2', uniteId: '2', situation: 'present' },
  { id: 'p8', matricule: 'M008', nom: 'Bertrand', prenom: 'Nathan', gradeId: '1', uniteId: '2', situation: 'absent', motifId: '4', dateDebut: '2026-01-09', dateFin: '2026-01-11' },
  { id: 'p9', matricule: 'M009', nom: 'Roux', prenom: 'Camille', gradeId: '5', uniteId: '2', situation: 'present' },
  
  // 3ème Compagnie
  { id: 'p10', matricule: 'M010', nom: 'Vincent', prenom: 'Maxime', gradeId: '4', uniteId: '3', situation: 'present' },
  { id: 'p11', matricule: 'M011', nom: 'Fournier', prenom: 'Sarah', gradeId: '2', uniteId: '3', situation: 'present' },
  { id: 'p12', matricule: 'M012', nom: 'Girard', prenom: 'Alexandre', gradeId: '1', uniteId: '3', situation: 'present' },
  
  // CCL
  { id: 'p13', matricule: 'M013', nom: 'Bonnet', prenom: 'Julie', gradeId: '6', uniteId: '4', situation: 'present' },
  { id: 'p14', matricule: 'M014', nom: 'Dupont', prenom: 'Adrien', gradeId: '3', uniteId: '4', situation: 'absent', motifId: '3', dateDebut: '2026-01-07', dateFin: '2026-01-14' },
  
  // SEA
  { id: 'p15', matricule: 'M015', nom: 'Lambert', prenom: 'Chloé', gradeId: '5', uniteId: '5', situation: 'present' },
  { id: 'p16', matricule: 'M016', nom: 'Fontaine', prenom: 'Louis', gradeId: '2', uniteId: '5', situation: 'present' },
];

// Passations
export const passations: Passation[] = [
  {
    id: 'pass-1',
    uniteId: '2',
    ancienTitulaireId: 'user-2',
    nouveauTitulaireId: 'p6', // Garcia Hugo sera le nouveau chargé SPA
    datePassation: '2026-01-08',
    notesOperationnelles: 'Effectif complet. Mission de sécurisation en cours jusqu\'au 15/01. Section Alpha en disponibilité opérationnelle.',
    notesSecutite: 'Consignes particulières pour l\'accès au dépôt de munitions. Code d\'accès à renouveler le 20/01.',
    nouveauMatricule: 'SPA002B',
    nouveauMotDePasse: 'hashed_password_123',
    status: 'pending',
  },
  {
    id: 'pass-2',
    uniteId: '1',
    ancienTitulaireId: 'p1',
    nouveauTitulaireId: 'user-1',
    datePassation: '2026-01-01',
    notesOperationnelles: 'Passation régulière. Aucun problème signalé.',
    notesSecutite: 'RAS',
    status: 'validated',
    validePar: 'admin-1',
    dateValidation: '2026-01-02',
  },
];

// Demandes de réinitialisation de mot de passe
export const passwordResetRequests: PasswordResetRequest[] = [
  {
    id: 'reset-1',
    userId: 'user-3',
    nouveauMotDePasse: 'hashed_new_password',
    dateCreation: '2026-01-09',
    status: 'pending',
  },
];

// Historique des validations
export const historiqueValidations: HistoriqueValidation[] = [
  {
    id: 'hist-1',
    type: 'passation',
    entityId: 'pass-2',
    adminId: 'admin-1',
    action: 'validated',
    date: '2026-01-02T10:30:00',
    commentaire: 'Passation validée - Documentation complète',
  },
  {
    id: 'hist-2',
    type: 'creation_compte',
    entityId: 'user-1',
    adminId: 'admin-1',
    action: 'validated',
    date: '2026-01-02T10:35:00',
    commentaire: 'Compte activé pour Martin Jean',
  },
];
