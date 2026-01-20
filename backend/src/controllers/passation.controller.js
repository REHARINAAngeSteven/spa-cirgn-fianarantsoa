// backend/src/controllers/passation.controller.js

const passationService = require('../services/passation.service');

module.exports = {

  /**
   * Chargé SPA sortant
   */
  async initier(req, res, next) {
    try {
      const result = await passationService.initierPassation({
        id_sortant: req.user.id_compte,
        id_entrant: req.body.id_entrant,
        id_unite: req.user.Militaire.id_unite,
        notes_consignes: req.body.notes_consignes,
        nouveau_mdp: req.body.nouveau_mdp
      });

      res.status(201).json({
        success: true,
        message: "Passation initiée avec succès",
        data: result
      });

    } catch (err) {
      next(err);
    }
  },

  /**
   * Admin
   */
  async valider(req, res, next) {
    try {
      const result = await passationService.validerPassation(
        req.params.id,
        req.user.id_compte
      );

      res.json({
        success: true,
        message: "Passation validée",
        data: result
      });

    } catch (err) {
      next(err);
    }
  },

  /**
   * Admin
   */
  async rejeter(req, res, next) {
    try {
      const result = await passationService.rejeterPassation(
        req.params.id,
        req.user.id_compte
      );

      res.json({
        success: true,
        message: "Passation rejetée",
        data: result
      });

    } catch (err) {
      next(err);
    }
  }

};
