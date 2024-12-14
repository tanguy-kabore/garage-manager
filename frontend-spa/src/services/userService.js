// userService.js
import axios from '../utils/axios';

const USER_API_URL = process.env.REACT_APP_USER_API_URL;

// Fonction pour récupérer tous les utilisateurs
export const getUsers = async () => {
    try {
        const { data } = await axios.get(USER_API_URL);
        console.log('Utilisateurs récupérés avec Axios:', data);
        return data.users; // Récupérer et retourner uniquement la liste des utilisateurs
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        throw error;
    }
};

// Fonction pour récupérer un utilisateur par ID ou email
export const getUserByIdentifier = async (identifier) => {
    try {
        const response = await axios.get(`${USER_API_URL}/${identifier}`);
        console.log('Réponse de l\'API:', response.data.user); // Ajoutez ce log pour vérifier la réponse
        return response.data.user;
    } catch (error) {
        console.error(`Erreur lors de la récupération de l'utilisateur avec l'identifiant ${identifier}:`, error);
        throw error;
    }
};

// Fonction pour récupérer les utilisateurs par rôle
export const getUsersByRole = async (role) => {
    try {
        const users = await getUsers();
        if (!Array.isArray(users)) {
            throw new Error('La liste des utilisateurs n’est pas un tableau.');
        }
        const filteredUsers = users.filter(user => user.role === role);
        return filteredUsers;
    } catch (error) {
        console.error(`Erreur lors de la récupération des utilisateurs avec le rôle ${role}:`, error);
        throw error;
    }
};

// Autres fonctions (createUser, updateUser, deleteUser) sont similaires et peuvent être ajoutées de la même manière


// Fonction pour créer un nouvel utilisateur
export const createUser = async (newUser) => {
    try {
        const response = await axios.post(USER_API_URL, newUser);
        return response.data.user; // Retourner l'utilisateur créé
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        throw error;
    }
};

// Fonction pour mettre à jour un utilisateur
export const updateUser = async (id, updatedFields) => {
    try {
        const response = await axios.put(`${USER_API_URL}/${id}`, updatedFields);
        return response.data.user; // Retourner l'utilisateur mis à jour
    } catch (error) {
        console.error(`Erreur lors de la mise à jour de l'utilisateur avec ID ${id}:`, error);
        throw error;
    }
};

// Fonction pour supprimer un utilisateur par ID
export const deleteUser = async (id) => {
    try {
        await axios.delete(`${USER_API_URL}/${id}`);
        console.log(`Utilisateur avec ID ${id} supprimé avec succès.`);
    } catch (error) {
        console.error(`Erreur lors de la suppression de l'utilisateur avec ID ${id}:`, error);
        throw error;
    }
};
