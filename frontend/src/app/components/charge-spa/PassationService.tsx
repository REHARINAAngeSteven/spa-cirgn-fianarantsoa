// frontend/src/app/components/charge-spa/PassationService.tsx
import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useDashboardUnite } from '../../../hooks/useDashboardUnite';
import { Shield, FileText, Lock, AlertCircle, Loader2 } from 'lucide-react';
import { StatusBadge } from '../StatusBadge';
import { passationApi } from '../../../api/passation.api';
import { comptesApi } from '../../../api/compte.api';
import type { Passation, Compte } from '../../types/backend';
import { toast } from 'sonner';

export function PassationService() {
  const { currentUser } = useAuth();
  const { militaires, unites, isLoading: dataLoading } = useDashboardUnite();

  const userUniteId = currentUser?.unite_id;
  const currentUnite = unites.find((u) => u.id_unite === userUniteId);
  const unitePersonnel = militaires.filter((m) => m.id_unite === userUniteId && m.est_actif);

  const [passations, setPassations] = useState<Passation[]>([]);
  const [comptes, setComptes] = useState<Compte[]>([]);
  const [isLoadingPassations, setIsLoadingPassations] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // États du formulaire
  const [notesConsignes, setNotesConsignes] = useState('');
  const [idEntrant, setIdEntrant] = useState('');
  const [nouveauMotDePasse, setNouveauMotDePasse] = useState('');
  const [confirmMotDePasse, setConfirmMotDePasse] = useState('');
  const [signature, setSignature] = useState(false);

  // Charger les passations et comptes au montage
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoadingPassations(true);
        // Note: passationApi.getAll() nécessite le rôle ADMIN
        // Pour CHARGE_SPA, on ne peut pas voir toutes les passations
        // On va gérer ça différemment
        setPassations([]);
      } catch (err) {
        console.error('Erreur chargement passations:', err);
      } finally {
        setIsLoadingPassations(false);
      }
    };

    loadData();
  }, []);

  // Vérifier s'il y a une passation en attente pour cette unité
  const passationEnAttente = passations.find(
    p => p.id_unite === userUniteId && p.statut === 'EN_ATTENTE'
  );

  const isBlocked = currentUnite && !currentUnite.saisie_autorisee;

  // Calculer les statistiques d'effectifs
  const getMotifType = (militaire: typeof militaires[0]) => {
    if (!militaire.situationActuelle?.id_motif) return null;
    return militaire.situationActuelle.est_present ? 'indisponible' : 'absent';
  };

  const surLeRang = unitePersonnel.filter((m) => 
    m.situationActuelle && m.situationActuelle.est_present && getMotifType(m) !== 'indisponible'
  ).length;
  const indisponibles = unitePersonnel.filter((m) => getMotifType(m) === 'indisponible').length;
  const absents = unitePersonnel.filter((m) => 
    m.situationActuelle && !m.situationActuelle.est_present
  ).length;
  const nonPointes = unitePersonnel.filter((m) => !m.situationActuelle).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validations
    if (nouveauMotDePasse !== confirmMotDePasse) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (nouveauMotDePasse.length < 8) {
      toast.error('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }

    if (!signature) {
      toast.error('Vous devez signer pour confirmer la passation');
      return;
    }

    if (!currentUser?.id_compte) {
      toast.error('Utilisateur non identifié');
      return;
    }

    try {
      setIsSaving(true);

      await passationApi.initier({
        id_sortant: currentUser.id_compte,
        id_entrant: Number(idEntrant),
        id_unite: userUniteId!,
        notes_consignes: notesConsignes,
        nouveau_mdp: nouveauMotDePasse,
      });

      toast.success('Passation soumise avec succès', {
        description: 'En attente de validation par l\'administrateur',
      });

      // Réinitialiser le formulaire
      setNotesConsignes('');
      setIdEntrant('');
      setNouveauMotDePasse('');
      setConfirmMotDePasse('');
      setSignature(false);

      // Recharger la page après un délai
      setTimeout(() => {
        window.location.reload();
      }, 2000);

    } catch (err: any) {
      console.error('Erreur passation:', err);
      const errorMessage = err.response?.data?.message || 'Erreur lors de la soumission';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (dataLoading || isLoadingPassations) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
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

  // Filtrer les comptes existants pour ne pas les proposer comme entrants
  const militairesDisponibles = unitePersonnel.filter(m => 
    !m.compte || m.compte.id_compte !== currentUser?.id_compte
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Passation de Service</h1>
        <p className="text-gray-600">
          Passation Opérationnelle & Sécurité - {currentUnite.nom_unite}
        </p>
      </div>

      {/* Alerte si passation en attente */}
      {(passationEnAttente || isBlocked) && (
        <div className="mb-6 bg-yellow-50 border-l-4 border-yellow-500 rounded p-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div>
            <h3 className="text-yellow-800 font-medium mb-1">Passation en attente de validation</h3>
            <p className="text-sm text-yellow-700">
              Une passation a été soumise et est en cours de validation par l'administrateur.
              Aucune nouvelle passation ne peut être effectuée pour le moment.
            </p>
          </div>
        </div>
      )}

      {/* Historique des passations (si disponible) */}
      {passations.length > 0 && (
        <div className="mb-6 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Historique des Passations
          </h2>
          <div className="space-y-3">
            {passations
              .filter(p => p.id_unite === userUniteId)
              .map((passation) => (
                <div
                  key={passation.id_passation}
                  className="p-4 bg-gray-50 rounded border border-gray-200 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm text-gray-900">
                      Passation du {new Date(passation.date_creation).toLocaleDateString('fr-FR')}
                    </p>
                    {passation.date_validation && (
                      <p className="text-xs text-gray-600">
                        Validée le {new Date(passation.date_validation).toLocaleDateString('fr-FR')}
                      </p>
                    )}
                  </div>
                  <StatusBadge status={passation.statut} />
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Formulaire de passation */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Volet Effectifs */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Volet Effectifs & Opérations
          </h2>

          <div className="mb-4 p-4 bg-gray-50 rounded">
            <p className="text-sm text-gray-600 mb-3 font-medium">Bilan automatique</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-xs text-gray-600">Total</p>
                <p className="text-xl font-bold text-gray-900">{unitePersonnel.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600">Sur le rang</p>
                <p className="text-xl font-bold text-green-600">{surLeRang}</p>
              </div>
              {
              /*
                <div>
                  <p className="text-xs text-gray-600">Indisponibles</p>
                  <p className="text-xl font-bold text-orange-600">{indisponibles}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600">Absents</p>
                  <p className="text-xl font-bold text-red-600">{absents}</p>
                </div>
              */
              }
                <div>
                  <p className="text-xs text-gray-600">Non pointés</p>
                  <p className="text-xl font-bold text-gray-600">{nonPointes}</p>
                </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Consignes de Commandement *
            </label>
            <textarea
              value={notesConsignes}
              onChange={(e) => setNotesConsignes(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 min-h-[120px] focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Notes opérationnelles, consignes particulières, missions en cours..."
              required
              disabled={!!passationEnAttente || isBlocked}
            />
          </div>
        </div>

        {/* Volet Sécurité */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Lock className="w-5 h-5 text-blue-600" />
            Volet Sécurité - Passation de Compte
          </h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Futur Chargé SPA (Entrant) *
              </label>
              <select
                value={idEntrant}
                onChange={(e) => setIdEntrant(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled={!!passationEnAttente || isBlocked}
              >
                <option value="">Sélectionner un militaire</option>
                {militairesDisponibles.map((militaire) => (
                  <option key={militaire.id_militaire} value={militaire.compte?.id_compte || militaire.id_militaire}>
                    {militaire.nom} {militaire.prenom} - {militaire.im}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Sélectionnez le militaire qui deviendra le nouveau Chargé SPA
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Nouveau Mot de Passe *
                </label>
                <input
                  type="password"
                  value={nouveauMotDePasse}
                  onChange={(e) => setNouveauMotDePasse(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Minimum 8 caractères"
                  minLength={8}
                  required
                  disabled={!!passationEnAttente || isBlocked}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2">
                  Confirmer le Mot de Passe *
                </label>
                <input
                  type="password"
                  value={confirmMotDePasse}
                  onChange={(e) => setConfirmMotDePasse(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Confirmer le mot de passe"
                  minLength={8}
                  required
                  disabled={!!passationEnAttente || isBlocked}
                />
              </div>
            </div>

            {nouveauMotDePasse && confirmMotDePasse && nouveauMotDePasse !== confirmMotDePasse && (
              <p className="text-sm text-red-600">Les mots de passe ne correspondent pas</p>
            )}
          </div>
        </div>

        {/* Signature */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={signature}
              onChange={(e) => setSignature(e.target.checked)}
              className="w-5 h-5 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              disabled={!!passationEnAttente || isBlocked}
            />
            <span className="text-sm text-gray-900">
              Je confirme la passation et le transfert de responsabilité en tant que Chargé SPA sortant.
              Je certifie que toutes les consignes ont été transmises au militaire entrant.
            </span>
          </label>
        </div>

        {/* Submit */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={!!passationEnAttente || isBlocked || isSaving}
            className={`px-6 py-3 rounded font-medium ${
              passationEnAttente || isBlocked || isSaving
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Soumission en cours...
              </span>
            ) : (
              'Soumettre la Passation'
            )}
          </button>
          <p className="text-sm text-gray-600 self-center">
            La passation sera soumise pour validation à l'administrateur.
            Votre unité sera temporairement verrouillée.
          </p>
        </div>
      </form>
    </div>
  );
}