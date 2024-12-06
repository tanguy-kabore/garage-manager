/**
 * Service de gestion des maintenances.
 *
 * Ce module permet de créer, mettre à jour et annuler des maintenances tout en publiant des événements Kafka 
 * associés à chaque action (création, mise à jour, annulation). Chaque fonction envoie un message Kafka vers le 
 * topic `maintenance-events` pour notifier les autres services ou systèmes de l'événement ayant eu lieu.
 *
 * Variables de configuration :
 * - `KAFKA_TOPIC` : Nom du topic Kafka pour publier les événements. Il est défini dans `.env` (par défaut `maintenance-events`).
 * - `KAFKA_BROKERS` : Liste des brokers Kafka, récupérée depuis les variables d'environnement.
 *
 * Fonctionnalités disponibles :
 * - Créer une nouvelle maintenance.
 * - Mettre à jour une maintenance existante.
 * - Annuler une maintenance.
 *
 * Exemple d'utilisation :
 * ```javascript
 * const maintenanceService = require('./services/maintenanceService');
 *
 * maintenanceService.createMaintenance({ ... })
 *   .then(maintenance => { ... })
 *   .catch(error => { ... });
 * ```
 *
 * Gestion des erreurs :
 * - En cas d'erreur lors de la création, mise à jour ou annulation, un message d'erreur est affiché dans la console.
 *   L'erreur est également propagée à l'appelant.
 *
 * @module maintenanceService
 */

const Maintenance = require('@models/maintenanceModel');
const kafkaProducer = require('@config/kafkaProducer'); // Configuration Kafka

/**
 * Crée une nouvelle maintenance.
 *
 * Cette fonction crée une nouvelle maintenance dans la base de données et publie un événement Kafka pour notifier 
 * l'action de création.
 *
 * @param {Object} data - Les données de la maintenance à créer. Doit contenir les informations nécessaires pour 
 *        créer une maintenance (par exemple : véhicule, date, type de service).
 * 
 * @returns {Promise<Object>} - La maintenance nouvellement créée.
 * @throws {Error} - Si une erreur survient lors de la création de la maintenance.
 */
const createMaintenance = async (data) => {
  try {
    const maintenance = await Maintenance.create(data);
    
    // Publier un événement Kafka pour la création
    await kafkaProducer.send({
      topic: process.env.KAFKA_TOPIC || 'maintenance-events', // Topic défini dans .env ou par défaut
      messages: [{ value: JSON.stringify({ event: 'created', maintenance }) }],
    });

    return maintenance;
  } catch (err) {
    console.error('Error creating maintenance:', err);
    throw err;
  }
};

/**
 * Met à jour le statut d'une maintenance existante.
 *
 * Cette fonction met à jour le statut d'une maintenance existante dans la base de données (completed ou cancelled) 
 * et publie un événement Kafka pour notifier l'action correspondante.
 *
 * @param {number} id - L'identifiant de la maintenance à mettre à jour.
 * @param {string} status - Le nouveau statut de la maintenance, soit "completed" ou "cancelled".
 * 
 * @returns {Promise<Object>} - La maintenance mise à jour.
 * @throws {Error} - Si la maintenance n'est pas trouvée ou si une erreur survient lors de la mise à jour.
 */
const updateMaintenanceStatus = async (id, status) => {
  try {
    if (!['completed', 'cancelled'].includes(status)) {
      throw new Error('Invalid status. Use "completed" or "cancelled".');
    }

    // Trouver la maintenance par ID
    const maintenance = await Maintenance.findOne({ where: { id } });

    if (!maintenance) {
      throw new Error('Maintenance not found');
    }

    // Mettre à jour le statut de la maintenance
    await maintenance.update({ status });

    // Publier un événement Kafka correspondant au nouveau statut
    await kafkaProducer.send({
      topic: process.env.KAFKA_TOPIC || 'maintenance-events', // Topic défini dans .env ou par défaut
      messages: [
        { value: JSON.stringify({ event: status, maintenance }) },
      ],
    });

    console.log(`Maintenance status updated to "${status}" and event published.`);

    return maintenance;
  } catch (err) {
    console.error('Error updating maintenance status:', err);
    throw err;
  }
};

module.exports = {
  createMaintenance,
  updateMaintenanceStatus,
};
