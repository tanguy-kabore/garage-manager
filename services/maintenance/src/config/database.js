/**
 * Configuration et connexion à la base de données `garage_maintenance`.
 *
 * Ce fichier configure la connexion à la base de données MySQL `garage_maintenance` 
 * à l'aide de Sequelize, un ORM pour Node.js. Il charge la configuration de la base de données 
 * à partir du fichier `.env` et établit la connexion avec les informations fournies.
 *
 * Fonctionnalités :
 * - Connexion à la base de données `garage_maintenance` avec les identifiants définis (nom de la base de données, utilisateur, mot de passe).
 * - Authentification de la connexion à la base de données et affichage d'un message de succès dans la console.
 * - Synchronisation des modèles avec la base de données, en utilisant l'option `alter: true` pour ajuster la table sans la recréer complètement.
 * - En cas d'erreur lors de la connexion ou de la synchronisation, un message d'erreur est affiché dans la console.
 *
 * Utilise les packages suivants :
 * - `sequelize` pour la gestion des modèles et de la connexion à la base de données.
 * - `dotenv` pour charger la configuration de la base de données à partir du fichier `.env` et des variables d'environnement.
 *
 * Note : La méthode `sequelize.sync({ alter: true })` est utilisée pour synchroniser la table avec la base de données.
 * Pour recréer complètement la table à chaque démarrage, l'option `{ force: true }` peut être utilisée (attention aux données perdues).
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();  // Charger les variables d'environnement depuis le fichier .env

// Récupérer les variables d'environnement pour la connexion à la base de données
const dbHost = process.env.DB_HOST;
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;
const dbName = process.env.DB_NAME;
const dbDialect = process.env.DB_DIALECT;

// Créer la connexion à la base de données avec Sequelize
const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  dialect: dbDialect,
  logging: false,  // Désactiver les logs SQL (facultatif)
});

// Vérification de la connexion à la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Connection to Maintenance DB successful.');
    return sequelize.sync({ alter: true });  // Utiliser { force: true } pour recréer complètement la table (attention aux données perdues)
  })
  .then(() => console.log('Tables synchronized successfully.'))
  .catch(err => {
    console.error('Unable to connect to the Maintenance DB:', err);
  });

// Exporter l'instance de Sequelize pour utilisation dans d'autres modules
module.exports = sequelize;
