/**
 * Point d'entrée principal de l'application.
 * 
 * Ce fichier configure et lance le serveur Express, en définissant les routes 
 * pour gérer les maintenances et en incluant un middleware pour la gestion des erreurs.
 * Il utilise également `module-alias/register` pour la gestion des alias de modules.
 * 
 * Le serveur écoute sur le port défini dans l'environnement (`PORT`) ou, par défaut, sur le port 3001.
 * 
 * @module
 */

require('module-alias/register');
const express = require('express');
const cors = require('cors');
const maintenanceRoutes = require('@routes/maintenanceRoutes');
const errorHandler = require('@utils/errorHandler');
const { specs, swaggerUi } = require('@src/swagger');

const app = express();

// Configuration de CORS
app.use(cors()); // Autorise toutes les origines par défaut

// Middleware pour parser le JSON
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Routes
app.use('/api/maintenances', maintenanceRoutes);

// Gestion des erreurs
app.use(errorHandler);

// Lancer le serveur
const port = process.env.PORT;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log(`API Docs available at http://localhost:${port}/api-docs`);
});
