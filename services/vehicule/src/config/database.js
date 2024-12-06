/**
 * Configuration et connexion à la base de données `garage_vehicule`.
 *
 * Ce fichier configure la connexion à la base de données MySQL `garage_vehicule` 
 * à l'aide de Sequelize, un ORM pour Node.js. Il charge la configuration de la base de données 
 * à partir du fichier `.env` et établit la connexion avec les informations fournies.
 *
 * Fonctionnalités :
 * - Connexion à la base de données `garage_vehicule` avec les identifiants définis (nom de la base de données, utilisateur, mot de passe).
 * - Authentification de la connexion à la base de données et affichage d'un message de succès dans la console.
 * - Synchronisation des modèles avec la base de données, en utilisant l'option `alter: true` pour ajuster la table sans la recréer complètement.
 * - En cas d'erreur lors de la connexion ou de la synchronisation, un message d'erreur est affiché dans la console.
 *
 * Utilise les packages suivants :
 * - `sequelize` pour la gestion des modèles et de la connexion à la base de données.
 * - `dotenv` pour charger la configuration de la base de données à partir du fichier `.env`.
 *
 * Note : La méthode `sequelize.sync({ alter: true })` est utilisée pour synchroniser la table `vehicules` avec la base de données.
 * Pour recréer complètement la table à chaque démarrage, l'option `{ force: true }` peut être utilisée (attention aux données perdues).
 */
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Récupérer les variables d'environnement
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbDialect = process.env.DB_DIALECT;

// Créer la connexion à la base de données
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDialect,
  logging: false, // Désactiver les logs SQL (facultatif)
});

// Vérification de la connexion à la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Connection to Vehicule DB successful.');
    return sequelize.sync({ alter: true }); // Utilisez { force: true } pour recréer complètement la table
  })
  .then(() => console.log('Table `vehicules` synchronized.'))
  .catch(err => console.error('Vehicule DB connection error:', err));

module.exports = sequelize;

