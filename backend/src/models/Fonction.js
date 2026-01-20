// backend/src/models/Fonction.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Fonction = sequelize.define('Fonction', {
  id_fonction: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nom_fonction: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
}, {
  tableName: 'fonctions',
  timestamps: false
});

module.exports = Fonction;
