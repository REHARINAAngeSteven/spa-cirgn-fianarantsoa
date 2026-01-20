// backend/src/routes/passation.routes.js

const express = require('express');
const router = express.Router();

const passationController = require('../controllers/passation.controller');
const authMiddleware = require('../middleware/auth.middleware');
const roleMiddleware = require('../middleware/role.middleware');
const uniteLockMiddleware = require('../middleware/uniteLock.middleware');

/**
 * INITIER PASSATION
 * - Rôle : CHARGE_SPA
 * - Middleware : auth + role + uniteLock
 */
router.post(
  '/',
  authMiddleware,                   // vérifie JWT
  roleMiddleware('CHARGE_SPA'),   // uniquement chargé SPA
  uniteLockMiddleware,              // vérifie si unité non verrouillée
  passationController.initier
);

/**
 * VALIDER PASSATION
 * - Rôle : ADMIN
 */
router.put(
  '/:id/valider',
  authMiddleware,
  roleMiddleware('ADMIN'),
  passationController.valider
);

/**
 * REJETER PASSATION
 * - Rôle : ADMIN
 */
router.put(
  '/:id/rejeter',
  authMiddleware,
  roleMiddleware('ADMIN'),
  passationController.rejeter
);

/**
 * GET LISTE PASSATIONS (optionnel)
 * - Rôle : ADMIN uniquement
 * - Pour affichage dans centre de validation
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware('ADMIN'),
  async (req, res, next) => {
    try {
      const { Passation } = require('../models');
      const passations = await Passation.findAll({
        order: [['date_creation', 'DESC']]
      });
      res.json({ success: true, data: passations });
    } catch (err) {
      next(err);
    }
  }
);

module.exports = router;
