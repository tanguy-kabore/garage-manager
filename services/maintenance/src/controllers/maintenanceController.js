const axios = require('axios');
const moment = require('moment'); // Assurez-vous que moment est installé avec `npm install moment`

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
    const { vehicle_id, mechanic_id, start_date, end_date } = data;

    // Vérification des IDs requis
    if (!vehicle_id || !mechanic_id) {
      return res.status(400).json({ message: 'Vehicle ID and Mechanic ID are required.' });
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
    if (vehicleResponse.status !== 200 || !vehicleResponse.data) {
      return res.status(404).json({ message: 'Vehicle not found.' });
    }

    // Vérification du mécanicien via le microservice
    const mechanicUrl = `${process.env.USER_API_URL}/${mechanic_id}`;
    const mechanicResponse = await axios.get(mechanicUrl);
    if (mechanicResponse.status !== 200 || !mechanicResponse.data) {
      return res.status(404).json({ message: 'Mechanic not found.' });
    }

    // Création de la maintenance après les vérifications
    const maintenance = await MaintenanceService.createMaintenance(data);
    res.status(201).json({ message: 'Maintenance created', maintenance });
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
 * notamment que le montant est supérieur à zéro. Si ce n'est pas le cas, elle renvoie une erreur.
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
 *                        (`req.params.id`) et le nouveau statut dans le corps de la requête (`req.body.status`).
 * @param {Object} res - L'objet de la réponse HTTP, qui sera envoyé après la mise à jour de la maintenance.
 * @param {Function} next - La fonction pour passer le contrôle au middleware suivant en cas d'erreur.
 * 
 * @returns {void} - Renvoie une réponse avec un code de statut 200 en cas de succès.
 */
const updateMaintenanceStatus = async (req, res, next) => {
  try {
    const { id } = req.params; // Récupère l'ID de la maintenance depuis les paramètres
    const { status } = req.body; // Récupère le nouveau statut depuis le corps de la requête

    // Validation du statut
    if (!['completed', 'cancelled'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status. Use "completed" or "cancelled".' });
    }

    // Récupérer la maintenance actuelle pour valider le montant
    const maintenance = await MaintenanceService.getMaintenanceById(id);
    if (!maintenance) {
      return res.status(404).json({ message: 'Maintenance not found.' });
    }

    // Vérifier que le montant est supérieur à 0 pour le statut "completed"
    if (status === 'completed' && maintenance.amount <= 0) {
      return res.status(400).json({ 
        message: 'Cannot mark as completed. The amount must be greater than zero.' 
      });
    }

    // Mettre à jour le statut de la maintenance
    const updatedMaintenance = await MaintenanceService.updateMaintenanceStatus(id, status);

    res.status(200).json({ 
      message: `Maintenance status updated to ${status}`, 
      maintenance: updatedMaintenance 
    });
  } catch (err) {
    next(err); // Passe les erreurs au middleware de gestion des erreurs
  }
};

module.exports = { 
  createMaintenance, 
  updateMaintenanceStatus 
};
