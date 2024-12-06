require('module-alias/register');
require('dotenv').config();
const express = require('express');
const { runConsumer } = require('@consumers/maintenanceConsumer');
const redisClient = require('@config/redis');
const { specs, swaggerUi } = require('@src/swagger');

const app = express();
const port = process.env.PORT;

/**
 * Démarre le serveur de notifications et les consommateurs Kafka et Redis.
 * 
 * Ce service utilise Express pour exposer un endpoint HTTP de base et se connecte à Kafka
 * pour consommer des événements de maintenance. Il se connecte également à Redis pour la gestion
 * de l'état ou du cache des données. Lors du démarrage du serveur, il tente de démarrer le consommateur Kafka
 * et se connecte à Redis. Si un problème survient avec l'un des services, une erreur est enregistrée.
 * 
 * - L'API expose une route GET sur `/` pour vérifier si le service fonctionne.
 * - Le consommateur Kafka est lancé et écoute les événements de maintenance.
 * - Une connexion Redis est établie pour interagir avec le cache ou la gestion des données.
 * 
 * @returns {void}
 * 
 * @example
 * // Pour démarrer le serveur, vous pouvez exécuter ce script avec Node.js.
 * nodemon ./src/index.js
 */
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  console.log(`API Docs available at http://localhost:${port}/api-docs`);

  try {
    await runConsumer();
    console.log('Kafka consumer is running.');
  } catch (error) {
    console.error('Error starting Kafka consumer:', error);
  }

  redisClient.on('connect', () => {
    console.log('Redis connected.');
  });
});
