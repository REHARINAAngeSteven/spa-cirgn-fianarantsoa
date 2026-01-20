// src/middleware/auth.middleware.js
const { verifyToken } = require('../config/jwt');
const { Compte, Militaire } = require('../models');

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token manquant ou format invalide' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    
    // ⚠️ AJOUT : Récupération du compte avec le militaire associé
    const compte = await Compte.findByPk(decoded.id, {
      include: [{ 
        model: Militaire,
        attributes: ['id_militaire', 'id_unite', 'nom', 'prenom']
      }]
    });

    if (!compte) {
      return res.status(401).json({ message: 'Compte invalide' });
    }

    // ⚠️ AJOUT : Construction complète de req.user avec uniteId
    req.user = compte.toJSON();
    req.user.id = req.user.id_compte; // Pour cohérence avec le token
    req.user.uniteId = req.user.Militaire?.id_unite ?? null;

    next();
  } catch (err) {
    console.error('Erreur auth:', err);
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};