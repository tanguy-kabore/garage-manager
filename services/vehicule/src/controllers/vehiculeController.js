/**
 * Contrôleur pour la gestion des véhicules.
 *
 * Ce module contient les méthodes nécessaires pour gérer les véhicules dans le système. Il inclut la création,
 * la récupération, la mise à jour et la suppression des véhicules. Chaque méthode communique avec un modèle Sequelize
 * pour interagir avec la base de données, et utilise également un microservice utilisateur pour valider l'existence
 * du propriétaire du véhicule.
 *
 * Fonctionnalités :
 * - Création d'un véhicule après avoir validé l'existence de son propriétaire via un microservice.
 * - Récupération d'un véhicule par son ID.
 * - Mise à jour des informations d'un véhicule existant.
 * - Suppression d'un véhicule de la base de données.
 *
 * Utilise les packages suivants :
 * - `axios` pour la communication avec le microservice utilisateur.
 * - `@models/vehicule` pour l'interaction avec le modèle de données des véhicules.
 * - `responseHelper` pour envoyer des réponses formatées avec succès ou erreur.
 */

const axios = require('axios');
const Vehicule = require('@models/vehicule');

// Helper pour gérer les réponses
const responseHelper = {
  /**
   * Envoie une réponse de succès au client.
   *
   * @param {Object} res - L'objet de réponse Express.
   * @param {Object} data - Les données à envoyer dans la réponse.
   * @param {string} message - Le message de succès.
   * @returns {Object} - La réponse au client avec un statut 200.
   */
  sendSuccess: (res, data, message) => {
    return res.status(200).json({
      success: true,
      message,
      data,
    });
  },

  /**
   * Envoie une réponse d'erreur au client.
   *
   * @param {Object} res - L'objet de réponse Express.
   * @param {string} message - Le message d'erreur.
   * @param {number} statusCode - Le code de statut HTTP à envoyer.
   * @returns {Object} - La réponse d'erreur au client.
   */
  sendError: (res, message, statusCode) => {
    return res.status(statusCode).json({
      success: false,
      message,
    });
  },
};

/**
 * Créer un véhicule.
 *
 * Cette méthode crée un nouveau véhicule dans la base de données après avoir validé l'existence de son propriétaire
 * via un appel au microservice utilisateur. Si le propriétaire est valide, un nouveau véhicule est créé et les
 * informations sont renvoyées au client.
 *
 * @param {Object} req - L'objet de la requête contenant les informations du véhicule à créer.
 * @param {Object} res - L'objet de la réponse pour renvoyer les résultats de l'opération.
 * @returns {Object} - La réponse au client avec les données du véhicule créé ou un message d'erreur.
 */
exports.createVehicule = async (req, res) => {
  try {
    const { marque, modele, annee, num_immatriculation, kilometrage, proprietaire_id } = req.body;
    const userServiceUrl = process.env.USER_SERVICE_URL;

    // Vérification si le propriétaire est un client via l'API du microservice User
    if (!proprietaire_id) {
      return responseHelper.sendError(res, 'Le propriétaire du véhicule est requis', 400);
    }

    // Vérification de l'existence du propriétaire dans le microservice User
    let userResponse;
    try {
      userResponse = await axios.get(`${userServiceUrl}/${proprietaire_id}`);
    } catch (error) {
      console.error('Erreur lors de la vérification du propriétaire:', error);
      return responseHelper.sendError(res, 'Erreur de communication avec le microservice Utilisateur', 500);
    }

    // Vérifier si l'utilisateur existe dans la réponse
    if (!userResponse.data || !userResponse.data.id) {
      return responseHelper.sendError(res, 'Le propriétaire n\'existe pas', 404);
    }

    // Créer le véhicule si le propriétaire existe
    const newVehicule = await Vehicule.create({
      marque,
      modele,
      annee,
      num_immatriculation,
      kilometrage,
      proprietaire_id,
    });

    // Réponse de succès
    return responseHelper.sendSuccess(res, newVehicule, 'Véhicule créé avec succès');
  } catch (error) {
    console.error('Erreur lors de la création du véhicule:', error);
    if (error.response && error.response.status === 404) {
      return responseHelper.sendError(res, 'Le propriétaire n\'existe pas', 404);
    }
    return responseHelper.sendError(res, 'Erreur lors de la création du véhicule', 500);
  }
};

/**
 * Lister tous les véhicules.
 *
 * Cette méthode récupère tous les véhicules présents dans la base de données. Si des véhicules existent, ils sont
 * renvoyés au client. Sinon, un message d'erreur est retourné pour indiquer qu'aucun véhicule n'a été trouvé.
 *
 * @param {Object} req - L'objet de la requête.
 * @param {Object} res - L'objet de la réponse pour renvoyer la liste des véhicules ou un message d'erreur.
 * @returns {Object} - La réponse au client avec la liste des véhicules ou un message d'erreur.
 */
