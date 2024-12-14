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
 */

const express = require('express');
const router = express.Router();
const authController = require('@controllers/authController');

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Connexion utilisateur
 *     description: Permet à un utilisateur de se connecter en fournissant ses informations d'authentification (email et mot de passe). Retourne un token JWT si la connexion réussit.
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
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: mypassword
 *     responses:
 *       200:
 *         description: Connexion réussie. Retourne un token JWT et les informations de l'utilisateur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Connexion réussie
 *                 token:
 *                   type: string
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Identifiants incorrects.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Identifiants incorrects
 *       500:
 *         description: Erreur interne du serveur.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Erreur lors de la connexion
 */
router.post('/login', authController.login);
router.get('/', (req, res) => {
    res.send('Test réussit !');
  });
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Déconnexion utilisateur
 *     description: Permet à un utilisateur de se déconnecter en invalidant son token JWT. Le token est ajouté à une liste noire.
 *     tags:
 *       - Authentification
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         required: true
 *         description: Token JWT de l'utilisateur au format `Bearer <token>`.
 *         schema:
 *           type: string
 *           example: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: Déconnexion réussie.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Déconnexion réussie
 *       400:
 *         description: Aucun token fourni.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Aucun token fourni
 *       403:
 *         description: Token invalide ou déjà déconnecté.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Token invalide, veuillez vous reconnecter
 */
router.post('/logout', authController.logout);

module.exports = router;
