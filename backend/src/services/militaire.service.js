// backend/src/services/militaire.service.js
const { Militaire, Unite, Fonction, Compte } = require('../models');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

exports.getAll = async (user) => {
  const militaires = await Militaire.findAll({
    include: [
      { model: Unite, attributes: ['id_unite', 'nom_unite'] },
      { model: Fonction, attributes: ['id_fonction', 'nom_fonction'] },
      { model: Compte, attributes: ['id_compte', 'login', 'role', 'est_valide_par_admin'], required: false }
    ]
  });
  return militaires;
};

exports.getAllByAdmin = async (user) => {

  let where = {};

  if (user.role === 'CHARGE_SPA') {
    if (!user.uniteId) {
      const err = new Error("Unité non associée au compte");
      err.status = 403;
      throw err;
    }
    where.id_unite = user.uniteId;
  }

  return Militaire.findAll({
    where,
    include: [
      { model: Unite, attributes: ['id_unite', 'nom_unite'] },
      { model: Fonction, attributes: ['id_fonction', 'nom_fonction'] },
      { model: Compte, attributes: ['id_compte', 'login', 'role', 'est_valide_par_admin'], required: false }
    ]
  });
};


exports.getById = async (id, user) => {
  const militaire = await Militaire.findByPk(id, {
    include: [
      { model: Unite, attributes: ['id_unite', 'nom_unite'] },
      { model: Fonction, attributes: ['id_fonction', 'nom_fonction'] },
      { model: Compte, attributes: ['id_compte', 'login', 'role', 'est_valide_par_admin'], required: false }
    ]
  });

  if (!militaire) {
    const err = new Error('Militaire non trouvé');
    err.status = 404;
    throw err;
  }

  // ⚠️ FIX: Utiliser uniteId au lieu de id_unite
  // Sécurisation pour les chargés SPA : accès uniquement à son unité
  if (user.role === 'CHARGE_SPA' && militaire.id_unite !== user.uniteId) {
    const err = new Error("Accès refusé à cette unité");
    err.status = 403;
    throw err;
  }

  return militaire;
};

exports.create = async (data) => {
  const militaire = await Militaire.create(data);
  return militaire;
};

exports.update = async (id, data, user) => {
  const militaire = await exports.getById(id, user);
  await militaire.update(data);
  return militaire;
};

exports.delete = async (id) => {
  const militaire = await Militaire.findByPk(id);
  if (!militaire) throw new Error('Militaire non trouvé');
  await militaire.destroy();
  return true;
};