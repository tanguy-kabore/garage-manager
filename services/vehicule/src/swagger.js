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
      title: "API de Gestion des Véhicules", // Titre de l'API
      version: '1.0.0', // Version actuelle de l'API
      description: `
        Cette API permet de gérer les opérations CRUD sur les véhicules.
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
        Vehicule: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Identifiant unique du véhicule',
              example: 1,
            },
            marque: {
              type: 'string',
              description: 'Marque du véhicule',
              example: 'Toyota',
            },
            modele: {
              type: 'string',
              description: 'Modèle du véhicule',
              example: 'Corolla',
            },
            annee: {
              type: 'integer',
              description: 'Année de fabrication',
              example: 2021,
            },
            num_immatriculation: {
              type: 'string',
              description: 'Numéro d\'immatriculation unique',
              example: 'ABC-12345',
            },
            kilometrage: {
              type: 'integer',
              description: 'Kilométrage du véhicule',
              example: 25000,
            },
            proprietaire_id: {
              type: 'integer',
              description: 'Identifiant du propriétaire',
              example: 1,
            },
          },
          required: ['marque', 'modele', 'annee', 'num_immatriculation', 'kilometrage', 'proprietaire_id'],
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indique le succès ou l\'échec de l\'opération',
              example: false,
            },
            message: {
              type: 'string',
              description: 'Message décrivant l\'erreur',
              example: 'Une erreur est survenue.',
            },
          },
        },
      },
      responses: {
        NotFound: {
          description: 'Ressource non trouvée',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
            },
          },
        },
        ValidationError: {
          description: 'Erreur de validation des données',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/ErrorResponse',
              },
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
