const express = require('express');
const vehiculeController = require('../controllers/vehiculeController');

const router = express.Router();

/**
 * Fichier de routage pour la gestion des véhicules.
 *
 * Ce fichier définit les routes HTTP pour les opérations CRUD sur les véhicules.
 * Les routes sont connectées aux méthodes du contrôleur `vehiculeController`, qui gèrent la logique métier.
 *
 * Routes disponibles :
 * - POST `/` : Créer un nouveau véhicule.
 * - GET `/` : Récupérer la liste de tous les véhicules.
 * - GET `/:id` : Récupérer un véhicule par son ID.
 * - PUT `/:id` : Mettre à jour un véhicule par son ID.
 * - DELETE `/:id` : Supprimer un véhicule par son ID.
 *
 * Utilise :
 * - `express.Router()` pour gérer les routes.
 * - Le contrôleur véhicule depuis `../controllers/vehiculeController`.
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Vehicule:
 *       type: object
 *       required:
 *         - marque
 *         - modele
 *         - annee
 *         - num_immatriculation
 *         - kilometrage
 *         - proprietaire_id
 *       properties:
 *         id:
 *           type: integer
 *           description: ID unique du véhicule
 *         marque:
 *           type: string
 *           description: Marque du véhicule
 *         modele:
 *           type: string
 *           description: Modèle du véhicule
 *         annee:
 *           type: integer
 *           description: Année de fabrication du véhicule
 *         num_immatriculation:
 *           type: string
 *           description: Numéro d'immatriculation unique du véhicule
 *         kilometrage:
 *           type: integer
 *           description: Kilométrage du véhicule
 *         proprietaire_id:
 *           type: integer
 *           description: ID du propriétaire du véhicule
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: Date de création de l'enregistrement
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: Date de dernière mise à jour de l'enregistrement
 *       example:
 *         id: 1
 *         marque: Toyota
 *         modele: Corolla
 *         annee: 2021
 *         num_immatriculation: ABC-2021
 *         kilometrage: 25000
 *         proprietaire_id: 1
 *         createdAt: 2024-12-06T00:12:30.000Z
 *         updatedAt: 2024-12-08T00:54:17.000Z
 */

/**
 * @swagger
 * /vehicules:
 *   post:
 *     summary: Créer un nouveau véhicule
 *     tags: [Vehicules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicule'
 *     responses:
 *       201:
 *         description: Véhicule créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 vehicule:
 *                   $ref: '#/components/schemas/Vehicule'
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', vehiculeController.createVehicule);

/**
 * @swagger
 * /vehicules:
 *   get:
 *     summary: Lister tous les véhicules
 *     tags: [Vehicules]
 *     responses:
 *       200:
 *         description: Liste des véhicules récupérée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 vehicules:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Vehicule'
 *       404:
 *         description: Aucun véhicule trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/', vehiculeController.listVehicules);

/**
 * @swagger
 * /vehicules/{id}:
 *   get:
 *     summary: Obtenir un véhicule spécifique par son ID
 *     tags: [Vehicules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du véhicule
 *     responses:
 *       200:
 *         description: Véhicule récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 vehicule:
 *                   $ref: '#/components/schemas/Vehicule'
 *       404:
 *         description: Véhicule non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', vehiculeController.getVehicule);

/**
 * @swagger
 * /vehicules/{id}:
 *   put:
 *     summary: Mettre à jour un véhicule par son ID
 *     tags: [Vehicules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du véhicule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Vehicule'
 *     responses:
 *       200:
 *         description: Véhicule mis à jour avec succès
 *       404:
 *         description: Véhicule non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.put('/:id', vehiculeController.updateVehicule);

/**
 * @swagger
 * /vehicules/{id}:
 *   delete:
 *     summary: Supprimer un véhicule par son ID
 *     tags: [Vehicules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du véhicule
 *     responses:
 *       200:
 *         description: Véhicule supprimé avec succès
 *       404:
 *         description: Véhicule non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', vehiculeController.deleteVehicule);

module.exports = router;
