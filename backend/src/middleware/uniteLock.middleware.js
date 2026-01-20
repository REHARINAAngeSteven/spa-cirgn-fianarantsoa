// backend/src/middleware/uniteLock.middleware.js

const { Unite, Passation } = require('../models');

/**
 * Middleware de verrouillage d'unité
 * Bloque les opérations SPA si :
 * - l'unité n'est pas autorisée à la saisie
 * - OU une passation EN_ATTENTE existe pour cette unité
 */
module.exports = async function uniteLock(req, res, next) {
  try {
    const user = req.user;
    const id_unite = user?.Militaire?.id_unite; // injecté par auth.middleware

    console.log("DEBUG uniteLock id_unite =", req.user?.Militaire?.id_unite);

    // ⚠️ FIX: Utiliser uniteId au lieu de id_unite
    if (!id_unite) {
      return res.status(403).json({
        success: false,
        message: "Unité de l'utilisateur non déterminée"
      });
    }

    // Vérifier l'état de l'unité
    const unite = await Unite.findByPk(id_unite);

    if (!unite) {
      return res.status(404).json({
        success: false,
        message: "Unité introuvable"
      });
    }

    // Vérifier si l'unité est bloquée administrativement
    if (!unite.saisie_autorisee) {
      return res.status(423).json({
        success: false,
        message: "Saisie SPA bloquée : unité verrouillée"
      });
    }

    // Vérifier s'il existe une passation en attente
    const passationEnCours = await Passation.findOne({
      where: {
        id_unite,
        statut: 'EN_ATTENTE'
      }
    });

    if (passationEnCours) {
      return res.status(423).json({
        success: false,
        message: "Saisie SPA bloquée : passation en cours de validation"
      });
    }

    next();

  } catch (error) {
    next(error);
  }
};