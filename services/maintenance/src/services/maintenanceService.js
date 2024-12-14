/**
 * Service de gestion des maintenances.
 *
 * Ce module permet de créer, mettre à jour, annuler, lister toutes les maintenances, et lister les maintenances par véhicule.
 * De plus, il publie des événements Kafka associés à chaque action (création, mise à jour, annulation).
 *
 * Fonctionnalités disponibles :
 * - Créer une nouvelle maintenance.
 * - Mettre à jour une maintenance existante.
 * - Annuler une maintenance.
 * - Lister toutes les maintenances.
 * - Lister les maintenances par véhicule.
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
const axios = require('axios');
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
 * @param {number|null} [amount] - Montant associé à la maintenance (obligatoire si le statut est "completed").
 * 
 * @returns {Promise<Object>} - La maintenance mise à jour.
 * @throws {Error} - Si la maintenance n'est pas trouvée ou si une erreur survient lors de la mise à jour.
 */
const updateMaintenanceStatus = async (id, status, amount = null, mechanic_id = null) => {
  try {
    // Vérification du statut
    if (!['completed', 'cancelled', 'confirmed'].includes(status)) {
      throw new Error('Invalid status. Use "completed", "cancelled", or "confirmed".');
    }

    // Validation spécifique au statut "completed" et "confirmed"
    if (status === 'completed' || status === 'confirmed') {
      // Pour "completed", vérifier que le montant est valide
      if (status === 'completed' && (amount === null || amount <= 0)) {
        throw new Error('For "completed" status, a valid amount greater than zero is required.');
      }

      // Vérifier que le mécanicien est renseigné et valide pour "completed" ou "confirmed"
      if (!mechanic_id) {
        throw new Error(`For "${status}" status, a valid mechanic_id is required.`);
      }

      // Vérification du mécanicien via un microservice
      const mechanicUrl = `${process.env.API_USERS_URL}/${mechanic_id}`;
      try {
        const mechanicResponse = await axios.get(mechanicUrl);

        if (mechanicResponse.status !== 200 || !mechanicResponse.data.user) {
          throw new Error('Mechanic not found.');
        }
      } catch (error) {
        console.error('Error fetching mechanic:', error.message);
        throw new Error('Error verifying mechanic.');
      }
    }

    // Trouver la maintenance par ID
    const maintenance = await Maintenance.findOne({ where: { id } });

    if (!maintenance) {
      throw new Error('Maintenance not found.');
    }

    // Préparer les données à mettre à jour
    const updateData = { status };
    if (status === 'completed') {
      updateData.amount = amount; // Mettre à jour le montant seulement si "completed"
    }
    if (status === 'completed' || status === 'confirmed') {
      updateData.mechanic_id = mechanic_id; // Mettre à jour le mécanicien si "completed" ou "confirmed"
    }

    // Mettre à jour la maintenance dans la base de données
    await maintenance.update(updateData);

    // Récupérer l'ensemble de la maintenance mise à jour
    const updatedMaintenance = await Maintenance.findOne({ where: { id } });

    // Publier un événement Kafka correspondant au nouveau statut avec toutes les informations
    await kafkaProducer.send({
      topic: process.env.KAFKA_TOPIC || 'maintenance-events', // Topic défini dans .env ou par défaut
      messages: [
        { value: JSON.stringify({ event: status, maintenance: updatedMaintenance }) },
      ],
    });

    console.log(`Maintenance status updated to "${status}" and event published.`);

    return updatedMaintenance;
  } catch (err) {
    console.error('Error updating maintenance status:', err);
    throw err;
  }
};

/**
 * Liste toutes les maintenances.
 *
 * Cette fonction récupère toutes les maintenances présentes dans la base de données.
 *
 * @returns {Promise<Array>} - Liste de toutes les maintenances.
 * @throws {Error} - Si une erreur survient lors de la récupération des maintenances.
 */
const listAllMaintenances = async () => {
  try {
    const maintenances = await Maintenance.findAll(); // Récupère toutes les maintenances
    return maintenances;
  } catch (err) {
    console.error('Error retrieving all maintenances:', err);
    throw err;
  }
};

/**
 * Récupère une maintenance par ID.
 *
 * Cette fonction retourne les détails d'une maintenance spécifique en fonction de son identifiant.
 *
 * @param {number} id - L'identifiant de la maintenance à récupérer.
 * 
 * @returns {Promise<Object>} - La maintenance trouvée.
 * @throws {Error} - Si la maintenance n'est pas trouvée ou si une erreur survient lors de la récupération.
 */
const getMaintenanceById = async (id) => {
  try {
    const maintenance = await Maintenance.findOne({ where: { id } });

    if (!maintenance) {
      throw new Error('Maintenance not found');
    }

    return maintenance;
  } catch (err) {
    console.error('Error retrieving maintenance by ID:', err);
    throw err;
  }
};

/**
 * Supprime une maintenance par ID.
 *
 * Cette fonction supprime une maintenance spécifique de la base de données et publie un événement Kafka 
 * pour notifier l'action de suppression.
 *
 * @param {number} id - L'identifiant de la maintenance à supprimer.
 * 
 * @returns {Promise<void>} - Indique que la suppression a été effectuée avec succès.
 * @throws {Error} - Si la maintenance n'est pas trouvée ou si une erreur survient lors de la suppression.
 */
const deleteMaintenanceById = async (id) => {
  try {
    // Trouver la maintenance par ID
    const maintenance = await Maintenance.findOne({ where: { id } });

    if (!maintenance) {
      console.error('Maintenance not found.');
      return { success: false, message: 'Maintenance not found.' }; // Retourner un objet clair pour l'erreur
    }

    // Supprimer la maintenance
    await maintenance.destroy();

    // Publier un événement Kafka pour la suppression
    try {
      await kafkaProducer.send({
        topic: process.env.KAFKA_TOPIC || 'maintenance-events',
        messages: [{ value: JSON.stringify({ event: 'deleted', maintenance }) }],
      });
      console.log('Maintenance deleted successfully and event published.');
    } catch (kafkaError) {
      console.error('Maintenance deleted but failed to publish Kafka event:', kafkaError);
      return { success: true, message: 'Maintenance deleted but event publication failed.' };
    }

    // Retourner une réponse de succès
    return { success: true, message: 'Maintenance deleted successfully.' };
  } catch (err) {
    console.error('Error deleting maintenance:', err);
    throw err; // Propager l'erreur pour qu'elle soit capturée par le contrôleur
  }
};

module.exports = {
  createMaintenance,
  updateMaintenanceStatus,
  listAllMaintenances,
  getMaintenanceById, // Service pour lister une maintenance par ID
  deleteMaintenanceById, // Service pour supprimer une maintenance
};
