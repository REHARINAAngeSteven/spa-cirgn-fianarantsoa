// backend/src/routes/compte.routes.js
const express = require('express');
const router = express.Router();
const compteController = require('../controllers/compte.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

router.use(auth);

// GET tous les comptes
router.get('/', role('ADMIN'), compteController.getAll);

// GET compte par ID
router.get('/:id', role('ADMIN'), compteController.getById);

// CRUD + reset uniquement Admin
router.post('/', role('ADMIN'), compteController.create);
router.put('/:id', role('ADMIN'), compteController.update);
router.delete('/:id', role('ADMIN'), compteController.delete);

// Reset mot de passe
router.post('/:id/reset-password', role('ADMIN'), compteController.resetPassword);

module.exports = router;
