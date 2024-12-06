/**
 * @file swagger.js
 * @description Configuration de Swagger pour documenter l'API Express.
 * Ce fichier configure et initialise Swagger UI et Swagger JSDoc afin de fournir
 * une documentation interactive pour les routes définies dans votre application.
 * 
 * @dependencies
 * - `swagger-jsdoc`: Génère automatiquement la documentation Swagger à partir des annotations JSDoc.
 * - `swagger-ui-express`: Sert l'interface utilisateur Swagger pour consulter la documentation API.
 */

const dotenv = require('dotenv');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

dotenv.config();
const port = process.env.PORT;

// Options de configuration pour Swagger JSDoc
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Kafka Consumer Documentation',
      version: '1.0.0',
      description: 'Documentation du consommateur Kafka pour les notifications de maintenance',
    },
    components: {
      schemas: {
        MaintenanceEvent: {
          type: 'object',
          properties: {
            event: {
              type: 'string',
              description: 'Type de l\'événement (created, completed, cancelled)',
              example: 'created',
            },
            maintenance: {
              type: 'object',
              description: 'Informations détaillées sur la maintenance',
              properties: {
                id: { type: 'string', description: 'ID de la maintenance', example: '12345' },
                description: { type: 'string', description: 'Description de la maintenance', example: 'Maintenance préventive' },
                date: { type: 'string', format: 'date-time', description: 'Date de la maintenance', example: '2024-12-05T10:00:00Z' },
              },
            },
          },
        },
      },
    },
    servers: [
      {
        url: `http://localhost:${port}`, // URL de base de votre API
        description: 'Serveur de développement local',
      },
    ],
  },
  apis: ['./src/routes/*.js'], // Chemin vers les fichiers contenant les routes annotées
};

// Génération des spécifications Swagger
const specs = swaggerJsdoc(options);

// Export des modules pour une utilisation dans l'application principale
module.exports = {
  specs, // Spécifications Swagger
  swaggerUi, // Middleware Swagger UI
};
