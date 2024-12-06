/**
 * Point d'entrée principal du service utilisateur.
 *
 * Ce fichier initialise l'application Express, configure les middlewares nécessaires,
 * et définit les routes pour le service utilisateur.
 *
 * Fonctionnalités :
 * - Chargement des variables d'environnement via `dotenv`.
 * - Gestion des requêtes JSON et des headers CORS.
 * - Définition des routes pour les utilisateurs via `/api/users`.
 * - Démarrage du serveur sur le port défini.
 *
 * Utilise :
 * - `express` pour créer l'application web.
 * - `dotenv` pour charger les configurations d'environnement.
 * - `cors` pour gérer les politiques de partage de ressources entre origines.
 * - Les routes utilisateur depuis `./routes/userRoutes`.
 */

require('module-alias/register');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const userRoutes = require('@routes/userRoutes');
const { specs, swaggerUi } = require('@src/swagger');

// Charger les variables d'environnement
dotenv.config();

const app = express();
const port = process.env.PORT;

// Configurer les middlewares
app.use(cors()); // Autoriser les requêtes cross-origin
app.use(express.json()); // Permettre le traitement des requêtes JSON

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Définir les routes pour les utilisateurs
app.use('/api/users', userRoutes);

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API Docs available at http://localhost:${port}/api-docs`);
  });
