/**
 * @swagger
 * components:
 *   schemas:
 *     MaintenanceEvent:
 *       type: object
 *       required:
 *         - event
 *         - maintenance
 *       properties:
 *         event:
 *           type: string
 *           description: Type de l'événement (created, completed, cancelled).
 *           example: created
 *         maintenance:
 *           type: object
 *           required:
 *             - vehicle_id
 *             - mechanic_id
 *             - start_date
 *             - end_date
 *             - description
 *           properties:
 *             vehicle_id:
 *               type: string
 *               description: ID du véhicule associé à la maintenance.
 *               example: '12345'
 *             mechanic_id:
 *               type: string
 *               description: ID du mécanicien responsable de la maintenance.
 *               example: '67890'
 *             start_date:
 *               type: string
 *               format: date-time
 *               description: Date et heure de début de la maintenance.
 *               example: '2024-12-05T10:00:00Z'
 *             end_date:
 *               type: string
 *               format: date-time
 *               description: Date et heure de fin de la maintenance.
 *               example: '2024-12-10T15:00:00Z'
 *             description:
 *               type: string
 *               description: Description détaillée de la maintenance.
 *               example: 'Engine repair'
 *             montant:
 *               type: number
 *               format: float
 *               description: Montant de la maintenance (uniquement pour l'événement `completed`).
 *               example: 150
 *
 * @swagger
 * /kafka/consume:
 *   post:
 *     summary: Consommation des événements Kafka pour les notifications de maintenance
 *     description: Le consommateur Kafka écoute les événements du topic `maintenance-events` et traite les messages selon leur type.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/MaintenanceEvent'
 *     responses:
 *       200:
 *         description: Message consommé avec succès
 *       400:
 *         description: Erreur dans le message consommé
 *
 * @example
 * sendMaintenanceNotification({
 *   event: 'created',
 *   maintenance: {
 *     vehicle_id: '12345',
 *     mechanic_id: '67890',
 *     start_date: '2024-12-05T10:00:00Z',
 *     end_date: '2024-12-10T15:00:00Z',
 *     description: 'Engine repair'
 *   }
 * }, 'created');
 *
 * @example
 * sendMaintenanceNotification({
 *   event: 'completed',
 *   maintenance: {
 *     vehicle_id: '12345',
 *     mechanic_id: '67890',
 *     start_date: '2024-12-05T10:00:00Z',
 *     end_date: '2024-12-10T15:00:00Z',
 *     description: 'Engine repair',
 *     montant: 150
 *   }
 * }, 'completed');
 *
 * @example
 * sendMaintenanceNotification({
 *   event: 'cancelled',
 *   maintenance: {
 *     vehicle_id: '12345',
 *     mechanic_id: '67890',
 *     start_date: '2024-12-05T10:00:00Z',
 *     end_date: '2024-12-10T15:00:00Z',
 *     description: 'Engine repair'
 *   }
 * }, 'cancelled');
 */
