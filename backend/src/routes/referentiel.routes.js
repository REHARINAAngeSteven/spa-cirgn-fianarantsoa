// backend/src/routes/referentiel.routes.js
const express = require('express');
const router = express.Router();

const ReferentielController = require('../controllers/referentiel.controller');
const auth = require('../middleware/auth.middleware');
const role = require('../middleware/role.middleware');

// ===================== 
// PROTÉGÉ : toutes les routes nécessitent auth
// =====================
router.use(auth);

// ADMIN uniquement pour CRUD
const adminRole = role('ADMIN');
const chargeRole = role('CHARGE_SPA') 


// =====================
// UNITE
// =====================
router.get('/unites', ReferentielController.getAllUnites);
router.get('/unites/:id', ReferentielController.getUniteById);
router.post('/unites', adminRole, ReferentielController.createUnite);
router.put('/unites/:id', adminRole, ReferentielController.updateUnite);
router.delete('/unites/:id', adminRole, ReferentielController.deleteUnite);

// =====================
// FONCTION
// =====================
router.get('/fonctions', ReferentielController.getAllFonctions);
router.get('/fonctions/:id', ReferentielController.getFonctionById);
router.post('/fonctions', adminRole, ReferentielController.createFonction);
router.put('/fonctions/:id', adminRole, ReferentielController.updateFonction);
router.delete('/fonctions/:id', adminRole, ReferentielController.deleteFonction);

// =====================
// MOTIF ABSENCE
// =====================
router.get('/motifs', ReferentielController.getAllMotifs);
router.get('/motifs/:id', role('CHARGE_SPA','ADMIN'), ReferentielController.getMotifById);
router.get('/motifs/type/:type', role('CHARGE_SPA','ADMIN'), ReferentielController.getMotifByType);
router.post('/motifs', adminRole, ReferentielController.createMotif);
router.put('/motifs/:id', adminRole, ReferentielController.updateMotif);
router.delete('/motifs/:id', adminRole, ReferentielController.deleteMotif);

module.exports = router;
