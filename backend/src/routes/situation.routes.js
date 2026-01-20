// src/routes/situation.routes.js

const express = require("express");
const router = express.Router();

const SituationController = require("../controllers/situation.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");
const uniteLock = require("../middleware/uniteLock.middleware");

// Toutes les routes nécessitent authentification
router.use(auth);

// Seul le Chargé SPA
router.use(role("CHARGE_SPA"));

// Créer ou mettre à jour une situation
router.post(
    "/",
    uniteLock,
    SituationController.createOrUpdate);

// Récupérer toutes les situations d'une unité pour une date
router.get(
    "/",
    SituationController.getByDate);

module.exports = router;
