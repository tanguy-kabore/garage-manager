import axios from '../utils/axios';

const AUTH_API_URL = process.env.REACT_APP_AUTH_API_URL;
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${AUTH_API_URL}/login`, { email, password });
    const { token, user } = response.data;

    // Stocker le token pour les requêtes futures
    localStorage.setItem('authToken', token);

    return { token, user };
  } catch (error) {
    console.error('Erreur lors de la connexion :', error.response?.data || error.message);
    throw error;
  }
};
