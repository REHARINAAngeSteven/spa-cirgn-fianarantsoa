// frontend/src/app/components/admin/CentreValidation.tsx
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { StatusBadge } from '../StatusBadge';
import { CheckCircle, FileText, XCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { TableSearch } from '../TableSearch';
import type { FilterOption } from '../../hooks/useTableFilters';
import { useTableFilters } from '../../hooks/useTableFilters';
import { passationApi } from '../../../api/passation.api';
import { referentielsApi } from '../../../api/referentiels.api';
import type { Passation, Unite } from '../../types/backend';

export function CentreValidation() {
  const { currentUser } = useAuth();
  const [passations, setPassations] = useState<Passation[]>([]);
  const [unites, setUnites] = useState<Unite[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'passations' | 'passwords'>('passations');

  // Charger les données
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [passationsData, unitesData] = await Promise.all([
        passationApi.getAll(),
        referentielsApi.getAllUnites(),
      ]);
      setPassations(passationsData);
      setUnites(unitesData);
    } catch (err) {
      console.error('Erreur chargement:', err);
      toast.error('Erreur de chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const pendingPassations = passations.filter((p) => p.statut === 'EN_ATTENTE');

  // Filtrage pour les passations
  const passationFilters: FilterOption[] = [
    {
      label: 'Unité',
      value: 'unite',
      options: unites.map((u) => ({ 
        label: u.nom_unite, 
        value: u.id_unite 
      })),
    },
  ];

  const {
    searchQuery: passationSearch,
    setSearchQuery: setPassationSearch,
    filters: passationFiltersActive,
    setFilter: setPassationFilter,
    filteredData: filteredPassations,
  } = useTableFilters({
    data: pendingPassations,
    searchFields: [],
    filterConfig: {
      unite: (item, value) => item.id_unite === Number(value),
    },
  });

  const handleValidatePassation = async (id: number) => {
    const passation = passations.find(p => p.id_passation === id);
    const unite = unites.find(u => u.id_unite === passation?.id_unite);
    
    if (!window.confirm(`Confirmer la validation de la passation pour ${unite?.nom_unite} ?`)) {
      return;
    }

    try {
      await passationApi.valider(id);
      
      toast.success('Passation validée', {
        description: `Passation de service pour ${unite?.nom_unite} approuvée`,
        icon: <CheckCircle className="w-4 h-4" />,
      });

      // Recharger les données
      await loadData();
    } catch (err: any) {
      console.error('Erreur validation:', err);
      toast.error(err.response?.data?.message || 'Erreur lors de la validation');
    }
  };

  const handleRejectPassation = async (id: number) => {
    const passation = passations.find(p => p.id_passation === id);
    const unite = unites.find(u => u.id_unite === passation?.id_unite);
    
    if (!window.confirm(`Rejeter la passation pour ${unite?.nom_unite} ?`)) {
      return;
    }

    try {
      await passationApi.rejeter(id);
      
      toast.success('Passation rejetée', {
        description: `Passation de service pour ${unite?.nom_unite} rejetée`,
        icon: <XCircle className="w-4 h-4" />,
      });

      // Recharger les données
      await loadData();
    } catch (err: any) {
      console.error('Erreur rejet:', err);
      toast.error(err.response?.data?.message || 'Erreur lors du rejet');
    }
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Centre de Validation</h1>
        <p className="text-gray-600">
          Validation des passations de service
        </p>
      </div>

      {/* Compteurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg border-l-4 border-l-yellow-500 p-6">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="w-5 h-5 text-yellow-600" />
            <h3 className="text-gray-900 font-semibold">Passations en Attente</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900">{pendingPassations.length}</p>
        </div>
      </div>

      {/* Files d'attente des Passations */}
      <div>
        <div className="mb-4">
          <TableSearch
            searchPlaceholder="Rechercher..."
            searchValue={passationSearch}
            onSearchChange={setPassationSearch}
            filters={passationFilters}
            activeFilters={passationFiltersActive}
            onFilterChange={setPassationFilter}
            resultCount={filteredPassations.length}
          />
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Passations de Service à Valider
          </h2>

          {filteredPassations.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              Aucune passation en attente de validation
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPassations.map((passation) => {
                const unite = unites.find((u) => u.id_unite === passation.id_unite);

                return (
                  <div
                    key={passation.id_passation}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-gray-900 font-medium mb-1">
                          {unite?.nom_unite}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Date: {new Date(passation.date_creation).toLocaleDateString('fr-FR')}
                        </p>
                        <p className="text-sm text-gray-600">
                          Sortant: Compte ID {passation.id_sortant}
                        </p>
                        <p className="text-sm text-gray-600">
                          Entrant: Compte ID {passation.id_entrant}
                        </p>
                      </div>
                      <StatusBadge status={passation.statut} />
                    </div>

                    {passation.notes_consignes && (
                      <div className="bg-white p-3 rounded mb-4">
                        <p className="text-xs text-gray-600 mb-2">Consignes de Commandement</p>
                        <p className="text-sm text-gray-900">{passation.notes_consignes}</p>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <button
                        onClick={() => handleValidatePassation(passation.id_passation)}
                        className="flex-1 bg-green-600 text-white py-2.5 rounded hover:bg-green-700 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Valider la Passation
                      </button>
                      <button
                        onClick={() => handleRejectPassation(passation.id_passation)}
                        className="bg-red-600 text-white px-4 py-2.5 rounded hover:bg-red-700 flex items-center gap-2"
                      >
                        <XCircle className="w-4 h-4" />
                        Rejeter
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Rappel de sécurité */}
      <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-500 rounded p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div>
          <h3 className="text-yellow-800 font-medium mb-1">Rappel de Sécurité</h3>
          <p className="text-sm text-yellow-700">
            La validation d'une passation active le nouveau compte Chargé SPA et déverrouille l'unité.
            Le rejet annule la passation et déverrouille également l'unité.
          </p>
        </div>
      </div>
    </div>
  );
}