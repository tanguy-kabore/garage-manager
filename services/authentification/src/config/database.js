/**
 * Configuration et connexion à la base de données MySQL pour l'authentification.
 *
 * Ce module configure la connexion à la base de données `garage_auth` à l'aide de Sequelize.
 * Il charge les variables d'environnement via `dotenv` pour s'assurer que les informations
 * sensibles (comme les identifiants de la base de données) ne sont pas en dur dans le code source.
 *
 * Fonctionnalités :
 * - Utilisation de Sequelize pour la connexion à la base de données MySQL.
 * - Connexion sécurisée avec les paramètres de base de données (nom, utilisateur, mot de passe, etc.).
 * - Connexion à l'instance de base de données et gestion des erreurs en cas de problème de connexion.
 *
 * Variables d'environnement attendues dans le fichier `.env` :
 * - `DB_NAME` : Nom de la base de données (par défaut : `garage_auth`).
 * - `DB_USER` : Nom d'utilisateur pour la base de données (par défaut : `root`).
 * - `DB_PASSWORD` : Mot de passe pour la base de données (par défaut : `root`).
 * - `DB_HOST` : Hôte de la base de données (par défaut : `localhost`).
 *
 * Le module exporte l'instance `sequelize` pour être utilisée ailleurs dans l'application.
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Chargement des variables d'environnement depuis le fichier .env
const DB_NAME = process.env.DB_NAME || 'garage_auth';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_DIALECT = process.env.DB_DIALECT || 'mysql';

// Création de l'instance Sequelize avec les informations de connexion à la base de données
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false, // Désactivation des logs des requêtes SQL
});

// Test de la connexion et gestion des erreurs
sequelize.authenticate()
  .then(() => console.log('Connection to Auth DB successful.'))
  .catch(err => console.error('Auth DB connection error:', err));

// Exportation de l'instance Sequelize pour utilisation ailleurs dans l'application
module.exports = sequelize;
