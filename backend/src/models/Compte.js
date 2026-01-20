// backend/src/models/Compte.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Militaire = require('./Militaire');

const Compte = sequelize.define('Compte', {
  id_compte: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_militaire: {
    type: DataTypes.INTEGER,
    allowNull: false,
    unique: true
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  mot_de_passe_hash: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('ADMIN', 'CHARGE_SPA', 'MILITAIRE'),
    allowNull: false
  },
  est_valide_par_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'comptes',
  timestamps: false
});

module.exports = Compte;
