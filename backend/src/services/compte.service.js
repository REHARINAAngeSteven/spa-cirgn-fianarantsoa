// backend/src/services/compte.service.js
const { Compte, Militaire } = require('../models');
const bcrypt = require('bcryptjs');

exports.getAll = async (user) => {
  // Chargé SPA : ne voit que les comptes de son unité
  const where = {};
  if (user.role === 'CHARGE_SPA') {
    where['$Militaire.id_unite$'] = user.id_unite;
  }

  const comptes = await Compte.findAll({
    where,
    include: [
      { model: Militaire, attributes: ['id_militaire', 'nom', 'prenom', 'id_unite'] }
    ]
  });

  return comptes;
};

exports.getById = async (id, user) => {
  const compte = await Compte.findByPk(id, {
    include: [
      { model: Militaire, attributes: ['id_militaire', 'nom', 'prenom', 'id_unite'] }
    ]
  });

  if (!compte) {
    const err = new Error('Compte non trouvé');
    err.status = 404;
    throw err;
  }

  // Sécurisation pour Chargé SPA : accès uniquement à son unité
  if (user.role === 'CHARGE_SPA' && compte.Militaire.id_unite !== user.id_unite) {
    const err = new Error("Accès refusé à cette unité");
    err.status = 403;
    throw err;
  }

  return compte;
};

exports.create = async (data) => {
  // Hash du mot de passe
  const hash = await bcrypt.hash(data.motDePasse, 10);
  const compte = await Compte.create({
    ...data,
    mot_de_passe_hash: hash
  });
  return compte;
};

exports.update = async (id, data, user) => {
  const compte = await exports.getById(id, user);

  if (data.motDePasse) {
    data.mot_de_passe_hash = await bcrypt.hash(data.motDePasse, 10);
    delete data.motDePasse;
  }

  await compte.update(data);
  return compte;
};

exports.delete = async (id) => {
  const compte = await Compte.findByPk(id);
  if (!compte) throw new Error('Compte non trouvé');
  await compte.destroy();
  return true;
};

exports.resetPassword = async (id, newPassword) => {
  const compte = await Compte.findByPk(id);
  if (!compte) throw new Error('Compte non trouvé');

  const hash = await bcrypt.hash(newPassword, 10);
  compte.mot_de_passe_hash = hash;
  await compte.save();

  return compte;
};
