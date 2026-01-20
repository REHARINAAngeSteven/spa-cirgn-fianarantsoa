// backend/src/services/referentiel.service.js
const Unite = require('../models/Unite');
const Fonction = require('../models/Fonction');
const MotifAbsence = require('../models/MotifAbsence');

const referentielService = {

  // =====================
  // UNITE
  // =====================
  getAllUnites: async () => {
    return Unite.findAll();
  },

  getUniteById: async (id) => {
    const unite = await Unite.findByPk(id);
    if (!unite) {
      const err = new Error('Unité non trouvée');
      err.status = 404;
      throw err;
    }
    return unite;
  },

  createUnite: async (data) => {
    return Unite.create(data);
  },

  updateUnite: async (id, data) => {
    const unite = await Unite.findByPk(id);
    if (!unite) {
      const err = new Error('Unité non trouvée');
      err.status = 404;
      throw err;
    }
    return unite.update(data);
  },

  deleteUnite: async (id) => {
    const unite = await Unite.findByPk(id);
    if (!unite) {
      const err = new Error('Unité non trouvée');
      err.status = 404;
      throw err;
    }
    return unite.destroy();
  },

  // =====================
  // FONCTION
  // =====================
  getAllFonctions: async () => {
    return Fonction.findAll();
  },

  getFonctionById: async (id) => {
    const fonction = await Fonction.findByPk(id);
    if (!fonction) {
      const err = new Error('Fonction non trouvée');
      err.status = 404;
      throw err;
    }
    return fonction;
  },

  createFonction: async (data) => {
    return Fonction.create(data);
  },

  updateFonction: async (id, data) => {
    const fonction = await Fonction.findByPk(id);
    if (!fonction) {
      const err = new Error('Fonction non trouvée');
      err.status = 404;
      throw err;
    }
    return fonction.update(data);
  },

  deleteFonction: async (id) => {
    const fonction = await Fonction.findByPk(id);
    if (!fonction) {
      const err = new Error('Fonction non trouvée');
      err.status = 404;
      throw err;
    }
    return fonction.destroy();
  },

  // =====================
  // MOTIF ABSENCE
  // =====================
  getAllMotifs: async () => {
    return MotifAbsence.findAll();
  },

  getMotifById: async (id) => {
    const motif = await MotifAbsence.findByPk(id);
    if (!motif) {
      const err = new Error('Motif non trouvé');
      err.status = 404;
      throw err;
    }
    return motif;
  },

  getMotifByType: async (type) => {
    const motif = await MotifAbsence.findAll(
        { where: {type_motif: type} }
    );
    if (!motif) {
      const err = new Error('Aucun motif de ce type trouvé');
      err.status = 404;
      throw err;
    }
    return motif;
  },

  createMotif: async (data) => {
    return MotifAbsence.create(data);
  },

  updateMotif: async (id, data) => {
    const motif = await MotifAbsence.findByPk(id);
    if (!motif) {
      const err = new Error('Motif non trouvé');
      err.status = 404;
      throw err;
    }
    return motif.update(data);
  },

  deleteMotif: async (id) => {
    const motif = await MotifAbsence.findByPk(id);
    if (!motif) {
      const err = new Error('Motif non trouvé');
      err.status = 404;
      throw err;
    }
    return motif.destroy();
  }
};

module.exports = referentielService;
