// frontend/src/app/components/admin/GestionPersonnel.tsx
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { TableSearch } from '../TableSearch';
import type { FilterOption } from '../../hooks/useTableFilters';
import { ExportButton } from '../ExportButton';
import { Pagination } from '../Pagination';
import { useTableFilters } from '../../hooks/useTableFilters';
import { militairesApi } from '../../../api/militaire.api';
import { referentielsApi } from '../../../api/referentiels.api';
import type { Militaire, Unite, Fonction } from '../../types/backend';
import { set } from 'react-hook-form';

export function GestionPersonnel() {
  const [militaires, setMilitaires] = useState<Militaire[]>([]);
  const [unites, setUnites] = useState<Unite[]>([]);
  const [fonctions, setFonctions] = useState<Fonction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const [formData, setFormData] = useState({
    im: '',
    nom: '',
    prenom: '',
    cin: '',
    id_fonction: 0,
    id_unite: 0,
    est_actif: true,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [militairesData, unitesData, fonctionsData] = await Promise.all([
        militairesApi.getAll(),
        referentielsApi.getAllUnites(),
        referentielsApi.getAllFonctions(),
      ]);
      setMilitaires(militairesData);
      setUnites(unitesData);
      setFonctions(fonctionsData);
    } catch (err) {
      console.error('Erreur chargement:', err);
      toast.error('Erreur de chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  // Configuration des filtres
  const filterConfig: FilterOption[] = [
    {
      label: 'Unité',
      value: 'unite',
      options: unites.map((u) => ({ label: u.nom_unite, value: u.id_unite })),
    },
    {
      label: 'Fonction',
      value: 'fonction',
      options: fonctions.map((f) => ({ label: f.nom_fonction, value: f.id_fonction })),
    },
    {
      label: 'Statut',
      value: 'actif',
      options: [
        { label: 'Actif', value: 'true' },
        { label: 'Inactif', value: 'false' },
      ],
    },
  ];

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
    data: militaires,
    searchFields: ['im', 'nom', 'prenom', 'cin'],
    filterConfig: {
      unite: (item, value) => item.id_unite === Number(value),
      fonction: (item, value) => item.id_fonction === Number(value),
      actif: (item, value) => item.est_actif === (value === 'true'),
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setIsSaving(true);

      if (editingId) {
        await militairesApi.update(editingId, formData);
        toast.success('Militaire mis à jour');
      } else {
        await militairesApi.create(formData);
        toast.success('Militaire créé');
      }

      await loadData();
      closeForm();
    } catch (err: any) {
      console.error('Erreur:', err);
      toast.error(err.response?.data?.message || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (militaire: Militaire) => {
    setFormData({
      im: militaire.im,
      nom: militaire.nom,
      prenom: militaire.prenom,
      cin: militaire.cin,
      id_fonction: militaire.id_fonction,
      id_unite: militaire.id_unite,
      est_actif: militaire.est_actif,
    });
    setEditingId(militaire.id_militaire);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const militaire = militaires.find(m => m.id_militaire === id);
    if (!window.confirm(`Confirmer la suppression de ${militaire?.nom} ${militaire?.prenom} ?`)) {
      return;
    }

    try {
      await militairesApi.delete(id);
      toast.success('Militaire supprimé');
      await loadData();
    } catch (err: any) {
      console.error('Erreur:', err);
      toast.error(err.response?.data?.message || 'Erreur lors de la suppression');
    }
  };

  const resetForm = () => {
    setFormData({
      im: '',
      nom: '',
      prenom: '',
      cin: '',
      id_fonction: 0,
      id_unite: 0,
      est_actif: true,
    });
    setEditingId(null);
  };
  const closeForm = () => {
    resetForm();
    setShowForm(false);
  };


  const exportData = militaires.map((m) => ({
    IM: m.im,
    Fonction: fonctions.find((f) => f.id_fonction === m.id_fonction)?.nom_fonction || '',
    Nom: m.nom,
    Prénom: m.prenom,
    CIN: m.cin,
    Unité: unites.find((u) => u.id_unite === m.id_unite)?.nom_unite || '',
    Actif: m.est_actif ? 'Oui' : 'Non',
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <>
      <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion du Personnel</h1>
          <p className="text-gray-600">CRUD global du personnel du régiment</p>
        </div>
        <button
          onClick={() => {
            console.log('Ouverture du formulaire de création');
            resetForm();
            setShowForm(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4" />
          Nouveau Militaire
        </button>
      </div>
        
      {/* Modal Formulaire - À la fin du DOM */}
      {showForm && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            // Fermer si on clique sur l'overlay
            if (e.target === e.currentTarget) {
              closeForm();
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
              <h2 className="text-lg font-semibold text-gray-900">
                {editingId ? 'Modifier le Militaire' : 'Nouveau Militaire'}
              </h2>
              <button
                onClick={closeForm}
                className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
                type="button"
              >
                ×
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <form onSubmit={handleSubmit} className="p-6 space-y-4" id="militaire-form">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">IM *</label>
                <input
                  type="text"
                  value={formData.im}
                  onChange={(e) => setFormData({ ...formData, im: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">CIN *</label>
                <input
                  type="text"
                  value={formData.cin}
                  onChange={(e) => setFormData({ ...formData, cin: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Nom *</label>
                <input
                  type="text"
                  value={formData.nom}
                  onChange={(e) => setFormData({ ...formData, nom: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Prénom *</label>
                <input
                  type="text"
                  value={formData.prenom}
                  onChange={(e) => setFormData({ ...formData, prenom: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Fonction *</label>
                <select
                  value={formData.id_fonction}
                  onChange={(e) => setFormData({ ...formData, id_fonction: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                  required
                >
                  <option value={0}>Sélectionner</option>
                  {fonctions.map((f) => (
                    <option key={f.id_fonction} value={f.id_fonction}>
                      {f.nom_fonction}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">Unité *</label>
                <select
                  value={formData.id_unite}
                  onChange={(e) => setFormData({ ...formData, id_unite: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                  required
                >
                  <option value={0}>Sélectionner</option>
                  {unites.map((u) => (
                    <option key={u.id_unite} value={u.id_unite}>
                      {u.nom_unite}
                    </option>
                  ))}
                </select>
              </div>
            </div>

              </form>
            </div>

            <div className="bg-white border-t border-gray-200 px-6 py-4 flex gap-3 flex-shrink-0">
              <button
                type="submit"
                form="militaire-form"
                disabled={isSaving}
                className="flex-1 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Enregistrement...
                  </span>
                ) : (
                  editingId ? 'Mettre à Jour' : 'Créer'
                )}
              </button>
              <button
                type="button"
                onClick={resetForm}
                disabled={isSaving}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 disabled:opacity-50"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Barre de recherche */}
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex-1">
          <TableSearch
            searchPlaceholder="Rechercher par IM, nom, prénom ou CIN..."
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
          filename="personnel-regiment"
          headers={{
            IM: 'IM',
            Fonction: 'Fonction',
            Nom: 'Nom',
            Prénom: 'Prénom',
            CIN: 'CIN',
            Unité: 'Unité',
            Actif: 'Actif',
          }}
        />
      </div>

      {/* Tableau */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 text-sm font-medium text-gray-900">IM</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">Fonction</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">Nom</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">Prénom</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">Unité</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">Statut</th>
              <th className="text-left p-4 text-sm font-medium text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedData.map((militaire) => {
              const fonction = fonctions.find((f) => f.id_fonction === militaire.id_fonction);
              const unite = unites.find((u) => u.id_unite === militaire.id_unite);

              return (
                <tr key={militaire.id_militaire} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="p-4 text-sm text-gray-900">{militaire.im}</td>
                  <td className="p-4 text-sm text-gray-900">{fonction?.nom_fonction}</td>
                  <td className="p-4 text-sm text-gray-900">{militaire.nom}</td>
                  <td className="p-4 text-sm text-gray-900">{militaire.prenom}</td>
                  <td className="p-4 text-sm text-gray-900">{unite?.nom_unite}</td>
                  <td className="p-4 text-sm">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                      militaire.est_actif ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {militaire.est_actif ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(militaire)}
                        className="p-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(militaire.id_militaire)}
                        className="p-1.5 rounded bg-red-600 text-white hover:bg-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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
    </>
  );
}