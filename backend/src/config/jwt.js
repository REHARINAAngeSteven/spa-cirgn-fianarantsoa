// src/config/jwt.js
const jwt = require('jsonwebtoken');
const { jwt: jwtConfig } = require('./env');

// Générer access token
exports.generateToken = (payload) => {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
};

// Vérifier access token
exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.secret);
  } catch (err) {
    const error = new Error('Token invalide ou expiré');
    error.status = 401;
    throw error;
  }
};

// Générer refresh token
exports.generateRefreshToken = (payload) => {
  return jwt.sign(payload, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpiresIn });
};

// Vérifier refresh token
exports.verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, jwtConfig.refreshSecret);
  } catch (err) {
    const error = new Error('Refresh token invalide ou expiré');
    error.status = 401;
    throw error;
  }
};
