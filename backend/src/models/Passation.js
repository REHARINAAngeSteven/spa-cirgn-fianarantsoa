// backend/src/models/Passation.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Unite = require('./Unite');
const Compte = require('./Compte');

const Passation = sequelize.define('Passation', {
  id_passation: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_unite: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_sortant: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_entrant: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  notes_consignes: {
    type: DataTypes.TEXT
  },
  nouveau_mdp_attente: {
    type: DataTypes.STRING
  },
  statut: {
    type: DataTypes.ENUM('EN_ATTENTE', 'VALIDEE', 'REJETEE'),
    defaultValue: 'EN_ATTENTE'
  },
  date_creation: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  id_admin_validateur: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  date_validation: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'passations',
  timestamps: false
});


module.exports = Passation;
