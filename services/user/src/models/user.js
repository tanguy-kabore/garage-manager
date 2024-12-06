/**
 * Modèle Sequelize pour la table `User`.
 *
 * Ce fichier définit la structure du modèle utilisateur avec Sequelize, 
 * comprenant les champs nécessaires, leurs types, et les validations associées.
 *
 * Champs :
 * - `id` : Identifiant unique de l'utilisateur, entier auto-incrémenté.
 * - `firstName` : Prénom de l'utilisateur (obligatoire, chaîne de caractères).
 * - `lastName` : Nom de famille de l'utilisateur (obligatoire, chaîne de caractères).
 * - `address` : Adresse de l'utilisateur (optionnelle, chaîne de caractères).
 * - `email` : Adresse e-mail de l'utilisateur (obligatoire, unique, format e-mail valide).
 * - `password` : Mot de passe de l'utilisateur (obligatoire, chaîne de caractères).
 * - `role` : Rôle de l'utilisateur (obligatoire, soit `client` soit `mécanicien`).
 *
 * Le modèle est ensuite exporté pour être utilisé dans d'autres parties de l'application.
 */

const { DataTypes } = require('sequelize');
const sequelize = require('@config/database');

// Définition du modèle `User`
const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true, // Génère automatiquement une valeur incrémentée
    },
    firstName: {
        type: DataTypes.STRING,
        allowNull: false, // Champ obligatoire
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false, // Champ obligatoire
    },
    address: {
        type: DataTypes.STRING,
        allowNull: true, // Champ optionnel
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false, // Champ obligatoire
        unique: true, // Doit être unique
        validate: {
            isEmail: true, // Validation pour un format e-mail valide
        },
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false, // Champ obligatoire
    },
    role: {
        type: DataTypes.ENUM('client', 'mecanicien'), // Rôles possibles
        allowNull: false, // Champ obligatoire
        validate: {
            isIn: [['client', 'mecanicien']], // Validation des valeurs possibles
        },
    },
}, {
    timestamps: true, // Ajoute automatiquement les champs `createdAt` et `updatedAt`
    tableName: 'users', // Nom explicite pour la table en base de données
});

module.exports = User;
