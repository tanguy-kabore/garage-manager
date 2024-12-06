/**
 * Configuration et initialisation de la base de données `garage_user` avec Sequelize.
 *
 * Ce module configure et établit une connexion à la base de données `garage_user`
 * en utilisant Sequelize, synchronise la table `users` et exporte l'instance Sequelize.
 * 
 * - Nom de la base de données : `garage_user` (chargé depuis l'env)
 * - Nom d'utilisateur : `root` (chargé depuis l'env)
 * - Mot de passe : `root` (chargé depuis l'env)
 * - Hôte : `localhost` (chargé depuis l'env)
 * - Dialecte : `mysql` (chargé depuis l'env)
 *
 * Les variables d'environnement sont chargées depuis un fichier `.env` grâce au module `dotenv`.
 */

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Chargement des variables d'environnement depuis .env
const DB_NAME = process.env.DB_NAME || 'garage_user';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASSWORD = process.env.DB_PASSWORD || 'root';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_DIALECT = process.env.DB_DIALECT || 'mysql';

// Création d'une instance Sequelize avec la configuration de la base de données
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
  host: DB_HOST,
  dialect: DB_DIALECT,
  logging: false, // Désactive les logs des requêtes SQL pour une sortie plus propre
});

// Test de la connexion et synchronisation de la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données User réussie.');
    return sequelize.sync({ alter: true }); // Synchronise les tables avec la base de données
  })
  .then(() => console.log('Table `users` synchronisée.'))
  .catch(err => console.error('Erreur de connexion à la base de données User :', err));

// Exportation de l'instance Sequelize pour utilisation dans d'autres modules
module.exports = sequelize;
