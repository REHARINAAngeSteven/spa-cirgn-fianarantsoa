// backend/src/models/Unite.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Unite = sequelize.define('Unite', {
  id_unite: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom_unite: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  saisie_autorisee: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'unites',
  timestamps: false
});

module.exports = Unite;
