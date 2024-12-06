const express = require('express');
const { createMaintenance, updateMaintenanceStatus } = require('@controllers/maintenanceController');

const router = express.Router();

/**
 * Route POST pour créer une nouvelle maintenance.
 * 
 * Cette route gère la requête HTTP de type POST pour créer une nouvelle maintenance. 
 * Elle appelle la fonction `createMaintenance` du contrôleur `maintenanceController` 
 * pour effectuer la création de la maintenance dans la base de données.
 * 
 * @route POST /maintenance
 * @group Maintenance - Opérations liées à la maintenance
 * @param {object} req.body - Données nécessaires pour créer la maintenance
 * @param {string} req.body.vehicle_id.required - ID du véhicule
 * @param {string} req.body.mechanic_id.required - ID du mécanicien
 * @param {string} req.body.start_date.required - Date et heure de début (format ISO 8601)
 * @param {string} req.body.end_date.required - Date et heure de fin (format ISO 8601)
 * @param {number} req.body.montant.required - Montant total de la maintenance (en euros, par exemple)
 * @param {string} req.body.description - Description de la tâche de maintenance
 * @returns {object} 201 - La maintenance créée avec ses détails
 * @returns {Error}  400 - Si des informations sont manquantes ou invalides
 * @returns {Error}  500 - En cas d'erreur du serveur
 * @swagger
 * /maintenance:
 *   post:
 *     summary: Créer une nouvelle maintenance
 *     description: Permet de créer une nouvelle maintenance pour un véhicule spécifique.
 *     tags:
 *       - Maintenance
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               vehicle_id:
 *                 type: string
 *                 description: ID du véhicule
 *                 example: "1"
 *               mechanic_id:
 *                 type: string
 *                 description: ID du mécanicien
 *                 example: "mech67890"
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 description: Date et heure de début (ISO 8601)
 *                 example: "2024-12-05T10:00:00Z"
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 description: Date et heure de fin (ISO 8601)
 *                 example: "2024-12-05T12:00:00Z"
 *               montant:
 *                 type: number
 *                 description: Montant total de la maintenance (en euros)
 *                 example: 150.0
 *               description:
 *                 type: string
 *                 description: Description de la tâche de maintenance
 *                 example: "Changement des pneus avant"
 *     responses:
 *       201:
 *         description: Maintenance créée avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID de la maintenance créée
 *                   example: "1"
 *       400:
 *         description: Données invalides fournies
 *       500:
 *         description: Erreur interne du serveur
 */
router.post('/', createMaintenance);

/**
 * Route PATCH pour mettre à jour le statut d'une maintenance existante.
 * 
 * Cette route gère la requête HTTP de type PATCH pour mettre à jour le statut d'une maintenance
 * existante, identifiée par son `id` dans les paramètres de la requête. Elle prend en charge les
 * statuts tels que `completed` et `cancelled`.
 * 
 * @route PATCH /maintenance/{id}
 * @group Maintenance - Opérations liées à la maintenance
 * @param {string} id.path.required - ID de la maintenance à mettre à jour
 * @param {string} req.body.status.required - Nouveau statut de la maintenance (`completed` ou `cancelled`)
 * @param {number} req.body.montant - Nouveau montant de la maintenance (optionnel)
 * @returns {object} 200 - La maintenance mise à jour avec son nouveau statut
 * @returns {Error}  400 - Si les informations sont invalides
 * @returns {Error}  404 - Si la maintenance n'est pas trouvée
 * @returns {Error}  500 - En cas d'erreur du serveur
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
 *         description: ID de la maintenance à mettre à jour
 *         schema:
 *           type: string
 *           example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 description: Nouveau statut de la maintenance (`completed` ou `cancelled`)
 *                 example: "completed"
 *               montant:
 *                 type: number
 *                 description: Nouveau montant de la maintenance (optionnel)
 *                 example: 200.0
 *     responses:
 *       200:
 *         description: Maintenance mise à jour avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: ID de la maintenance mise à jour
 *                   example: "1"
 *                 status:
 *                   type: string
 *                   description: Nouveau statut de la maintenance
 *                   example: "completed"
 *       400:
 *         description: Données invalides fournies
 *       404:
 *         description: Maintenance non trouvée
 *       500:
 *         description: Erreur interne du serveur
 */
router.patch('/:id', updateMaintenanceStatus);


module.exports = router;
