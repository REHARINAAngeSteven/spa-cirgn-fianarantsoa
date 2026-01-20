// backend/src/routes/militaire.routes.js
const express = require('express');
const router = express.Router();
const militaireController = require('../controllers/militaire.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.use(auth);

// ⚠️ FIX: Une seule route GET / qui gère les deux rôles
// Le controller décide quelle méthode appeler selon le rôle
router.get('/', role('ADMIN', 'CHARGE_SPA'), async (req, res, next) => {
  if (req.user.role === 'ADMIN') {
    return militaireController.getAll(req, res, next);
  } else {
    return militaireController.getAllByAdmin(req, res, next);
  }
});

// GET un militaire
router.get('/:id', role('ADMIN', 'CHARGE_SPA'), militaireController.getById);

// CRUD uniquement Admin
router.post('/', role('ADMIN'), militaireController.create);
router.put('/:id', role('ADMIN'), militaireController.update);
router.delete('/:id', role('ADMIN'), militaireController.delete);

module.exports = router;