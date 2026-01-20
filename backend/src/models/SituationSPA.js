// backend/src/models/SituationSPA.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Militaire = require('./Militaire');
const MotifAbsence = require('./MotifAbsence');
const Compte = require('./Compte');

const SituationSPA = sequelize.define('SituationSPA', {
  id_spa: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  id_militaire: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date_situation: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  est_present: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  id_motif: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  commentaire: {
    type: DataTypes.TEXT
  },
  est_previsionnel: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  enregistre_par: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  date_enregistrement: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'situation_spa',
  timestamps: false,
  indexes: [
    {
      unique: true,
      fields: ['id_militaire', 'date_situation']
    }
  ]
});


module.exports = SituationSPA;
