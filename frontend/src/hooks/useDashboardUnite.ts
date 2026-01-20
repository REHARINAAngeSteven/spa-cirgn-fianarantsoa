// frontend/src/hooks/useDashboardUnite.ts
import { useState, useEffect } from 'react';
import { militairesApi } from '../api/militaire.api';
import { referentielsApi } from '../api/referentiels.api';
import { situationsSpaApi } from '../api/situation.api';
import type { Militaire, Unite, Fonction, MotifAbsence, SituationSPA } from '../app/types/backend';

export interface MilitaireAvecSituation extends Militaire {
  situationActuelle?: SituationSPA;
}

export function useDashboardUnite() {
  const [militaires, setMilitaires] = useState<MilitaireAvecSituation[]>([]);
  const [unites, setUnites] = useState<Unite[]>([]);
  const [fonctions, setFonctions] = useState<Fonction[]>([]);
  const [motifs, setMotifs] = useState<MotifAbsence[]>([]);
  const [situations, setSituations] = useState<SituationSPA[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        // Récupérer les données en parallèle
        const [militairesData, unitesData, fonctionsData, motifsData] = await Promise.all([
          militairesApi.getAll(),
          referentielsApi.getAllUnites(),
          referentielsApi.getAllFonctions(),
          referentielsApi.getAllMotifs(),
        ]);

        // Récupérer les situations du jour
        const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
        const situationsData = await situationsSpaApi.getByDate(today);

        // Associer les situations aux militaires
        const militairesAvecSituations = militairesData.map(militaire => ({
          ...militaire,
          situationActuelle: situationsData.find(s => s.id_militaire === militaire.id_militaire)
        }));

        setMilitaires(militairesAvecSituations);
        setUnites(unitesData);
        setFonctions(fonctionsData);
        setMotifs(motifsData);
        setSituations(situationsData);
        setError(null);
      } catch (err) {
        console.error('Erreur chargement dashboard:', err);
        setError('Impossible de charger les données');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    militaires,
    unites,
    fonctions,
    motifs,
    situations,
    isLoading,
    error,
  };
}