/**
 * Fichier de routage pour la gestion des utilisateurs.
 *
 * Ce fichier définit les routes HTTP pour les opérations CRUD sur les utilisateurs.
 * Les routes sont connectées aux méthodes du contrôleur utilisateur, qui gèrent la logique métier.
 *
 * Routes disponibles :
 * - POST `/` : Créer un nouvel utilisateur.
 * - GET `/` : Récupérer tous les utilisateurs.
 * - GET `/:identifier` : Récupérer un utilisateur par son ID ou email.
 * - PUT `/:id` : Mettre à jour les informations d'un utilisateur par ID.
 * - DELETE `/:id` : Supprimer un utilisateur par ID.
 *
 * Utilise :
 * - `express.Router()` pour gérer les routes.
 * - Le contrôleur utilisateur depuis `../controllers/userController`.
 */

const express = require('express');
const router = express.Router();
const userController = require('@controllers/userController');

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Créer un utilisateur
 *     description: Permet de créer un nouvel utilisateur en fournissant les données nécessaires.
 *     tags:
 *       - Utilisateurs
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Prénom de l'utilisateur.
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 description: Nom de famille de l'utilisateur.
 *                 example: "Doe"
 *               address:
 *                 type: string
 *                 description: Adresse de l'utilisateur.
 *                 example: "123 rue des Lilas"
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse e-mail unique.
 *                 example: "john.doe@example.com"
 *               password:
 *                 type: string
 *                 description: Mot de passe de l'utilisateur.
 *                 example: "P@ssw0rd!"
 *               role:
 *                 type: string
 *                 enum: [client, mecanicien]
 *                 description: Rôle de l'utilisateur.
 *                 example: "client"
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès.
 *       400:
 *         description: Données invalides fournies.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post('/', userController.createUser);

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Récupérer tous les utilisateurs
 *     description: Permet de récupérer la liste de tous les utilisateurs enregistrés.
 *     tags:
 *       - Utilisateurs
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/', userController.getAllUsers);

/**
 * @swagger
 * /users/{identifier}:
 *   get:
 *     summary: Récupérer un utilisateur
 *     description: Permet de récupérer un utilisateur par son ID ou son email.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: identifier
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ou email de l'utilisateur.
 *     responses:
 *       200:
 *         description: Utilisateur récupéré avec succès.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/:identifier', userController.getUser);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Mettre à jour un utilisateur
 *     description: Permet de mettre à jour les informations d'un utilisateur par son ID.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 description: Nouveau prénom de l'utilisateur.
 *               lastName:
 *                 type: string
 *                 description: Nouveau nom de famille de l'utilisateur.
 *               address:
 *                 type: string
 *                 description: Nouvelle adresse de l'utilisateur.
 *               role:
 *                 type: string
 *                 enum: [client, mecanicien]
 *                 description: Nouveau rôle de l'utilisateur.
 *     responses:
 *       200:
 *         description: Utilisateur mis à jour avec succès.
 *       400:
 *         description: Données invalides fournies.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.put('/:id', userController.updateUser);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     description: Permet de supprimer un utilisateur par son ID.
 *     tags:
 *       - Utilisateurs
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur.
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès.
 *       404:
 *         description: Utilisateur non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.delete('/:id', userController.deleteUser);

module.exports = router;
