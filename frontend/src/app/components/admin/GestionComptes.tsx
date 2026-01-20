// frontend/src/app/components/admin/GestionComptes.tsx
import { useEffect, useState } from 'react';
import { Users, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { referentielsApi } from '../../../api/referentiels.api';
import { comptesApi } from '../../../api/compte.api';
import { militairesApi } from '../../../api/militaire.api';
import type { Unite, Compte, Militaire } from '../../types/backend';

export function GestionComptes() {
  const [unites, setUnites] = useState<Unite[]>([]);
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [militaires, setMilitaires] = useState<Militaire[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [unitesData, comptesData, militairesData] = await Promise.all([
        referentielsApi.getAllUnites(),
        comptesApi.getAll(),
        militairesApi.getAll(),
      ]);
      setUnites(unitesData);
      setComptes(comptesData);
      setMilitaires(militairesData);
    } catch (err) {
      console.error('Erreur chargement:', err);
      toast.error('Erreur de chargement des données');
    } finally {
      setIsLoading(false);
    }
  };

  const chargesSPA = comptes.filter((c) => c.role === 'CHARGE_SPA');
  const admins = comptes.filter((c) => c.role === 'ADMIN');

  const getMilitaireForCompte = (compte: Compte) => {
    return militaires.find(m => m.id_militaire === compte.id_militaire);
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Gestion des Comptes & Sécurité</h1>
        <p className="text-gray-600">
          Habilitations et statut de saisie des unités
        </p>
      </div>

      {/* Statut de Saisie des Unités */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Statut de Saisie par Unité
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left p-4 text-sm font-medium text-gray-900">Unité</th>
                <th className="text-left p-4 text-sm font-medium text-gray-900">État de Saisie</th>
              </tr>
            </thead>
            <tbody>
              {unites.map((unite) => {
                const isBlocked = !unite.saisie_autorisee;
                return (
                  <tr key={unite.id_unite} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="p-4 text-sm text-gray-900">{unite.nom_unite}</td>
                    <td className="p-4 text-sm">
                      <span
                        className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                          isBlocked
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {isBlocked ? 'Verrouillée' : 'Active'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Habilitations - Chargés SPA */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-blue-600" />
          Chargés SPA ({chargesSPA.length})
        </h2>

        {chargesSPA.length === 0 ? (
          <p className="text-center py-8 text-gray-600">Aucun Chargé SPA</p>
        ) : (
          <div className="space-y-3">
            {chargesSPA.map((compte) => {
              const militaire = getMilitaireForCompte(compte);
              const unite = unites.find((u) => u.id_unite === militaire?.id_unite);
              
              return (
                <div
                  key={compte.id_compte}
                  className="p-4 bg-gray-50 rounded border border-gray-200 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">
                      {militaire?.nom} {militaire?.prenom}
                    </p>
                    <p className="text-sm text-gray-600">
                      Login: {compte.login} | IM: {militaire?.im}
                    </p>
                    <p className="text-sm text-gray-600">
                      Unité: {unite?.nom_unite || 'Non assigné'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-flex px-2 py-1 rounded text-xs font-medium ${
                      compte.est_valide_par_admin 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {compte.est_valide_par_admin ? 'Validé' : 'En attente'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Habilitations - Administrateurs */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Shield className="w-5 h-5 text-blue-600" />
          Administrateurs ({admins.length})
        </h2>

        {admins.length === 0 ? (
          <p className="text-center py-8 text-gray-600">Aucun administrateur</p>
        ) : (
          <div className="space-y-3">
            {admins.map((compte) => {
              const militaire = getMilitaireForCompte(compte);
              
              return (
                <div
                  key={compte.id_compte}
                  className="p-4 bg-gray-50 rounded border border-gray-200 flex items-center justify-between"
                >
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium">
                      {militaire?.nom} {militaire?.prenom}
                    </p>
                    <p className="text-sm text-gray-600">
                      Login: {compte.login} | IM: {militaire?.im}
                    </p>
                  </div>
                  <span className="inline-flex px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-800">
                    Administrateur
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Note de sécurité */}
      <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded p-4 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
        <div>
          <h3 className="text-yellow-800 font-medium mb-1">Note de Sécurité</h3>
          <p className="text-sm text-yellow-700">
            Les unités verrouillées ne peuvent pas effectuer de saisie SPA.
            Validez les passations dans le Centre de Validation pour débloquer les accès.
          </p>
        </div>
      </div>
    </div>
  );
}