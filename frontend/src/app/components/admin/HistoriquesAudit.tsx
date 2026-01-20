// frontend/src/app/components/admin/HistoriquesAudit.tsx
import { useEffect, useState } from 'react';
import { StatusBadge } from '../StatusBadge';
import { History, FileText, CheckCircle, Loader2 } from 'lucide-react';
import { passationApi } from '../../../api/passation.api';
import { referentielsApi } from '../../../api/referentiels.api';
import type { Passation, Unite } from '../../types/backend';
import { toast } from 'sonner';

export function HistoriquesAudit() {
  const [passations, setPassations] = useState<Passation[]>([]);
  const [unites, setUnites] = useState<Unite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const validatedPassations = passations.filter((p) => p.statut === 'VALIDEE');
  const rejectedPassations = passations.filter((p) => p.statut === 'REJETEE');

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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Historiques & Audit</h1>
        <p className="text-gray-600">
          Registre des passations validées et rejetées
        </p>
      </div>

      {/* Historique des Passations Validées */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Passations Validées ({validatedPassations.length})
        </h2>

        {validatedPassations.length === 0 ? (
          <div className="text-center py-8 text-gray-600">
            Aucune passation validée
          </div>
        ) : (
          <div className="space-y-4">
            {validatedPassations.map((passation) => {
              const unite = unites.find((u) => u.id_unite === passation.id_unite);

              return (
                <div
                  key={passation.id_passation}
                  className="border border-gray-200 rounded-lg p-4 bg-gray-50"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-gray-900 font-medium mb-1">
                        {unite?.nom_unite}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Passation du {new Date(passation.date_creation).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <StatusBadge status={passation.statut} />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-gray-600">Sortant</p>
                      <p className="text-sm text-gray-900">Compte ID {passation.id_sortant}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Entrant</p>
                      <p className="text-sm text-gray-900">Compte ID {passation.id_entrant}</p>
                    </div>
                  </div>

                  {passation.notes_consignes && (
                    <div className="p-3 bg-white rounded mb-3">
                      <p className="text-xs text-gray-600 mb-1">Consignes</p>
                      <p className="text-sm text-gray-900">{passation.notes_consignes}</p>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <CheckCircle className="w-3 h-3" />
                    Validé le {passation.date_validation ? new Date(passation.date_validation).toLocaleDateString('fr-FR') : 'N/A'}
                    {passation.id_admin_validateur && ` par Admin ID ${passation.id_admin_validateur}`}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Historique des Passations Rejetées */}
      {rejectedPassations.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-red-600" />
            Passations Rejetées ({rejectedPassations.length})
          </h2>

          <div className="space-y-3">
            {rejectedPassations.map((passation) => {
              const unite = unites.find((u) => u.id_unite === passation.id_unite);

              return (
                <div
                  key={passation.id_passation}
                  className="flex items-start gap-3 p-4 bg-red-50 rounded border border-red-200"
                >
                  <div className="flex-1">
                    <p className="text-sm text-gray-900 font-medium mb-1">
                      {unite?.nom_unite}
                    </p>
                    <p className="text-xs text-gray-600 mb-1">
                      Passation du {new Date(passation.date_creation).toLocaleDateString('fr-FR')}
                    </p>
                    <p className="text-xs text-gray-600">
                      Rejeté le {passation.date_validation ? new Date(passation.date_validation).toLocaleDateString('fr-FR') : 'N/A'}
                    </p>
                  </div>
                  <StatusBadge status={passation.statut} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}