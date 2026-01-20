// src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // charge le .env à la racine du projet

// Création de la connexion Sequelize
const sequelize = new Sequelize(
  process.env.DB_NAME,   // nom de la base
  process.env.DB_USER,   // utilisateur
  process.env.DB_PASS,   // mot de passe
  {
    host: process.env.DB_HOST, // host
    dialect: 'mysql',
    logging: console.log,      // affiche les requêtes SQL
  }
);

// Test de connexion
sequelize.authenticate()
  .then(() => console.log('✅ Connecté à la base MySQL'))
  .catch(err => console.error('❌ Impossible de se connecter :', err));

module.exports = sequelize;
