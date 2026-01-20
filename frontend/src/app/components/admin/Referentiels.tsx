// frontend/src/app/components/admin/Referentiels.tsx
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Settings, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { Pagination } from '../Pagination';
import { useTableFilters } from '../../hooks/useTableFilters';
import { referentielsApi } from '../../../api/referentiels.api';
import type { MotifAbsence, Fonction, Unite } from '../../types/backend';

type Tab = 'motifs' | 'fonctions' | 'unites';

export function Referentiels() {
  const [activeTab, setActiveTab] = useState<Tab>('motifs');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // States pour les données
  const [motifs, setMotifs] = useState<MotifAbsence[]>([]);
  const [fonctions, setFonctions] = useState<Fonction[]>([]);
  const [unites, setUnites] = useState<Unite[]>([]);

  type NewMotifAbsence = Omit<MotifAbsence, "id_motif">;
  type NewFonction = Omit<Fonction, "id_fonction">;
  type NewUnite = Omit<Unite, "id_unite">;


  // Forms
  const [motifForm, setMotifForm] = useState<NewMotifAbsence>({
    libelle: '',
    type_motif: 'absent',
  });

  const [fonctionForm, setFonctionForm] = useState<NewFonction>({
    nom_fonction: '',
  });

  const [uniteForm, setUniteForm] = useState<NewUnite>({
    nom_unite: '',
    saisie_autorisee: true,
  });


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [motifsData, fonctionsData, unitesData] = await Promise.all([
        referentielsApi.getAllMotifs(),
        referentielsApi.getAllFonctions(),
        referentielsApi.getAllUnites(),
      ]);
      setMotifs(motifsData);
      setFonctions(fonctionsData);
      setUnites(unitesData);
    } catch (err) {
      console.error('Erreur chargement:', err);
      toast.error('Erreur de chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  // Tables
  const motifsTable = useTableFilters({ data: motifs, searchFields: ['libelle'] });
  const fonctionsTable = useTableFilters({ data: fonctions, searchFields: ['nom_fonction'] });
  const unitesTable = useTableFilters({ data: unites, searchFields: ['nom_unite'] });

  // Handlers Motifs
  const handleSubmitMotif = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (editingId) {
        await referentielsApi.updateMotif(editingId, motifForm);
        toast.success('Motif mis à jour');
      } else {
        await referentielsApi.createMotif(motifForm);
        toast.success('Motif créé');
      }
      await loadData();
      resetForm();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteMotif = async (id: number) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    try {
      await referentielsApi.deleteMotif(id);
      toast.success('Motif supprimé');
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  // Handlers Fonctions
  const handleSubmitFonction = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (editingId) {
        await referentielsApi.updateFonction(editingId, fonctionForm);
        toast.success('Fonction mise à jour');
      } else {
        await referentielsApi.createFonction(fonctionForm);
        toast.success('Fonction créée');
      }
      await loadData();
      resetForm();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteFonction = async (id: number) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    try {
      await referentielsApi.deleteFonction(id);
      toast.success('Fonction supprimée');
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  // Handlers Unités
  const handleSubmitUnite = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      if (editingId) {
        await referentielsApi.updateUnite(editingId, uniteForm);
        toast.success('Unité mise à jour');
      } else {
        await referentielsApi.createUnite(uniteForm);
        toast.success('Unité créée');
      }
      await loadData();
      resetForm();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteUnite = async (id: number) => {
    if (!window.confirm('Confirmer la suppression ?')) return;
    try {
      await referentielsApi.deleteUnite(id);
      toast.success('Unité supprimée');
      await loadData();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Erreur');
    }
  };

  const resetForm = () => {
    setShowForm(false);
    setEditingId(null);
    setMotifForm({ libelle: '', type_motif: 'absent' });
    setFonctionForm({ nom_fonction: '' });
    setUniteForm({ nom_unite: '', saisie_autorisee: true });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Settings className="w-6 h-6" />
          Référentiels
        </h1>
        <p className="text-gray-600">Gestion des motifs, fonctions et unités</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('motifs')}
          className={`px-4 py-2 ${
            activeTab === 'motifs'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Motifs
        </button>
        <button
          onClick={() => setActiveTab('fonctions')}
          className={`px-4 py-2 ${
            activeTab === 'fonctions'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Fonctions
        </button>
        <button
          onClick={() => setActiveTab('unites')}
          className={`px-4 py-2 ${
            activeTab === 'unites'
              ? 'border-b-2 border-blue-600 text-blue-600'
              : 'text-gray-600'
          }`}
        >
          Unités
        </button>
      </div>

      {/* Motifs Tab */}
      {activeTab === 'motifs' && (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setMotifForm({ libelle: '', type_motif: 'absent' });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Nouveau Motif
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingId ? 'Modifier le Motif' : 'Nouveau Motif'}
              </h3>
              <form onSubmit={handleSubmitMotif} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Libellé *</label>
                  <input
                    type="text"
                    value={motifForm.libelle}
                    onChange={(e) => setMotifForm({ ...motifForm, libelle: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Type *</label>
                  <select
                    value={motifForm.type_motif}
                    onChange={(e) => setMotifForm({ ...motifForm, type_motif: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                  >
                    <option value="absent">Absent</option>
                    <option value="indisponible">Indisponible</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    {isSaving ? 'Enregistrement...' : (editingId ? 'Mettre à Jour' : 'Créer')}
                  </button>
                  <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Libellé</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {motifsTable.paginatedData.map((motif) => (
                  <tr key={motif.id_motif} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-900">{motif.libelle}</td>
                    <td className="p-4 text-sm">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        motif.type_motif === 'absent' ? 'bg-red-100 text-red-800' : 'bg-orange-100 text-orange-800'
                      }`}>
                        {motif.type_motif === 'absent' ? 'Absent' : 'Indisponible'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setMotifForm(motif);
                            setEditingId(motif.id_motif);
                            setShowForm(true);
                          }}
                          className="p-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMotif(motif.id_motif)}
                          className="p-1.5 rounded bg-red-600 text-white hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {motifsTable.totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={motifsTable.currentPage}
                totalItems={motifsTable.totalItems}
                totalPages={motifsTable.totalPages}
                pageSize={motifsTable.pageSize || 10}
                onPageChange={(page) => motifsTable.setCurrentPage(page)}
                onPageSizeChange={(size) => {}}
              />

            </div>
          )}
        </div>
      )}

      {/* Fonctions Tab */}
      {activeTab === 'fonctions' && (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setFonctionForm({ nom_fonction: '' });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Nouvelle Fonction
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingId ? 'Modifier la Fonction' : 'Nouvelle Fonction'}
              </h3>
              <form onSubmit={handleSubmitFonction} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Nom *</label>
                  <input
                    type="text"
                    value={fonctionForm.nom_fonction}
                    onChange={(e) => setFonctionForm({ nom_fonction: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    {isSaving ? 'Enregistrement...' : (editingId ? 'Mettre à Jour' : 'Créer')}
                  </button>
                  <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Nom</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fonctionsTable.paginatedData.map((fonction) => (
                  <tr key={fonction.id_fonction} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-900">{fonction.nom_fonction}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setFonctionForm(fonction);
                            setEditingId(fonction.id_fonction);
                            setShowForm(true);
                          }}
                          className="p-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteFonction(fonction.id_fonction)}
                          className="p-1.5 rounded bg-red-600 text-white hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {fonctionsTable.totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={fonctionsTable.currentPage}
                totalItems={fonctionsTable.totalItems}
                totalPages={fonctionsTable.totalPages}
                pageSize={fonctionsTable.pageSize || 10}
                onPageChange={(page) => fonctionsTable.setCurrentPage(page)}
                onPageSizeChange={(size) => {}}
              />
            </div>
          )}
        </div>
      )}

      {/* Unités Tab */}
      {activeTab === 'unites' && (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => {
                setShowForm(true);
                setEditingId(null);
                setUniteForm({ nom_unite: '', saisie_autorisee: true });
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4" />
              Nouvelle Unité
            </button>
          </div>

          {showForm && (
            <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {editingId ? "Modifier l'Unité" : 'Nouvelle Unité'}
              </h3>
              <form onSubmit={handleSubmitUnite} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Nom *</label>
                  <input
                    type="text"
                    value={uniteForm.nom_unite}
                    onChange={(e) => setUniteForm({ ...uniteForm, nom_unite: e.target.value })}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900"
                    required
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                  >
                    {isSaving ? 'Enregistrement...' : (editingId ? 'Mettre à Jour' : 'Créer')}
                  </button>
                  <button type="button" onClick={resetForm} className="bg-gray-300 text-gray-700 px-4 py-2 rounded">
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Nom</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Statut</th>
                  <th className="text-left p-4 text-sm font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {unitesTable.paginatedData.map((unite) => (
                  <tr key={unite.id_unite} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-900">{unite.nom_unite}</td>
                    <td className="p-4 text-sm">
                      <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                        unite.saisie_autorisee ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {unite.saisie_autorisee ? 'Active' : 'Verrouillée'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setUniteForm(unite);
                            setEditingId(unite.id_unite);
                            setShowForm(true);
                          }}
                          className="p-1.5 rounded bg-blue-600 text-white hover:bg-blue-700"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUnite(unite.id_unite)}
                          className="p-1.5 rounded bg-red-600 text-white hover:bg-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {unitesTable.totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                currentPage={unitesTable.currentPage}
                totalItems={unitesTable.totalItems}
                totalPages={unitesTable.totalPages}
                pageSize={unitesTable.pageSize || 10}
                onPageChange={(page) => unitesTable.setCurrentPage(page)}
                onPageSizeChange={(size) => {}}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}