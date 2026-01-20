// backend/src/models/Militaire.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Unite = require('./Unite');
const Fonction = require('./Fonction');

const Militaire = sequelize.define('Militaire', {
  id_militaire: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  im: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  nom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  prenom: {
    type: DataTypes.STRING,
    allowNull: false
  },
  cin: {
    type: DataTypes.STRING(15),
    allowNull: false
  },
  id_unite: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_fonction: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  est_actif: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'militaires',
  timestamps: false
});

module.exports = Militaire;
