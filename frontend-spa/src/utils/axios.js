import axios from 'axios';

// Créer une instance Axios personnalisée
const instance = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    timeout: 10000,
});

// Ajouter un intercepteur pour les requêtes
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Ne pas rediriger pour les routes publiques comme /auth/login
            const publicRoutes = ['/auth/login', '/auth/signup'];
            if (!publicRoutes.some((route) => error.config.url.startsWith(route))) {
                console.warn('Session expirée. Redirection vers la page de connexion.');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
