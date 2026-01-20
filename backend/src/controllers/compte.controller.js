// backend/src/controllers/compte.controller.js
const compteService = require('../services/compte.service');

exports.getAll = async (req, res, next) => {
  try {
    const comptes = await compteService.getAll(req.user);
    res.json({ success: true, data: comptes });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const compte = await compteService.getById(req.params.id, req.user);
    res.json({ success: true, data: compte });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const compte = await compteService.create(req.body);
    res.json({ success: true, data: compte });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const compte = await compteService.update(req.params.id, req.body, req.user);
    res.json({ success: true, data: compte });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await compteService.delete(req.params.id);
    res.json({ success: true, message: 'Compte supprimé avec succès' });
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const compte = await compteService.resetPassword(req.params.id, req.body.newPassword);
    res.json({ success: true, data: compte, message: 'Mot de passe réinitialisé' });
  } catch (err) {
    next(err);
  }
};
