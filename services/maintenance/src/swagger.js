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
    openapi: '3.0.0', // Version OpenAPI
    info: {
      title: 'API de Gestion des Services de Maintenance', // Titre de l'API
      version: '1.0.0', // Version actuelle de l'API
      description: `
        Cette API permet de gérer les services de maintenance.
        La documentation ci-dessous décrit toutes les routes disponibles, leurs paramètres, et les réponses attendues.`,
    },
    servers: [
      {
        url: `http://localhost:${port}`, // URL de base de votre API
        description: 'Serveur de développement local',
      },
    ],
    components: {
      schemas: {
        Maintenance: {
          type: 'object',
          required: ['id', 'description', 'status', 'start_date', 'end_date', 'vehicle_id', 'mechanic_id', 'amount', 'createdAt', 'updatedAt'],
          properties: {
            id: {
              type: 'integer',
              description: 'Identifiant unique de la maintenance',
              example: 8,
            },
            description: {
              type: 'string',
              description: 'Description de la maintenance',
              example: 'Changement des pneus avant',
            },
            status: {
              type: 'string',
              description: 'Statut de la maintenance',
              enum: ['completed', 'pending', 'confirmed'],
              example: 'completed',
            },
            start_date: {
              type: 'string',
              format: 'date-time',
              description: 'Date de début de la maintenance',
              example: '2024-12-09T10:00:00.000Z',
            },
            end_date: {
              type: 'string',
              format: 'date-time',
              description: 'Date de fin de la maintenance',
              example: '2024-12-09T12:00:00.000Z',
            },
            vehicle_id: {
              type: 'integer',
              description: 'Identifiant du véhicule associé',
              example: 1,
            },
            mechanic_id: {
              type: 'integer',
              description: 'Identifiant du mécanicien chargé de la maintenance',
              example: 3,
            },
            amount: {
              type: 'integer',
              description: 'Montant de la maintenance',
              example: 3000,
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création de la maintenance',
              example: '2024-12-06T12:19:19.000Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de la dernière mise à jour',
              example: '2024-12-07T13:21:19.000Z',
            },
          },
        },
        MaintenanceList: {
          type: 'object',
          properties: {
            message: {
              type: 'string',
              description: 'Message générique',
              example: 'All maintenances',
            },
            maintenances: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Maintenance',
              },
              description: 'Liste des maintenances',
            },
          },
        },
      },
    },
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
