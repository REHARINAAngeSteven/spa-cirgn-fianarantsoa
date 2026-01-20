// backend/src/controllers/referentiel.controller.js
const referentielService = require('../services/referentiel.service');

const ReferentielController = {

  // =====================
  // UNITE
  // =====================
  getAllUnites: async (req, res, next) => {
    try {
      const result = await referentielService.getAllUnites();
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  getUniteById: async (req, res, next) => {
    try {
      const result = await referentielService.getUniteById(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  createUnite: async (req, res, next) => {
    try {
      const result = await referentielService.createUnite(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  updateUnite: async (req, res, next) => {
    try {
      const result = await referentielService.updateUnite(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  deleteUnite: async (req, res, next) => {
    try {
      const result = await referentielService.deleteUnite(req.params.id);
      res.json({ message: 'Unité supprimée' });
    } catch (err) {
      next(err);
    }
  },

  // =====================
  // FONCTION
  // =====================
  getAllFonctions: async (req, res, next) => {
    try {
      const result = await referentielService.getAllFonctions();
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  getFonctionById: async (req, res, next) => {
    try {
      const result = await referentielService.getFonctionById(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  createFonction: async (req, res, next) => {
    try {
      const result = await referentielService.createFonction(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  updateFonction: async (req, res, next) => {
    try {
      const result = await referentielService.updateFonction(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  deleteFonction: async (req, res, next) => {
    try {
      const result = await referentielService.deleteFonction(req.params.id);
      res.json({ message: 'Fonction supprimée' });
    } catch (err) {
      next(err);
    }
  },

  // =====================
  // MOTIF ABSENCE
  // =====================
  getAllMotifs: async (req, res, next) => {
    try {
      const result = await referentielService.getAllMotifs();
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  getMotifById: async (req, res, next) => {
    try {
      const result = await referentielService.getMotifById(req.params.id);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  getMotifByType: async (req, res, next) => {
    try {
      const result = await referentielService.getMotifByType(req.params.type);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  createMotif: async (req, res, next) => {
    try {
      const result = await referentielService.createMotif(req.body);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  },

  updateMotif: async (req, res, next) => {
    try {
      const result = await referentielService.updateMotif(req.params.id, req.body);
      res.json(result);
    } catch (err) {
      next(err);
    }
  },

  deleteMotif: async (req, res, next) => {
    try {
      const result = await referentielService.deleteMotif(req.params.id);
      res.json({ message: 'Motif supprimé' });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = ReferentielController;