exports.listVehicules = async (req, res) => {
  try {
    // Récupérer tous les véhicules de la base de données
    const vehicules = await Vehicule.findAll();

    // Vérifier si des véhicules existent
    if (vehicules.length === 0) {
      return responseHelper.sendError(res, 'Aucun véhicule trouvé', 404);
    }

    // Réponse de succès avec la liste des véhicules
    return responseHelper.sendSuccess(res, vehicules, 'Liste des véhicules récupérée avec succès');
  } catch (error) {
    console.error('Erreur lors de la récupération des véhicules:', error);
    return responseHelper.sendError(res, 'Erreur lors de la récupération des véhicules', 500);
  }
};

/**
 * Obtenir un véhicule spécifique par son ID.
 *
 * Cette méthode récupère un véhicule spécifique dans la base de données en fonction de son ID. Si le véhicule
 * est trouvé, il est renvoyé au client, sinon un message d'erreur est retourné.
 *
 * @param {Object} req - L'objet de la requête contenant l'ID du véhicule.
 * @param {Object} res - L'objet de la réponse pour renvoyer les données du véhicule ou une erreur.
 * @returns {Object} - La réponse au client avec les données du véhicule ou un message d'erreur.
 */
exports.getVehicule = async (req, res) => {
  try {
    const { id } = req.params;

    // Vérification de l'ID du véhicule
    if (!id) {
      return responseHelper.sendError(res, 'L\'ID du véhicule est requis', 400);
    }

    // Recherche du véhicule par son ID
    const vehicule = await Vehicule.findOne({ where: { id: id } });

    // Vérifier si le véhicule existe
    if (!vehicule) {
      return responseHelper.sendError(res, 'Aucun véhicule trouvé avec cet ID', 404);
    }

    // Réponse de succès avec le véhicule trouvé
    return responseHelper.sendSuccess(res, vehicule, 'Véhicule récupéré avec succès');
  } catch (error) {
    console.error('Erreur lors de la récupération du véhicule:', error);
    return responseHelper.sendError(res, 'Erreur lors de la récupération du véhicule', 500);
  }
};

/**
 * Mettre à jour un véhicule.
 *
 * Cette méthode permet de mettre à jour les informations d'un véhicule existant dans la base de données. Si le véhicule
 * est trouvé, ses informations sont mises à jour avec les nouvelles données. Sinon, un message d'erreur est renvoyé.
 *
 * @param {Object} req - L'objet de la requête contenant l'ID du véhicule à mettre à jour et les nouvelles données.
 * @param {Object} res - L'objet de la réponse pour renvoyer les résultats de l'opération.
 * @returns {Object} - La réponse au client avec les informations mises à jour ou un message d'erreur.
 */
exports.updateVehicule = async (req, res) => {
  try {
    const { id } = req.params;
    const { marque, modele, annee, num_immatriculation, kilometrage } = req.body;

    const vehicule = await Vehicule.findByPk(id);
    if (!vehicule) {
      return responseHelper.sendError(res, 'Véhicule non trouvé', 404);
    }

    // Mettre à jour le véhicule
    await vehicule.update({
      marque,
      modele,
      annee,
      num_immatriculation,
      kilometrage,
    });

    return responseHelper.sendSuccess(res, vehicule, 'Véhicule mis à jour avec succès');
  } catch (error) {
    console.error('Erreur lors de la mise à jour du véhicule:', error);
    return responseHelper.sendError(res, 'Erreur lors de la mise à jour du véhicule', 500);
  }
};

/**
 * Supprimer un véhicule.
 *
 * Cette méthode supprime un véhicule spécifique dans la base de données en fonction de son ID. Si le véhicule
 * est trouvé, il est supprimé et une réponse de succès est envoyée. Sinon, un message d'erreur est retourné.
 *
 * @param {Object} req - L'objet de la requête contenant l'ID du véhicule à supprimer.
 * @param {Object} res - L'objet de la réponse pour renvoyer les résultats de l'opération.
 * @returns {Object} - La réponse au client avec une confirmation de suppression ou un message d'erreur.
 */
exports.deleteVehicule = async (req, res) => {
  try {
    const { id } = req.params;

    const vehicule = await Vehicule.findByPk(id);
    if (!vehicule) {
      return responseHelper.sendError(res, 'Véhicule non trouvé', 404);
    }

    await vehicule.destroy();

    return responseHelper.sendSuccess(res, null, 'Véhicule supprimé avec succès');
  } catch (error) {
    console.error('Erreur lors de la suppression du véhicule:', error);
    return responseHelper.sendError(res, 'Erreur lors de la suppression du véhicule', 500);
  }
};
