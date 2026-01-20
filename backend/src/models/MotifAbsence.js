// backend/src/models/MotifAbsence.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const MotifAbsence = sequelize.define('MotifAbsence', {
  id_motif: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  libelle: {
    type: DataTypes.STRING,
    allowNull: false
  },
  type_motif: {
    type: DataTypes.ENUM('absent', 'indisponible'),
    allowNull: false
  }
}, {
  tableName: 'motifs_absence',
  timestamps: false
});

module.exports = MotifAbsence;
