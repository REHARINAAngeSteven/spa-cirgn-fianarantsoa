// backend/src/services/situation.service.js

const { SituationSPA, MotifAbsence, Militaire } = require("../models");

class SituationService {

  static async createOrUpdate(user, data) {
    const militaire = await Militaire.findByPk(data.idMilitaire);
    if (!militaire) throw new Error("Militaire introuvable");

    if (militaire.id_unite !== user.uniteId) {
      throw new Error("Vous ne pouvez saisir que les militaires de votre unité");
    }

    let est_present = 1;
    let id_motif = null;

    if (data.motifId) {
      const motif = await MotifAbsence.findByPk(data.motifId);
      if (!motif) throw new Error("Motif introuvable");
      id_motif = motif.id_motif;

      // ⚠️ FIX: Utiliser type_motif au lieu de type
      if (motif.type_motif === "absent") est_present = 0;
      else if (motif.type_motif === "indisponible") est_present = 1;
    }

    // Upsert pour créer ou mettre à jour
    const [situation, created] = await SituationSPA.upsert(
      {
        id_militaire: data.idMilitaire,
        date_situation: data.date_situation,
        est_present,
        id_motif,
        commentaire: data.commentaire || null,
        est_previsionnel: data.est_previsionnel || 0,
        enregistre_par: user.id
      },
      { returning: true }
    );

    return situation;
  }

  static async getByDateAndUnite(user, date) {
    return await SituationSPA.findAll({
      where: { date_situation: date },
      include: [
        {
          model: Militaire,
          where: { id_unite: user.uniteId }
        },
        MotifAbsence
      ],
      order: [["id_spa", "ASC"]]
    });
  }
}

module.exports = SituationService;