// vehicleService.js
import axios from '../utils/axios';

const VEHICULE_API_URL = process.env.REACT_APP_VEHICULE_API_URL;

// Fonction pour récupérer tous les véhicules
export const getVehicles = async () => {
    try {
        const { data } = await axios.get(VEHICULE_API_URL);
        console.log('Véhicules récupérés avec Axios:', data);
        return data.vehicules; // Retourner la liste des véhicules
    } catch (error) {
        console.error('Erreur lors de la récupération des véhicules:', error);
        throw error;
    }
};

// Fonction pour récupérer un véhicule par ID
export const getVehicleById = async (id) => {
    try {
        const { data } = await axios.get(`${VEHICULE_API_URL}/${id}`);
        return data.vehicule; // Retourner les détails du véhicule
    } catch (error) {
        console.error(`Erreur lors de la récupération du véhicule avec ID ${id}:`, error);
        throw error;
    }
};

// Fonction pour récupérer les véhicules par propriétaire
export const getVehiclesByOwnerId = async (ownerId) => {
    try {
        const vehicles = await getVehicles();
        if (!Array.isArray(vehicles)) {
            throw new Error('La liste des véhicules n’est pas un tableau.');
        }
        const filteredVehicles = vehicles.filter(vehicle => vehicle.proprietaire_id === ownerId);
        return filteredVehicles;
    } catch (error) {
        console.error(`Erreur lors de la récupération des véhicules pour le propriétaire avec ID ${ownerId}:`, error);
        throw error;
    }
};


// Fonction pour créer un nouveau véhicule
export const createVehicle = async (newVehicle) => {
    try {
        const response = await axios.post(VEHICULE_API_URL, newVehicle);
        return response.data.vehicule; // Retourner le véhicule créé
    } catch (error) {
        console.error('Erreur lors de la création du véhicule:', error);
        throw error;
    }
};

// Fonction pour mettre à jour un véhicule
export const updateVehicle = async (id, updatedFields) => {
    try {
        const response = await axios.put(`${VEHICULE_API_URL}/${id}`, updatedFields);
        return response.data.vehicule; // Retourner le véhicule mis à jour
    } catch (error) {
        console.error(`Erreur lors de la mise à jour du véhicule avec ID ${id}:`, error);
        throw error;
    }
};

// Fonction pour supprimer un véhicule par ID
export const deleteVehicle = async (id) => {
    try {
        await axios.delete(`${VEHICULE_API_URL}/${id}`);
        console.log(`Véhicule avec ID ${id} supprimé avec succès.`);
    } catch (error) {
        console.error(`Erreur lors de la suppression du véhicule avec ID ${id}:`, error);
        throw error;
    }
};
