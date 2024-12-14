// maintenanceService.js
import axios from '../utils/axios';

const MAINTENANCE_API_URL = process.env.REACT_APP_MAINTENANCE_API_URL;

// Fonction pour récupérer toutes les maintenances
export const getMaintenances = async () => {
    try {
        const { data } = await axios.get(MAINTENANCE_API_URL);
        return data.maintenances;
    } catch (error) {
        console.error('Erreur lors de la récupération des maintenances:', error);
        throw error;
    }
};

// Fonction pour récupérer une maintenance par ID
export const getMaintenanceById = async (id) => {
    try {
        const { data } = await axios.get(`${MAINTENANCE_API_URL}/${id}`);
        return data.maintenance;
    } catch (error) {
        console.error(`Erreur lors de la récupération de la maintenance avec l'ID ${id}:`, error);
        throw error;
    }
};

// Fonction pour créer une nouvelle maintenance
export const createMaintenance = async (newMaintenance) => {
    try {
        const { data } = await axios.post(MAINTENANCE_API_URL, newMaintenance);
        console.log('data:', data);
        return data.maintenance; // Retourner la maintenance créée
    } catch (error) {
        console.error('Erreur lors de la création de la maintenance:', error);
        throw error;
    }
};

// Fonction pour mettre à jour une maintenance (changement de statut ou autre)
export const updateMaintenance = async (id, updatedFields) => {
    try {
        const { data } = await axios.patch(`${MAINTENANCE_API_URL}/${id}`, updatedFields);
        return data.maintenance; // Retourner la maintenance mise à jour
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de la maintenance avec l'ID ${id}:`, error);
        throw error;
    }
};

// Fonction pour supprimer une maintenance par ID
export const deleteMaintenance = async (id) => {
    try {
        await axios.delete(`${MAINTENANCE_API_URL}/${id}`);
        console.log(`Maintenance avec ID ${id} supprimée avec succès.`);
    } catch (error) {
        console.error(`Erreur lors de la suppression de la maintenance avec l'ID ${id}:`, error);
        throw error;
    }
};
