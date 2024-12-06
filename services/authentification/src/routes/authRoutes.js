/**
 * Routeur pour la gestion de l'authentification des utilisateurs.
 * 
 * Ce module définit les routes nécessaires pour l'authentification des utilisateurs,
 * en particulier la connexion et la déconnexion.
 * La logique de gestion de la connexion et de la déconnexion est déléguée au contrôleur `authController`.
 * 
 * Fonctionnalités :
 * - `POST /login` : Permet à l'utilisateur de se connecter en fournissant ses informations d'authentification.
 *   Cette route appelle le contrôleur `login` pour valider les identifiants et générer un token JWT.
 * - `POST /logout` : Permet à l'utilisateur de se déconnecter, en invalidant son token JWT.
 *   Cette route appelle le contrôleur `logout` pour effectuer la déconnexion.
 * 
 * Utilise le contrôleur `authController` pour gérer la logique de la connexion et de la déconnexion.
 */

const express = require('express');
const router = express.Router();
const authController = require('@controllers/authController');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connecter un utilisateur
 *     description: Permet à un utilisateur de se connecter en fournissant ses identifiants (email et mot de passe). Retourne un token JWT si la connexion est réussie.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email de l'utilisateur
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Mot de passe de l'utilisateur
 *                 example: "P@ssw0rd!"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT généré après connexion
 *                   example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Identifiants invalides ou manquants
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnecter un utilisateur
 *     description: Permet à un utilisateur de se déconnecter en invalidant son token JWT.
 *     tags:
 *       - Authentification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *                 description: Token JWT à invalider
 *                 example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: Message de confirmation
 *                   example: "Déconnexion réussie"
 *       400:
 *         description: Token JWT manquant ou invalide
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/logout', authController.logout);

module.exports = router;
