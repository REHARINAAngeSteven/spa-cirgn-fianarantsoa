const express = require('express');
const router = express.Router();

// Import des routes
const authRoutes = require('./auth.routes');
const compteRoutes = require('./compte.routes');
const militaireRoutes = require('./militaire.routes');
const referentielRoutes = require('./referentiel.routes');
const situationRoutes = require('./situation.routes');
const passationRoutes = require('./passation.routes');

// Routes publiques / auth
router.use('/auth', authRoutes);

// Routes sécurisées
router.use('/comptes', compteRoutes);
router.use('/militaires', militaireRoutes);
router.use('/referentiels', referentielRoutes);
router.use('/situations', situationRoutes);
router.use('/passations', passationRoutes);

module.exports = router;
