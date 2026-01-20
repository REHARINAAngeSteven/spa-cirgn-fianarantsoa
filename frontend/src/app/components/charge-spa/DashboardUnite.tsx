// frontend/src/app/components/charge-spa/DashboardUnite.tsx
import { useAuth } from '../../context/AuthContext';
import { useDashboardUnite } from '../../../hooks/useDashboardUnite';
import { AlertCircle, Users, UserCheck, UserX, Shield, TrendingUp, Calendar, Loader2, UserCog, ClipboardList, Target } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';
import { useMemo } from 'react';

export function DashboardUnite() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const { militaires, unites, fonctions, motifs, isLoading, error } = useDashboardUnite();

  // Récupérer l'ID de l'unité directement depuis currentUser
  const userUniteId = currentUser?.unite_id;

  const currentUnite = unites.find((u) => u.id_unite === userUniteId);
  
  // Filtrer les militaires de l'unité de l'utilisateur
  const unitePersonnel = militaires.filter((m) => m.id_unite === userUniteId);
  
  // Fonction pour déterminer le type de motif
  const getMotifType = (militaire: typeof militaires[0]) => {
    if (!militaire.situationActuelle?.id_motif) return null;
    const motif = motifs.find(m => m.id_motif === militaire.situationActuelle?.id_motif);
    return motif?.type_motif || null;
  };

  // Calculer les différentes catégories
  const nonPointes = unitePersonnel.filter((m) => !m.situationActuelle).length;
  const presents = unitePersonnel.filter((m) => 
    m.situationActuelle && m.situationActuelle.est_present && getMotifType(m) !== 'indisponible'
  ).length;
  const absents = unitePersonnel.filter((m) => 
    m.situationActuelle && !m.situationActuelle.est_present
  ).length;
  const indisponibles = unitePersonnel.filter((m) => 
    m.situationActuelle && getMotifType(m) === 'indisponible'
  ).length;
  const surLeRang = presents; // Présents = ceux qui sont vraiment sur le rang (présents - indisponibles déjà exclus)
  const total = unitePersonnel.length;

  const isBlocked = currentUnite && !currentUnite.saisie_autorisee;

  // Données pour le graphique circulaire principal
  const pieData = useMemo(() => [
    { name: 'Sur le rang', value: surLeRang, color: '#22c55e' },
    { name: 'Indisponibles', value: indisponibles, color: '#f59e0b' },
    { name: 'Absents', value: absents, color: '#ef4444' },
    { name: 'Non pointés', value: nonPointes, color: '#94a3b8' },
  ], [surLeRang, indisponibles, absents, nonPointes]);

  // Statistiques par motif d'absence
  const motifAbsenceStats = useMemo(() => {
    const stats: Record<string, number> = {};
    unitePersonnel
      .filter((m) => m.situationActuelle && !m.situationActuelle.est_present && m.situationActuelle.id_motif)
      .forEach((m) => {
        const motif = motifs.find((mo) => mo.id_motif === m.situationActuelle?.id_motif);
        if (motif) {
          stats[motif.libelle] = (stats[motif.libelle] || 0) + 1;
        }
      });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [unitePersonnel, motifs]);

  // Statistiques par motif d'indisponibilité
  const motifIndispoStats = useMemo(() => {
    const stats: Record<string, number> = {};
    unitePersonnel
      .filter((m) => getMotifType(m) === 'indisponible')
      .forEach((m) => {
        const motif = motifs.find((mo) => mo.id_motif === m.situationActuelle?.id_motif);
        if (motif) {
          stats[motif.libelle] = (stats[motif.libelle] || 0) + 1;
        }
      });
    return Object.entries(stats).map(([name, value]) => ({ name, value }));
  }, [unitePersonnel, motifs]);

  // Statistiques par fonction
  const fonctionStats = useMemo(() => {
    const stats: Record<string, { surLeRang: number; indisponibles: number; absents: number; nonPointes: number }> = {};
    unitePersonnel.forEach((m) => {
      const fonction = fonctions.find((f) => f.id_fonction === m.id_fonction);
      if (fonction) {
        if (!stats[fonction.nom_fonction]) {
          stats[fonction.nom_fonction] = { surLeRang: 0, indisponibles: 0, absents: 0, nonPointes: 0 };
        }
        
        if (!m.situationActuelle) {
          stats[fonction.nom_fonction].nonPointes++;
        } else if (!m.situationActuelle.est_present) {
          stats[fonction.nom_fonction].absents++;
        } else if (getMotifType(m) === 'indisponible') {
          stats[fonction.nom_fonction].indisponibles++;
        } else {
          stats[fonction.nom_fonction].surLeRang++;
        }
      }
    });
    return Object.entries(stats)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => (b.surLeRang + b.indisponibles + b.absents + b.nonPointes) - (a.surLeRang + a.indisponibles + a.absents + a.nonPointes));
  }, [unitePersonnel, fonctions]);

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded p-4 text-red-800">
        {error}
      </div>
    );
  }

  if (!currentUnite) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded p-4 text-yellow-800">
        Aucune unité trouvée pour cet utilisateur.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Dashboard Unité</h1>
        <p className="text-gray-600">
          {currentUnite.nom_unite}
        </p>
      </div>

      {/* Indicateur de verrouillage */}
      {isBlocked && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 rounded p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
          <div>
            <h3 className="text-red-800 font-medium mb-1">Unité verrouillée</h3>
            <p className="text-sm text-red-700">
              Votre unité est actuellement bloquée. La saisie SPA est désactivée.
            </p>
          </div>
        </div>
      )}

      {/* Statut de l'unité */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Statut de l'Unité</h2>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-600">Autorisation de saisie</p>
            <p className="text-gray-900 font-medium">
              {isBlocked ? 'Désactivée' : 'Active'}
            </p>
          </div>
        </div>
      </div>

      {/* Cartes d'effectifs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-600">Effectif Total</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{total}</p>
        </div>

        <div className="bg-white rounded-lg border-l-4 border-l-green-600 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-green-600" />
            <p className="text-xs text-gray-600">Sur le rang</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{surLeRang}</p>
          <p className="text-xs text-gray-500 mt-1">
            {total > 0 ? Math.round((surLeRang / total) * 100) : 0}%
          </p>
        </div>

        <div className="bg-white rounded-lg border-l-4 border-l-orange-500 p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserCog className="w-4 h-4 text-orange-600" />
            <p className="text-xs text-gray-600">Indisponibles</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{indisponibles}</p>
          <p className="text-xs text-gray-500 mt-1">
            {total > 0 ? Math.round((indisponibles / total) * 100) : 0}%
          </p>
        </div>

        <div className="bg-white rounded-lg border-l-4 border-l-red-500 p-4">
          <div className="flex items-center gap-2 mb-2">
            <UserX className="w-4 h-4 text-red-600" />
            <p className="text-xs text-gray-600">Absents</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{absents}</p>
          <p className="text-xs text-gray-500 mt-1">
            {total > 0 ? Math.round((absents / total) * 100) : 0}%
          </p>
        </div>

        <div className="bg-white rounded-lg border-l-4 border-l-gray-400 p-4">
          <div className="flex items-center gap-2 mb-2">
            <ClipboardList className="w-4 h-4 text-gray-600" />
            <p className="text-xs text-gray-600">Non pointés</p>
          </div>
          <p className="text-2xl font-bold text-gray-900">{nonPointes}</p>
          <p className="text-xs text-gray-500 mt-1">
            {total > 0 ? Math.round((nonPointes / total) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Graphique circulaire */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Répartition Générale</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Graphique par fonction */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Effectifs par Fonction</h2>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={fonctionStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="name" stroke="#6b7280" />
              <YAxis stroke="#6b7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px'
                }}
              />
              <Legend />
              <Bar dataKey="surLeRang" name="Sur le rang" fill="#22c55e" stackId="a" />
              <Bar dataKey="indisponibles" name="Indisponibles" fill="#f59e0b" stackId="a" />
              <Bar dataKey="absents" name="Absents" fill="#ef4444" stackId="a" />
              <Bar dataKey="nonPointes" name="Non pointés" fill="#94a3b8" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Statistiques par motif */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Motifs d'absence */}
        {motifAbsenceStats.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserX className="w-5 h-5 text-red-600" />
              <h2 className="text-lg font-semibold text-gray-900">Motifs d'Absence</h2>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={motifAbsenceStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" width={120} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="value" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Motifs d'indisponibilité */}
        {motifIndispoStats.length > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <div className="flex items-center gap-2 mb-4">
              <UserCog className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">Motifs d'Indisponibilité</h2>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={motifIndispoStats} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" stroke="#6b7280" />
                <YAxis dataKey="name" type="category" stroke="#6b7280" width={120} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#fff', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px'
                  }}
                />
                <Bar dataKey="value" fill="#f59e0b" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Tableaux des personnels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personnel absent */}
        {absents > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserX className="w-5 h-5 text-red-600" />
              Personnel Absent ({absents})
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {unitePersonnel
                .filter((m) => m.situationActuelle && !m.situationActuelle.est_present)
                .map((militaire) => {
                  const fonction = fonctions.find((f) => f.id_fonction === militaire.id_fonction);
                  const motif = motifs.find((mo) => mo.id_motif === militaire.situationActuelle?.id_motif);

                  return (
                    <div
                      key={militaire.id_militaire}
                      className="flex items-center justify-between p-3 bg-red-50 rounded border border-red-200"
                    >
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium text-sm">
                          {fonction?.nom_fonction} {militaire.nom} {militaire.prenom}
                        </p>
                        <p className="text-xs text-gray-600">{militaire.im}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{motif?.libelle || 'Non renseigné'}</p>
                        <p className="text-xs text-gray-600">
                          {militaire.situationActuelle?.date_situation}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}

        {/* Personnel indisponible */}
        {indisponibles > 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <UserCog className="w-5 h-5 text-orange-600" />
              Personnel Indisponible ({indisponibles})
            </h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {unitePersonnel
                .filter((m) => getMotifType(m) === 'indisponible')
                .map((militaire) => {
                  const fonction = fonctions.find((f) => f.id_fonction === militaire.id_fonction);
                  const motif = motifs.find((mo) => mo.id_motif === militaire.situationActuelle?.id_motif);

                  return (
                    <div
                      key={militaire.id_militaire}
                      className="flex items-center justify-between p-3 bg-orange-50 rounded border border-orange-200"
                    >
                      <div className="flex-1">
                        <p className="text-gray-900 font-medium text-sm">
                          {fonction?.nom_fonction} {militaire.nom} {militaire.prenom}
                        </p>
                        <p className="text-xs text-gray-600">{militaire.im}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-900">{motif?.libelle || 'Non renseigné'}</p>
                        <p className="text-xs text-gray-600">
                          {militaire.situationActuelle?.date_situation}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}