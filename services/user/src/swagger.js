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
      title: "API de Gestion des Services d'utilisateur", // Titre de l'API
      version: '1.0.0', // Version actuelle de l'API
      description: `
        Cette API permet de gérer les services d'utilisateur.
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
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
            },
            firstName: {
              type: 'string',
            },
            lastName: {
              type: 'string',
            },
            address: {
              type: 'string',
              nullable: true,
            },
            email: {
              type: 'string',
              format: 'email',
            },
            role: {
              type: 'string',
              enum: ['client', 'mecanicien'],
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
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
