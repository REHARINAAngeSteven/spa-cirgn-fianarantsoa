// backend/src/controllers/militaire.controller.js
const militaireService = require('../services/militaire.service');

exports.getAll = async (req, res, next) => {
  try {
    const militaires = await militaireService.getAll(req.user);
    res.json({ success: true, data: militaires });
  } catch (err) {
    next(err);
  }
};

exports.getAllByAdmin = async (req, res, next) => {
  try {
    const militaires = await militaireService.getAllByAdmin(req.user);
    res.json({ success: true, data: militaires });
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const militaire = await militaireService.getById(req.params.id, req.user);
    res.json({ success: true, data: militaire });
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const militaire = await militaireService.create(req.body);
    res.json({ success: true, data: militaire });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const militaire = await militaireService.update(req.params.id, req.body, req.user);
    res.json({ success: true, data: militaire });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    await militaireService.delete(req.params.id);
    res.json({ success: true, message: 'Militaire supprimé avec succès' });
  } catch (err) {
    next(err);
  }
};
