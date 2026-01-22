// backend/src/services/passation.service.js

const bcrypt = require("bcryptjs");
const { sequelize, Passation, Unite, Compte } = require("../models");
const { where } = require("sequelize");




/**
 * 
 * CREATION DE compte entrant si n'existe pas
 * 
 */

async function creerCompteEntrant(id_militaire, mot_de_passe_temporaire,t) {
  let compte = await Compte.findOne({
    where: {id_militaire},
    transaction: t,
  });
  if (!compte) {
    const hash = await bcrypt.hash(mot_de_passe_temporaire, 10);
    compte = await Compte.create({
    id_militaire,
    login: `MIL${id_militaire}`,      // ou IM, matricule, etc.
    role: 'MILITAIRE',                // IMPORTANT
    mot_de_passe_hash: hash,
    est_valide_par_admin: 0,
  }, { transaction: t });
  }

  return compte;
}

/**
 * INITIATION DE PASSATION
 * Chargé SPA sortant uniquement
 */

async function initierPassation({
  id_sortant,
  id_entrant,
  id_unite,
  notes_consignes,
  nouveau_mdp,
}) {
  return sequelize.transaction(async (t) => {
    if (!id_unite) {
      throw new Error("ID unité manquant ou invalide");
    }

    if (!id_sortant || !id_entrant) {
      throw new Error("ID sortant ou entrant manquant");
    }


    // 1️⃣ Vérifier l'unité - UTILISE WHERE au lieu de findByPk
    const unite = await Unite.findOne({
      where: { id_unite: id_unite },
      transaction: t,
    });

    if (!unite) {
      throw new Error("Unité introuvable");
    }

    if (!unite.saisie_autorisee) {
      throw new Error("Unité déjà verrouillée");
    }

    // 2️⃣ Vérifier qu'il n'y a PAS de passation en attente
    const existante = await Passation.findOne({
      where: {
        id_unite,
        statut: "EN_ATTENTE",
      },
      transaction: t,
    });

    if (existante) {
      throw new Error("Une passation est déjà en attente pour cette unité");
    }

    // 3️⃣ Vérifier les comptes
    const sortant = await Compte.findByPk(id_sortant, { transaction: t });
    const entrant = await creerCompteEntrant(id_entrant, nouveau_mdp, t);

    if (!sortant) {
      throw new Error("Compte sortant introuvable");
    }

    if (sortant.id_militaire === entrant.id_militaire) {
      throw new Error("Le sortant et l'entrant ne peuvent pas être identiques");
    }

    // 4️⃣ Hash du nouveau mot de passe (temporaire)
    const hashTemp = await bcrypt.hash(nouveau_mdp, 10);

    // 5️⃣ Création de la passation
    const passation = await Passation.create(
      {
        id_unite,
        id_sortant,
        id_entrant: entrant.id_compte,
        notes_consignes,
        nouveau_mdp_attente: hashTemp,
        statut: "EN_ATTENTE",
      },
      { transaction: t },
    );

    // 6️⃣ VERROUILLAGE DE L'UNITÉ
    await unite.update({ saisie_autorisee: 0 }, { transaction: t });

    return passation;
  });
}

/**
 * VALIDATION DE PASSATION
 * Admin uniquement
 */
async function validerPassation(id_passation, id_admin) {
  return sequelize.transaction(async (t) => {
    const passation = await Passation.findByPk(id_passation, {
      transaction: t,
    });
    if (!passation) throw new Error("Passation introuvable");

    if (passation.statut !== "EN_ATTENTE") {
      throw new Error("Cette passation n'est plus modifiable");
    }

    // 1️⃣ Activation du nouveau mot de passe
    const compteEntrant = await Compte.findByPk(passation.id_entrant, {
      transaction: t,
    });

    await compteEntrant.update(
      {
        mot_de_passe_hash: passation.nouveau_mdp_attente,
        role: "CHARGE_SPA",
        est_valide_par_admin: 1,
      },
      { transaction: t },
    );

    // 2️⃣ Mise à jour de la passation
    await passation.update(
      {
        statut: "VALIDEE",
        id_admin_validateur: id_admin,
        date_validation: new Date(),
      },
      { transaction: t },
    );

    // 3️⃣ Déverrouillage de l'unité
    await Unite.update(
      { saisie_autorisee: 1 },
      { where: { id_unite: passation.id_unite }, transaction: t },
    );

    return passation;
  });
}

/**
 * REJET DE PASSATION
 * Admin uniquement
 */
async function rejeterPassation(id_passation, id_admin) {
  return sequelize.transaction(async (t) => {
    const passation = await Passation.findByPk(id_passation, {
      transaction: t,
    });
    if (!passation) throw new Error("Passation introuvable");

    if (passation.statut !== "EN_ATTENTE") {
      throw new Error("Cette passation n'est plus modifiable");
    }

    // 1️⃣ Mise à jour passation
    await passation.update(
      {
        statut: "REJETEE",
        id_admin_validateur: id_admin,
        date_validation: new Date(),
      },
      { transaction: t },
    );

    // 2️⃣ Déverrouillage unité
    await Unite.update(
      { saisie_autorisee: 1 },
      { where: { id_unite: passation.id_unite }, transaction: t },
    );

    return passation;
  });
}

module.exports = {
  initierPassation,
  validerPassation,
  rejeterPassation,
};
