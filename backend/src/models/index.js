// backend/src/models/index.js
const sequelize = require('../config/database');

// Import des modèles
const Unite = require('./Unite');
const Fonction = require('./Fonction');
const Militaire = require('./Militaire');
const Compte = require('./Compte');
const MotifAbsence = require('./MotifAbsence');
const Passation = require('./Passation');
const SituationSPA = require('./SituationSPA');

// ---------------------
// RELATIONS CENTRALES
// ---------------------

// Militaire → Unite / Fonction
Militaire.belongsTo(Unite, { foreignKey: 'id_unite' });
Unite.hasMany(Militaire, { foreignKey: 'id_unite' });

Militaire.belongsTo(Fonction, { foreignKey: 'id_fonction' });
Fonction.hasMany(Militaire, { foreignKey: 'id_fonction' });

// Compte → Militaire
Compte.belongsTo(Militaire, { foreignKey: 'id_militaire' });
Militaire.hasOne(Compte, { foreignKey: 'id_militaire' });

// Passation → Unite & Comptes
Passation.belongsTo(Unite, { foreignKey: 'id_unite' });
Unite.hasMany(Passation, { foreignKey: 'id_unite' });

Passation.belongsTo(Compte, { as: 'sortant', foreignKey: 'id_sortant' });
Passation.belongsTo(Compte, { as: 'entrant', foreignKey: 'id_entrant' });
Passation.belongsTo(Compte, { as: 'adminValidateur', foreignKey: 'id_admin_validateur' });

// SituationSPA → Militaire, MotifAbsence, Compte
SituationSPA.belongsTo(Militaire, { foreignKey: 'id_militaire' });
Militaire.hasMany(SituationSPA, { foreignKey: 'id_militaire' });

SituationSPA.belongsTo(MotifAbsence, { foreignKey: 'id_motif' });
MotifAbsence.hasMany(SituationSPA, { foreignKey: 'id_motif' });

SituationSPA.belongsTo(Compte, { foreignKey: 'enregistre_par' });
Compte.hasMany(SituationSPA, { foreignKey: 'enregistre_par' });

// ---------------------
// EXPORT
// ---------------------
const db = {
  sequelize,
  Sequelize: require('sequelize'),
  Unite,
  Fonction,
  Militaire,
  Compte,
  MotifAbsence,
  Passation,
  SituationSPA
};

// Optionnel : synchroniser la base (à utiliser uniquement au développement !)
//db.sequelize.sync({ alter: true })
  // .then(() => console.log('Base synchronisée avec succès !'))
  // .catch(err => console.error('Erreur de synchronisation :', err));

module.exports = db;
