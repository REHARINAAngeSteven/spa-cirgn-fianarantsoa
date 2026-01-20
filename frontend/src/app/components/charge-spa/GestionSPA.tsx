// frontend/src/app/components/charge-spa/GestionSPA.tsx
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardUnite } from '../../../hooks/useDashboardUnite';
import type { MilitaireAvecSituation } from '../../../hooks/useDashboardUnite';
import { Edit2, X, Save, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { TableSearch } from '../TableSearch';
import type { FilterOption } from '../../hooks/useTableFilters';
import { ExportButton } from '../ExportButton';
import { Pagination } from '../Pagination';
import { useTableFilters } from '../../hooks/useTableFilters';
import { situationsSpaApi } from '../../../api/situation.api';
import type { TypeMotif } from '../../types/backend';

interface FormData {
  situation: 'present' | 'absent' | 'indisponible';
  motifId?: number;
  dateDebut?: string;
  remarque?: string;
}

export function GestionSPA() {
  const { currentUser } = useAuth();
  const { militaires, unites, fonctions, motifs, isLoading, error } = useDashboardUnite();

  const userUniteId = currentUser?.unite_id;
  const currentUnite = unites.find((u) => u.id_unite === userUniteId);
  const unitePersonnel = militaires.filter((m) => m.id_unite === userUniteId);

  const [editingPerson, setEditingPerson] = useState<MilitaireAvecSituation | null>(null);
  const [formData, setFormData] = useState<FormData>({
    situation: 'present',
  });
  const [isSaving, setIsSaving] = useState(false);

  const isBlocked = currentUnite && !currentUnite.saisie_autorisee;

  // Séparer les motifs par type
  const motifsAbsent = motifs.filter(m => m.type_motif === 'absent');
  const motifsIndisponible = motifs.filter(m => m.type_motif === 'indisponible');

  // Configuration des filtres
  const filterConfig: FilterOption[] = [
    {
      label: 'Situation',
      value: 'situation',
      options: [
        { label: 'Présent', value: 'present' },
        { label: 'Absent', value: 'absent' },
        { label: 'Indisponible', value: 'indisponible' },
      ],
    },
    {
      label: 'Fonction',
      value: 'fonction',
      options: fonctions.map((f) => ({ label: f.nom_fonction, value: String(f.id_fonction) })),
    },
  ];

  // Fonction pour déterminer la situation d'un militaire
  const getSituation = (militaire: MilitaireAvecSituation): 'present' | 'absent' | 'indisponible' => {
    if (!militaire.situationActuelle) return 'present';
    
    const motif = motifs.find(m => m.id_motif === militaire.situationActuelle?.id_motif);
    
    if (!motif) {
      return militaire.situationActuelle.est_present ? 'present' : 'absent';
    }
    
    if (motif.type_motif === 'absent') return 'absent';
    if (motif.type_motif === 'indisponible') return 'indisponible';
    
    return 'present';
  };

  // Hook de filtrage avec pagination
  const {
    searchQuery,
    setSearchQuery,
    filters,
    setFilter,
    currentPage,
    setCurrentPage,
    pageSize,
    setPageSize,
    paginatedData,
    totalPages,
    totalItems,
  } = useTableFilters({
    data: unitePersonnel,
    searchFields: ['im', 'nom', 'prenom'],
    filterConfig: {
      situation: (item, value) => getSituation(item) === value,
      fonction: (item, value) => Number(item.id_fonction) === Number(value),
    },
  });

  const handleEdit = (militaire: MilitaireAvecSituation) => {
    setEditingPerson(militaire);
    const situation = getSituation(militaire);
    
    setFormData({
      situation,
      motifId: militaire.situationActuelle?.id_motif,
      dateDebut: militaire.situationActuelle?.date_situation,
      remarque: militaire.situationActuelle?.commentaire,
    });
  };

  const handleSave = async () => {
    if (!editingPerson || isBlocked || !currentUser) return;

    // Validation : absent et indisponible nécessitent un motif
    if ((formData.situation === 'absent' || formData.situation === 'indisponible') && !formData.motifId) {
      toast.error('Veuillez sélectionner un motif');
      return;
    }

    try {
      setIsSaving(true);

      const today = new Date().toISOString().split('T')[0];

      await situationsSpaApi.createOrUpdate({
        idMilitaire: editingPerson.id_militaire,
        date_situation: formData.dateDebut || today,
        motifId: formData.situation !== 'present' ? formData.motifId : undefined,
        commentaire: formData.remarque,
        est_previsionnel: false,
      });

      toast.success('Situation mise à jour', {
        description: `${editingPerson.nom} ${editingPerson.prenom}`,
      });

      // Rafraîchir uniquement les données sans rechargement de page
      window.location.reload();

      setEditingPerson(null);
      setFormData({ situation: 'present' });
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingPerson(null);
    setFormData({ situation: 'present' });
  };

  // Fonction pour obtenir le label de situation
  const getSituationLabel = (situation: 'present' | 'absent' | 'indisponible') => {
    switch (situation) {
      case 'present': return 'Présent';
      case 'absent': return 'Absent';
      case 'indisponible': return 'Indisponible';
    }
  };

  // Données pour l'export
  const exportData = unitePersonnel.map((m) => {
    const fonction = fonctions.find((f) => f.id_fonction === m.id_fonction);
    const motif = motifs.find((mo) => mo.id_motif === m.situationActuelle?.id_motif);
    const situation = getSituation(m);

    return {
      IM: m.im,
      // Fonction: fonction?.nom_fonction || '',
      Nom: m.nom,
      Prénom: m.prenom,
      Situation: getSituationLabel(situation),
      Motif: motif?.libelle || '',
      Date: m.situationActuelle?.date_situation || '',
      Remarque: m.situationActuelle?.commentaire || '',
    };
  });

  if (isLoading) {
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion SPA</h1>
        <p className="text-gray-600">
          Modification de la situation du personnel - {currentUnite.nom_unite}
        </p>
      </div>

      {isBlocked && (
        <div className="mb-6 bg-red-50 border border-red-500 rounded p-4 text-red-800 text-sm">
          ⚠️ La saisie est désactivée car votre unité est verrouillée.
        </div>
      )}

      {/* Barre de recherche et filtres */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <TableSearch
            searchPlaceholder="Rechercher par IM, nom ou prénom..."
            searchValue={searchQuery}
            onSearchChange={setSearchQuery}
            filters={filterConfig}
            activeFilters={filters}
            onFilterChange={setFilter}
            resultCount={totalItems}
          />
        </div>
        <ExportButton
          data={exportData}
          filename={`gestion-spa-${currentUnite.nom_unite}`}
          headers={{
            IM: 'IM',
            // Fonction: 'Fonction',
            Nom: 'Nom',
            Prénom: 'Prénom',
            Situation: 'Situation',
            Motif: 'Motif',
            Date: 'Date',
            Remarque: 'Remarque',
          }}
        />
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-900">IM</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">Fonction</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">Nom</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">Prénom</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">Situation</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">Motif</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">Date</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((militaire) => {
              const fonction = fonctions.find((f) => f.id_fonction === militaire.id_fonction);
              const motif = motifs.find((m) => m.id_motif === militaire.situationActuelle?.id_motif);
              const isEditing = editingPerson?.id_militaire === militaire.id_militaire;
              const situation = getSituation(militaire);

              return (
                <tr key={militaire.id_militaire} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-900">{militaire.im}</td>
                  <td className="p-4 text-sm text-gray-900">{fonction?.nom_fonction}</td>
                  <td className="p-4 text-sm text-gray-900">{militaire.nom}</td>
                  <td className="p-4 text-sm text-gray-900">{militaire.prenom}</td>
                  <td className="p-4 text-sm">
                    {isEditing ? (
                      <select
                        value={formData.situation}
                        onChange={(e) =>
                          setFormData({ 
                            ...formData, 
                            situation: e.target.value as 'present' | 'absent' | 'indisponible',
                            motifId: e.target.value === 'present' ? undefined : formData.motifId
                          })
                        }
                        className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-900 text-sm"
                      >
                        <option value="present">Présent</option>
                        <option value="absent">Absent</option>
                        <option value="indisponible">Indisponible</option>
                      </select>
                    ) : (
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          situation === 'present'
                            ? 'bg-green-100 text-green-800'
                            : situation === 'absent'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {getSituationLabel(situation)}
                      </span>
                    )}
                  </td>
                  <td className="p-4 text-sm">
                    {isEditing ? (
                      <select
                        value={formData.motifId || ''}
                        onChange={(e) => setFormData({ ...formData, motifId: Number(e.target.value) || undefined })}
                        disabled={formData.situation === 'present'}
                        className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-900 text-sm disabled:bg-gray-100"
                      >
                        <option value="">-</option>
                        {formData.situation === 'absent' && motifsAbsent.map((m) => (
                          <option key={m.id_motif} value={m.id_motif}>
                            {m.libelle}
                          </option>
                        ))}
                        {formData.situation === 'indisponible' && motifsIndisponible.map((m) => (
                          <option key={m.id_motif} value={m.id_motif}>
                            {m.libelle}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <span className="text-gray-900">{motif?.libelle || '-'}</span>
                    )}
                  </td>
                  <td className="p-4 text-sm">
                    {isEditing ? (
                      <input
                        type="date"
                        value={formData.dateDebut || ''}
                        onChange={(e) => setFormData({ ...formData, dateDebut: e.target.value })}
                        disabled={formData.situation === 'present'}
                        className="px-2 py-1 bg-white border border-gray-300 rounded text-gray-900 text-sm disabled:bg-gray-100"
                      />
                    ) : militaire.situationActuelle?.date_situation ? (
                      <span className="text-gray-900 text-xs">
                        {militaire.situationActuelle.date_situation}
                      </span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    {isEditing ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleSave}
                          disabled={isBlocked || isSaving}
                          className={`p-1.5 rounded ${
                            isBlocked || isSaving
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        </button>
                        <button
                          onClick={handleCancel}
                          disabled={isSaving}
                          className="p-1.5 rounded bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEdit(militaire)}
                        disabled={isBlocked}
                        className={`p-1.5 rounded ${
                          isBlocked
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            pageSize={pageSize}
            totalItems={totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        </div>
      )}
    </div>
  );
}