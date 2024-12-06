const express = require('express');
const vehiculeController = require('../controllers/vehiculeController');

const router = express.Router();

/**
 * Routes pour la gestion des véhicules.
 *
 * Ce fichier contient les routes pour effectuer différentes opérations sur les véhicules dans le système. 
 * Chaque route correspond à une action spécifique qui utilise un contrôleur pour interagir avec la base de données 
 * et gérer les données des véhicules. Les opérations disponibles sont la création, la récupération, la mise à jour, 
 * la suppression et la récupération de la liste de tous les véhicules.
 *
 * Routes disponibles :
 * - POST `/` : Créer un nouveau véhicule.
 * - GET `/` : Lister tous les véhicules.
 * - GET `/ :id` : Récupérer un véhicule par son ID.
 * - PUT `/ :id` : Mettre à jour un véhicule par son ID.
 * - DELETE `/ :id` : Supprimer un véhicule par son ID.
 */

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
 * /vehicules:
 *   post:
 *     summary: Créer un véhicule
 *     description: Permet de créer un nouveau véhicule en fournissant les informations nécessaires.
 *     tags:
 *       - Véhicules
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marque:
 *                 type: string
 *                 description: La marque du véhicule.
 *                 example: "Toyota"
 *               modele:
 *                 type: string
 *                 description: Le modèle du véhicule.
 *                 example: "Corolla"
 *               annee:
 *                 type: integer
 *                 description: L'année de fabrication du véhicule.
 *                 example: 2022
 *               immatriculation:
 *                 type: string
 *                 description: Numéro d'immatriculation unique.
 *                 example: "AB-123-CD"
 *               proprietaire:
 *                 type: string
 *                 description: ID du propriétaire du véhicule.
 *                 example: "1"
 *     responses:
 *       201:
 *         description: Véhicule créé avec succès.
 *       400:
 *         description: Données invalides fournies.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.post('/', vehiculeController.createVehicule);

/**
 * @swagger
 * /vehicules:
 *   get:
 *     summary: Lister tous les véhicules
 *     description: Permet de récupérer la liste de tous les véhicules enregistrés.
 *     tags:
 *       - Véhicules
 *     responses:
 *       200:
 *         description: Liste des véhicules récupérée avec succès.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Vehicule'
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/', vehiculeController.listVehicules);

/**
 * @swagger
 * /vehicules/{id}:
 *   get:
 *     summary: Récupérer un véhicule par son ID
 *     description: Permet de récupérer les détails d'un véhicule spécifique via son ID.
 *     tags:
 *       - Véhicules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unique du véhicule.
 *     responses:
 *       200:
 *         description: Détails du véhicule récupérés avec succès.
 *       404:
 *         description: Véhicule non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.get('/:id', vehiculeController.getVehicule);

/**
 * @swagger
 * /vehicules/{id}:
 *   put:
 *     summary: Mettre à jour un véhicule
 *     description: Permet de mettre à jour les informations d'un véhicule par son ID.
 *     tags:
 *       - Véhicules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unique du véhicule.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               marque:
 *                 type: string
 *                 description: Nouvelle marque du véhicule.
 *               modele:
 *                 type: string
 *                 description: Nouveau modèle du véhicule.
 *               annee:
 *                 type: integer
 *                 description: Nouvelle année de fabrication.
 *               immatriculation:
 *                 type: string
 *                 description: Nouveau numéro d'immatriculation.
 *               proprietaire:
 *                 type: string
 *                 description: Nouveau ID du propriétaire.
 *     responses:
 *       200:
 *         description: Véhicule mis à jour avec succès.
 *       400:
 *         description: Données invalides fournies.
 *       404:
 *         description: Véhicule non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.put('/:id', vehiculeController.updateVehicule);

/**
 * @swagger
 * /vehicules/{id}:
 *   delete:
 *     summary: Supprimer un véhicule
 *     description: Permet de supprimer un véhicule par son ID.
 *     tags:
 *       - Véhicules
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID unique du véhicule.
 *     responses:
 *       200:
 *         description: Véhicule supprimé avec succès.
 *       404:
 *         description: Véhicule non trouvé.
 *       500:
 *         description: Erreur interne du serveur.
 */
router.delete('/:id', vehiculeController.deleteVehicule);

module.exports = router;
