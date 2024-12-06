/**
 * Serveur pour la gestion de l'authentification des utilisateurs.
 *
 * Ce fichier configure et lance un serveur Express qui gère les routes d'authentification des utilisateurs.
 * Il utilise les routes définies dans `authRoutes` pour gérer la connexion et la déconnexion des utilisateurs.
 * Le serveur écoute sur le port 3000 et expose une API sous le chemin `/api/auth`.
 *
 * Fonctionnalités :
 * - Chargement de la configuration depuis le fichier `.env` grâce à `dotenv`.
 * - Activation de la gestion des CORS pour permettre les requêtes depuis différentes origines.
 * - Utilisation de `express.json()` pour parser le corps des requêtes en JSON.
 * - Les routes d'authentification sont définies dans `authRoutes`, et sont accessibles sous le préfixe `/api/auth`.
 * - Le serveur écoute sur le port 3000 et affiche un message dans la console lors du démarrage.
 *
 * Utilise les packages suivants :
 * - `express` pour la création du serveur web et la gestion des routes.
 * - `dotenv` pour charger la configuration de l'application à partir du fichier `.env`.
 * - `cors` pour activer le partage de ressources entre origines multiples (Cross-Origin Resource Sharing).
 * - `authRoutes` pour définir les routes de gestion de l'authentification.
 */

require('module-alias/register');
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('@routes/authRoutes');
const { specs, swaggerUi } = require('@src/swagger');

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));
app.use('/api/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`API Docs available at http://localhost:${port}/api-docs`);
  });
