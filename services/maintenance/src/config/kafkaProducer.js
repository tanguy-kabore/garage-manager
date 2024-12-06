/**
 * Module de gestion du producteur Kafka pour l'envoi de messages.
 *
 * Ce module configure un producteur Kafka en utilisant la bibliothèque `kafkajs` pour envoyer des messages à un 
 * topic spécifique sur un cluster Kafka. Le producteur est initialisé avec un `clientId` et une liste de brokers 
 * Kafka définis dans les variables d'environnement. La fonction `send` permet d'envoyer des messages à un topic donné.
 *
 * Variables de configuration :
 * - `KAFKA_CLIENT_ID` : Identifiant du client Kafka utilisé pour se connecter au cluster (défini dans `.env`).
 * - `KAFKA_BROKERS` : Liste des serveurs Kafka utilisés pour la connexion (définie dans `.env`).
 *
 * Fonctionnalités :
 * - Connexion au cluster Kafka pour envoyer des messages à un topic spécifié.
 * - Déconnexion propre du producteur après l'envoi du message.
 * 
 * Exemple d'utilisation :
 * ```javascript
 * const { send } = require('./config/kafkaProducer');
 *
 * send({
 *   topic: 'maintenance-events',
 *   messages: [
 *     { value: JSON.stringify({ event: 'created', maintenance: { ... } }) }
 *   ]
 * });
 * ```
 *
 * Gestion des erreurs :
 * - Si une erreur survient lors de la connexion ou de l'envoi du message, un message d'erreur est enregistré dans 
 *   la console.
 *
 * @module kafkaProducer
 */

const { Kafka } = require('kafkajs');
require('dotenv').config(); // Charge les variables d'environnement depuis .env

// Récupérer les variables d'environnement
const kafkaClientId = process.env.KAFKA_CLIENT_ID || 'maintenance-service';
const kafkaBrokers = process.env.KAFKA_BROKERS ? process.env.KAFKA_BROKERS.split(',') : ['localhost:9092'];

// Initialiser le client Kafka
const kafka = new Kafka({
  clientId: kafkaClientId,
  brokers: kafkaBrokers, // Liste des brokers Kafka depuis les variables d'environnement
});

// Créer un producteur
const producer = kafka.producer();

/**
 * Envoie un message à Kafka.
 *
 * Cette fonction envoie un message à un topic spécifié sur le serveur Kafka. Le message est envoyé après que la 
 * connexion au producteur soit établie. Après l'envoi, la connexion au producteur est fermée proprement.
 *
 * @param {Object} params - Paramètres de la fonction.
 * @param {string} params.topic - Le nom du topic Kafka où le message sera envoyé.
 * @param {Array} params.messages - Tableau des messages à envoyer. Chaque message doit être un objet avec un 
 *        champ `value` contenant les données à envoyer sous forme de chaîne JSON.
 * 
 * @throws {Error} Si une erreur se produit lors de l'envoi du message.
 */
const send = async ({ topic, messages }) => {
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages,
    });
  } catch (error) {
    console.error('Error sending message to Kafka:', error);
  } finally {
    await producer.disconnect();
  }
};

module.exports = { send };
