// backend/src/services/auth.services.js
const bcrypt = require('bcryptjs');
const Compte = require('../models/Compte');
const Militaire = require('../models/Militaire');
const { generateToken, generateRefreshToken, verifyRefreshToken } = require('../config/jwt');

exports.login = async (login, motDePasse) => {
  const compte = await Compte.findOne({ where: { login } });
  console.log("Tentative de connexion pour le login :", login);
  if (!compte) {
    const err = new Error('Identifiants invalides');
    err.status = 401;
    throw err;
  }

  if (!compte.est_valide_par_admin) {
    const err = new Error('Compte non validé par l\'admin');
    err.status = 403;
    throw err;
  }

  console.log('Hash DB:', compte.mot_de_passe_hash, 'Mot de passe reçu:', motDePasse);

  const isMatch = await bcrypt.compare(motDePasse, compte.mot_de_passe_hash);

  if (!isMatch) {
    const err = new Error('Identifiants invalides');
    err.status = 401;
    throw err;
  }

  const accessToken = generateToken({ id: compte.id_compte, role: compte.role });
  const refreshToken = generateRefreshToken({ id: compte.id_compte });

  return {
    accessToken,
    refreshToken,
    compte: {
      id: compte.id_compte,
      login: compte.login,
      role: compte.role
    }
  };
};

exports.getMe = async (id) => {
  const compte = await Compte.findByPk(id, {
    attributes: ['id_compte', 'id_militaire', 'login', 'role', 'est_valide_par_admin'],
    include: [{
      model: Militaire,
      attributes: ['id_militaire', 'id_unite', 'nom', 'prenom']
    }]
  });

  if (!compte) {
    const err = new Error('Utilisateur non trouvé');
    err.status = 404;
    throw err;
  }

  return {
    id_compte: compte.id_compte,
    id_militaire: compte.id_militaire,
    login: compte.login,
    role: compte.role,
    est_valide_par_admin: compte.est_valide_par_admin,
    unite_id: compte.Militaire?.id_unite,
  };
};

exports.refreshToken = async (refreshToken) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);
    const accessToken = generateToken({ id: decoded.id });
    const newRefreshToken = generateRefreshToken({ id: decoded.id });

    return { accessToken, refreshToken: newRefreshToken };
  } catch (err) {
    const error = new Error('Refresh token invalide ou expiré');
    error.status = 401;
    throw error;
  }
};