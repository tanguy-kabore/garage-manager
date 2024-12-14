/**
 * Définition du modèle `Maintenance` et synchronisation avec la base de données.
 *
 * Ce module définit le modèle Sequelize pour la table `maintenances` dans la base de données.
 * Il décrit les colonnes de la table ainsi que leurs types et contraintes. 
 * Ensuite, il synchronise ce modèle avec la base de données en utilisant la méthode `sync` avec l'option `{ alter: true }`.
 *
 * Fonctionnalités :
 * - Définition du modèle `Maintenance` avec les colonnes suivantes :
 *   - `id` : Integer, clé primaire, auto-incrémentée, identifiant unique de la maintenance.
 *   - `description` : String, non nul, représente la description de la maintenance.
 *   - `status` : String, par défaut 'pending', représente le statut de la maintenance (ex : 'pending', 'completed', 'cancelled').
 *   - `start_date` : Date, non nul, représente la date de début de la maintenance.
 *   - `end_date` : Date, représente la date de fin de la maintenance.
 *   - `vehicle_id` : Integer, non nul, représente l'ID du véhicule associé (clé étrangère, en référence à un microservice externe).
 *   - `mechanic_id` : Integer, non nul, représente l'ID du mécanicien associé (clé étrangère, en référence à un microservice externe).
 *   - `amount` : Float, optionnel, montant estimé ou réel de la maintenance (doit être positif, par défaut 0.0).
 *
 * Utilise les packages suivants :
 * - `sequelize` pour définir et synchroniser les modèles de la base de données.
 * - `@config/database` pour récupérer la connexion à la base de données.
 *
 * @module maintenanceModel
 */

const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('@config/database'); // configurez votre instance de Sequelize

// Définir le modèle Maintenance
const Maintenance = sequelize.define('Maintenance', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  status: {
    type: DataTypes.STRING,
    defaultValue: 'pending', // Par exemple: 'pending', 'completed', 'cancelled'
  },
  start_date: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  end_date: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  vehicle_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // Cette clé fait référence à l'ID dans le microservice Vehicle
  },
  mechanic_id: {
    type: DataTypes.INTEGER,
    allowNull: true, // Rend le champ optionnel
    // Cette clé fait référence à l'ID dans le microservice Mechanic
  },
  amount: {
    type: DataTypes.FLOAT,
    allowNull: true, // Permet de rendre ce champ optionnel
    defaultValue: 0.0, // Valeur par défaut
    validate: {
      min: 0, // Assure que le montant est toujours positif
    },
  },
}, {
  tableName: 'maintenances', // Définir explicitement le nom de la table (optionnel)
});

/**
 * Synchronisation du modèle avec la base de données.
 *
 * Cette méthode crée ou met à jour la table `maintenances` dans la base de données
 * pour qu'elle corresponde à la définition du modèle.
 */
Maintenance.sync({ alter: true }).then(() => {
  console.log('La table "maintenances" a été créée ou mise à jour');
}).catch((err) => {
  console.error('Erreur lors de la synchronisation de la table "maintenances" :', err);
});

module.exports = Maintenance;
