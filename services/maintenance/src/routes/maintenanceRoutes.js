const express = require('express');
const { createMaintenance, updateMaintenanceStatus, listAllMaintenances, listMaintenancesByVehicle, getMaintenanceById, deleteMaintenance } = require('@controllers/maintenanceController');

const router = express.Router();

/**
 * @swagger
 * /maintenance:
 *   post:
 *     summary: Créer une nouvelle maintenance
 *     description: Permet de créer une nouvelle maintenance pour un véhicule.
 *     tags:
 *       - Maintenance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - vehicle_id
 *               - start_date
 *               - end_date
 *             properties:
 *               vehicle_id:
 *                 type: integer
 *                 description: ID du véhicule
 *               mechanic_id:
 *                 type: integer
 *                 description: ID du mécanicien
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: Date et heure de début (format ISO 8601)
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 description: Date et heure de fin (format ISO 8601)
 *               amount:
 *                 type: number
 *                 description: Montant de la maintenance (optionnel)
 *               description:
 *                 type: string
 *                 description: Description de la maintenance
 *     responses:
 *       201:
 *         description: Maintenance créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Maintenance created
 *                 maintenance:
 *                   $ref: '#/components/schemas/Maintenance'
 *       400:
 *         description: Données invalides
 *       500:
 *         description: Erreur serveur
 */
router.post('/', createMaintenance);

/**
 * @swagger
 * /maintenance/{id}:
 *   patch:
 *     summary: Mettre à jour le statut d'une maintenance
 *     description: Permet de mettre à jour le statut d'une maintenance existante.
 *     tags:
 *       - Maintenance
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la maintenance à mettre à jour
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [completed, cancelled, confirmed]
 *                 description: Nouveau statut de la maintenance
 *               amount:
 *                 type: number
 *                 description: Montant de la maintenance (requis si statut = completed)
 *               mechanic_id:
 *                 type: integer
 *                 description: ID du mécanicien (requis si statut = confirmed ou completed)
 *     responses:
 *       200:
 *         description: Statut mis à jour avec succès
 *       400:
 *         description: Données invalides
 *       404:
 *         description: Maintenance introuvable
 *       500:
 *         description: Erreur serveur
 */
router.patch('/:id', updateMaintenanceStatus);

/**
 * @swagger
 * /maintenance:
 *   get:
 *     summary: Récupérer toutes les maintenances
 *     description: Renvoie la liste de toutes les maintenances enregistrées.
 *     tags:
 *       - Maintenance
 *     responses:
 *       200:
 *         description: Liste de toutes les maintenances
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Maintenance'
 *       500:
 *         description: Erreur serveur
 */
router.get('/', listAllMaintenances);

/**
 * @swagger
 * /maintenance/{id}:
 *   get:
 *     summary: Récupérer une maintenance par son ID
 *     description: Permet de récupérer les détails d'une maintenance spécifique.
 *     tags:
 *       - Maintenance
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la maintenance
 *     responses:
 *       200:
 *         description: Détails de la maintenance
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Maintenance'
 *       404:
 *         description: Maintenance introuvable
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', getMaintenanceById);

/**
 * @swagger
 * /maintenance/{id}:
 *   delete:
 *     summary: Supprimer une maintenance
 *     description: Permet de supprimer une maintenance par son ID.
 *     tags:
 *       - Maintenance
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la maintenance
 *     responses:
 *       200:
 *         description: Maintenance supprimée avec succès
 *       404:
 *         description: Maintenance introuvable
 *       500:
 *         description: Erreur serveur
 */
router.delete('/:id', deleteMaintenance);

module.exports = router;

