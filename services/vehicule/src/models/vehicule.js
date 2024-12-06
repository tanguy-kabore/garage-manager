const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('@config/database');

// Définir le modèle Véhicule
const Vehicule = sequelize.define('Vehicule', {
  marque: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true, // Validation supplémentaire
    },
  },
  modele: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
    },
  },
  annee: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true, // Vérifie que la valeur est un entier
      min: 1900, // Exemples de validations supplémentaires
      max: new Date().getFullYear(),
    },
  },
  num_immatriculation: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true, // Contraintes d'unicité
    validate: {
      notEmpty: true,
    },
  },
  kilometrage: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
      min: 0, // Kilométrage minimum
    },
  },
  proprietaire_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true,
    },
  },
});

// Synchronisation avec la base de données
(async () => {
  try {
    // Utilisez `sync` uniquement si nécessaire
    await sequelize.authenticate();
    console.log('Connexion à la base de données réussie.');
    await Vehicule.sync(); // Eviter { alter: true } en production
    console.log('Table Véhicules synchronisée avec succès.');
  } catch (error) {
    console.error('Erreur lors de la synchronisation :', error);
  }
})();

module.exports = Vehicule;
