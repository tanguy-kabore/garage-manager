const axios = require('axios');
const moment = require('moment'); // Assurez-vous que moment est installé avec `npm install moment`
const dotenv = require('dotenv');
const MaintenanceService = require('@services/maintenanceService');

dotenv.config();

/**
 * Crée une nouvelle maintenance.
 * 
 * Cette fonction gère la requête HTTP pour créer une nouvelle maintenance. 
 * Elle extrait les données de la requête (`req.body`), vérifie l'existence du `vehicle_id` et du `mechanic_id` 
 * en appelant des microservices externes, puis appelle le service de maintenance pour créer la maintenance 
 * dans la base de données. Enfin, elle renvoie une réponse avec un code de statut HTTP 201 et un message de succès.
 * En cas d'erreur, elle passe l'erreur au middleware de gestion des erreurs.
 * 
 * Utilise la configuration de Kafka pour publier un événement relatif à la création.
 * 
 * @param {Object} req - L'objet de la requête HTTP contenant les données de la maintenance à créer.
 * @param {Object} res - L'objet de la réponse HTTP, qui sera envoyé après la création de la maintenance.
 * @param {Function} next - La fonction pour passer le contrôle au middleware suivant en cas d'erreur.
 * 
 * @returns {void} - Renvoie une réponse avec un code de statut 201 en cas de succès.
 */
const createMaintenance = async (req, res, next) => {
  try {
    const data = req.body;
    const { vehicle_id, start_date, end_date } = data;

    // Vérification des IDs requis
    if (!vehicle_id) {
      return res.status(400).json({ message: 'Vehicle ID is required.' });
    }

    // Vérification des dates start_date et end_date
    const currentDate = moment(); // Date et heure actuelles
    const startDate = moment(start_date); // Conversion de start_date en moment
    const endDate = moment(end_date); // Conversion de end_date en moment

    // Vérifier que start_date est dans le futur
    if (startDate.isBefore(currentDate)) {
      return res.status(400).json({ message: 'Start date must be in the future.' });
    }

    // Vérifier que end_date est après start_date
    if (endDate.isBefore(startDate)) {
      return res.status(400).json({ message: 'End date must be after start date.' });
    }

    // Vérification du véhicule via le microservice
    const vehicleUrl = `${process.env.API_VEHICLES_URL}/${vehicle_id}`;
    const vehicleResponse = await axios.get(vehicleUrl);
    if (vehicleResponse.status !== 200 || !vehicleResponse.data.vehicule) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    // Création de la maintenance après les vérifications
    const maintenance = await MaintenanceService.createMaintenance(data);
    res.status(201).json({ message: 'Maintenance created', maintenance: maintenance });
  } catch (err) {
    // Gestion des erreurs : si l'erreur vient de l'appel API
    if (axios.isAxiosError(err)) {
      return res.status(500).json({ message: 'Error connecting to external services.', error: err.message });
    }
    next(err);
  }
};

/**
 * Met à jour le statut d'une maintenance existante.
 * 
 * Cette fonction gère la requête HTTP pour mettre à jour le statut d'une maintenance existante.
 * Elle vérifie si les conditions requises pour passer le statut à "completed" sont remplies, 
 * notamment que le montant est strictement supérieur à zéro. Si ce n'est pas le cas, elle renvoie une erreur.
 * 
 * Fonctionnalités principales :
 * - Valide le nouveau statut (`req.body.status`) pour qu'il soit "completed" ou "cancelled".
 * - Vérifie que le montant (`amount`) de la maintenance est strictement supérieur à 0 avant 
 *   d'autoriser la mise à jour au statut "completed".
 * - Met à jour le statut de la maintenance en appelant le service approprié.
 * 
 * Utilise la configuration de Kafka pour publier un événement relatif au changement de statut.
 * 
 * @param {Object} req - L'objet de la requête HTTP, incluant l'ID de la maintenance dans les paramètres
 *                        (`req.params.id`), le nouveau statut dans le corps de la requête (`req.body.status`),
 *                        et le montant éventuellement dans `req.body.amount`.
 * @param {Object} res - L'objet de la réponse HTTP, qui sera envoyé après la mise à jour de la maintenance.
 * @param {Function} next - La fonction pour passer le contrôle au middleware suivant en cas d'erreur.
 * 
 * @returns {void} - Renvoie une réponse avec un code de statut 200 en cas de succès.
 */
const updateMaintenanceStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // Récupère l'ID de la maintenance depuis les paramètres
    const { status, amount, mechanic_id } = req.body; // Récupère le nouveau statut, le montant, et l'ID du mécanicien depuis le corps de la requête

    // Validation du statut
    if (!['completed', 'cancelled', 'confirmed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use "completed", "cancelled", or "confirmed".' });
    }

    // Récupérer la maintenance actuelle pour effectuer les validations
    const maintenance = await MaintenanceService.getMaintenanceById(id);
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance not found.' });
    }

    // Vérifications spécifiques aux statuts
    if (status === 'completed' || status === 'confirmed') {
      // Vérifier que le montant est valide si le statut est "completed"
      if (status === 'completed') {
        const validAmount = amount !== undefined ? amount : maintenance.amount; // Priorise le montant fourni dans la requête
        if (validAmount === undefined || validAmount <= 0) {
          return res.status(400).json({ 
            message: 'Cannot mark as completed. A valid amount greater than zero is required.' 
          });
        }
      }

      // Vérifier que le mechanic_id est présent et valide pour "confirmed" et "completed"
      if (!mechanic_id) {
        return res.status(400).json({ 
          message: `Cannot mark as ${status}. A valid mechanic_id is required.` 
        });
      }

      // Vérification du mécanicien via le microservice
      try {
        const mechanicUrl = `${process.env.API_USERS_URL}/${mechanic_id}`;
        const mechanicResponse = await axios.get(mechanicUrl);

        if (mechanicResponse.status !== 200 || !mechanicResponse.data.user) {
          return res.status(404).json({ message: 'Mechanic not found.' });
        }
      } catch (error) {
        console.error('Error fetching mechanic:', error.message);
        return res.status(500).json({ message: 'Error verifying mechanic.' });
      }
    }

    // Mettre à jour le statut et, si nécessaire, le montant et le mécanicien
    const updatedMaintenance = await MaintenanceService.updateMaintenanceStatus(id, status, amount, mechanic_id);

    res.status(200).json({ 
      message: `Maintenance status updated to ${status}`, 
      maintenance: updatedMaintenance 
    });
  } catch (err) {
    next(err); // Passe les erreurs au middleware de gestion des erreurs
  }
};

/**
 * Liste toutes les maintenances.
 * 
 * Cette fonction récupère toutes les maintenances enregistrées dans la base de données.
 * 
 * @param {Object} req - L'objet de la requête HTTP.
 * @param {Object} res - L'objet de la réponse HTTP qui renverra la liste des maintenances.
 * @param {Function} next - La fonction pour passer le contrôle au middleware suivant en cas d'erreur.
 * 
 * @returns {void} - Renvoie la liste des maintenances.
 */
const listAllMaintenances = async (req, res, next) => {
  try {
    const maintenances = await MaintenanceService.listAllMaintenances();
    res.status(200).json({ message: `All maintenances`,maintenances: maintenances });
  } catch (err) {
    next(err); // Passe les erreurs au middleware de gestion des erreurs
  }
};

/**
 * Récupère une maintenance par son ID.
 * 
 * Cette fonction récupère une maintenance spécifique en utilisant l'ID fourni dans les paramètres de la requête.
 * 
 * @param {Object} req - L'objet de la requête HTTP contenant l'ID de la maintenance dans `req.params.id`.
 * @param {Object} res - L'objet de la réponse HTTP qui renverra les détails de la maintenance.
 * @param {Function} next - La fonction pour passer le contrôle au middleware suivant en cas d'erreur.
 * 
 * @returns {void} - Renvoie les détails de la maintenance.
 */
const getMaintenanceById = async (req, res, next) => {
  try {
    const { id } = req.params; // Récupère l'ID de la maintenance depuis les paramètres
    const maintenance = await MaintenanceService.getMaintenanceById(id);
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance not found.' });
    }
    res.status(200).json({ message: `Maintenance récupéré avec succès`,maintenance: maintenance });
  } catch (err) {
    next(err); // Passe les erreurs au middleware de gestion des erreurs
  }
};

/**
 * Supprime une maintenance par son ID.
 * 
 * Cette fonction supprime une maintenance spécifique en utilisant l'ID fourni dans les paramètres de la requête.
 * 
 * @param {Object} req - L'objet de la requête HTTP contenant l'ID de la maintenance dans `req.params.id`.
 * @param {Object} res - L'objet de la réponse HTTP confirmant la suppression de la maintenance.
 * @param {Function} next - La fonction pour passer le contrôle au middleware suivant en cas d'erreur.
 * 
 * @returns {void} - Renvoie un message confirmant la suppression de la maintenance.
 */
const deleteMaintenance = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await MaintenanceService.deleteMaintenanceById(id);

    if (!result.success) {
      return res.status(404).json({ message: result.message });
    }

    return res.status(200).json({ message: result.message });
  } catch (error) {
    console.error('Unexpected error:', error);
    return res.status(500).json({ message: 'An unexpected error occurred.' });
  }
};

module.exports = { 
  createMaintenance, 
  updateMaintenanceStatus,
  listAllMaintenances,
  getMaintenanceById,
  deleteMaintenance 
};
