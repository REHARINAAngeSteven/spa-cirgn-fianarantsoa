// src/controllers/situation.controller.js

const SituationService = require("../services/situation.service");
const { success } = require("../utils/response");

class SituationController {

  // Créer ou mettre à jour la situation
  static async createOrUpdate(req, res, next) {
    try {
      const situation = await SituationService.createOrUpdate(req.user, req.body);
      return success(res, "Situation enregistrée", situation);
    } catch (err) {
      next(err);
    }
  }

  // Récupérer les situations pour l'unité et une date
  static async getByDate(req, res, next) {
    try {
      const date = req.query.date;
      if (!date) return res.status(400).json({ message: "Date requise" });

      const situations = await SituationService.getByDateAndUnite(req.user, date);
      return success(res, "Situations récupérées", situations);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = SituationController;
