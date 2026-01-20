import React, { createContext, useContext, useState } from 'react';
import type {
  Unite, Grade, Motif, Personnel, Passation,
  PasswordResetRequest, HistoriqueValidation, ValidationStatus
} from '../types';
import * as initialData from '../data/mockData';

interface DataContextType {
  unites: Unite[];
  grades: Grade[];
  motifs: Motif[];
  personnel: Personnel[];
  passations: Passation[];
  passwordResetRequests: PasswordResetRequest[];
  historiqueValidations: HistoriqueValidation[];
  
  // Actions pour le personnel
  updatePersonnel: (id: string, updates: Partial<Personnel>) => void;
  addPersonnel: (person: Personnel) => void;
  deletePersonnel: (id: string) => void;
  
  // Actions pour les passations
  addPassation: (passation: Passation) => void;
  validatePassation: (id: string, adminId: string) => void;
  
  // Actions pour les réinitialisations de mot de passe
  addPasswordResetRequest: (request: PasswordResetRequest) => void;
  validatePasswordReset: (id: string, adminId: string) => void;
  
  // Actions pour les unités
  updateUniteStatus: (id: string, status: ValidationStatus) => void;
  
  // Actions pour les référentiels
  addMotif: (motif: Motif) => void;
  updateMotif: (id: string, updates: Partial<Motif>) => void;
  deleteMotif: (id: string) => void;
  
  addGrade: (grade: Grade) => void;
  updateGrade: (id: string, updates: Partial<Grade>) => void;
  deleteGrade: (id: string) => void;
  
  addUnite: (unite: Unite) => void;
  updateUnite: (id: string, updates: Partial<Unite>) => void;
  deleteUnite: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [unites, setUnites] = useState<Unite[]>(initialData.unites);
  const [grades, setGrades] = useState<Grade[]>(initialData.grades);
  const [motifs, setMotifs] = useState<Motif[]>(initialData.motifs);
  const [personnel, setPersonnel] = useState<Personnel[]>(initialData.personnel);
  const [passations, setPassations] = useState<Passation[]>(initialData.passations);
  const [passwordResetRequests, setPasswordResetRequests] = useState<PasswordResetRequest[]>(
    initialData.passwordResetRequests
  );
  const [historiqueValidations, setHistoriqueValidations] = useState<HistoriqueValidation[]>(
    initialData.historiqueValidations
  );

  // Personnel
  const updatePersonnel = (id: string, updates: Partial<Personnel>) => {
    setPersonnel((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updates } : p))
    );
  };

  const addPersonnel = (person: Personnel) => {
    setPersonnel((prev) => [...prev, person]);
  };

  const deletePersonnel = (id: string) => {
    setPersonnel((prev) => prev.filter((p) => p.id !== id));
  };

  // Passations
  const addPassation = (passation: Passation) => {
    setPassations((prev) => [...prev, passation]);
    // Mettre à jour le statut de l'unité
    setUnites((prev) =>
      prev.map((u) =>
        u.id === passation.uniteId
          ? { ...u, validationStatus: 'pending', passationEnAttente: true }
          : u
      )
    );
  };

  const validatePassation = (id: string, adminId: string) => {
    const passation = passations.find((p) => p.id === id);
    if (!passation) return;

    setPassations((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status: 'validated',
              validePar: adminId,
              dateValidation: new Date().toISOString(),
            }
          : p
      )
    );

    // Débloquer l'unité
    setUnites((prev) =>
      prev.map((u) =>
        u.id === passation.uniteId
          ? { ...u, validationStatus: 'validated', passationEnAttente: false }
          : u
      )
    );

    // Ajouter à l'historique
    const histEntry: HistoriqueValidation = {
      id: `hist-${Date.now()}`,
      type: 'passation',
      entityId: id,
      adminId,
      action: 'validated',
      date: new Date().toISOString(),
      commentaire: `Passation validée pour l'unité ${passation.uniteId}`,
    };
    setHistoriqueValidations((prev) => [...prev, histEntry]);
  };

  // Réinitialisations de mot de passe
  const addPasswordResetRequest = (request: PasswordResetRequest) => {
    setPasswordResetRequests((prev) => [...prev, request]);
  };

  const validatePasswordReset = (id: string, adminId: string) => {
    setPasswordResetRequests((prev) =>
      prev.map((r) =>
        r.id === id
          ? {
              ...r,
              status: 'validated',
              validePar: adminId,
              dateValidation: new Date().toISOString(),
            }
          : r
      )
    );

    const request = passwordResetRequests.find((r) => r.id === id);
    if (request) {
      const histEntry: HistoriqueValidation = {
        id: `hist-${Date.now()}`,
        type: 'password_reset',
        entityId: id,
        adminId,
        action: 'validated',
        date: new Date().toISOString(),
        commentaire: `Réinitialisation de mot de passe validée`,
      };
      setHistoriqueValidations((prev) => [...prev, histEntry]);
    }
  };

  // Unités
  const updateUniteStatus = (id: string, status: ValidationStatus) => {
    setUnites((prev) =>
      prev.map((u) => (u.id === id ? { ...u, validationStatus: status } : u))
    );
  };

  // Motifs
  const addMotif = (motif: Motif) => {
    setMotifs((prev) => [...prev, motif]);
  };

  const updateMotif = (id: string, updates: Partial<Motif>) => {
    setMotifs((prev) => prev.map((m) => (m.id === id ? { ...m, ...updates } : m)));
  };

  const deleteMotif = (id: string) => {
    setMotifs((prev) => prev.filter((m) => m.id !== id));
  };

  // Grades
  const addGrade = (grade: Grade) => {
    setGrades((prev) => [...prev, grade]);
  };

  const updateGrade = (id: string, updates: Partial<Grade>) => {
    setGrades((prev) => prev.map((g) => (g.id === id ? { ...g, ...updates } : g)));
  };

  const deleteGrade = (id: string) => {
    setGrades((prev) => prev.filter((g) => g.id !== id));
  };

  // Unités (CRUD)
  const addUnite = (unite: Unite) => {
    setUnites((prev) => [...prev, unite]);
  };

  const updateUnite = (id: string, updates: Partial<Unite>) => {
    setUnites((prev) => prev.map((u) => (u.id === id ? { ...u, ...updates } : u)));
  };

  const deleteUnite = (id: string) => {
    setUnites((prev) => prev.filter((u) => u.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        unites,
        grades,
        motifs,
        personnel,
        passations,
        passwordResetRequests,
        historiqueValidations,
        updatePersonnel,
        addPersonnel,
        deletePersonnel,
        addPassation,
        validatePassation,
        addPasswordResetRequest,
        validatePasswordReset,
        updateUniteStatus,
        addMotif,
        updateMotif,
        deleteMotif,
        addGrade,
        updateGrade,
        deleteGrade,
        addUnite,
        updateUnite,
        deleteUnite,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
