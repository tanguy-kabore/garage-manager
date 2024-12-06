/**
 * Configuration du client Kafka pour le service de notification.
 *
 * Ce module initialise et exporte un client Kafka configuré à l'aide de la bibliothèque `kafkajs`. 
 * Kafka est une plateforme de messagerie distribuée utilisée pour gérer les flux de données 
 * en temps réel entre les services et applications.
 *
 * Paramètres :
 * - `clientId` : Identifiant unique pour ce client Kafka, ici défini comme `notification-service`.
 * - `brokers` : Tableau contenant l'URL des brokers Kafka. La valeur est extraite de la variable
 *   d'environnement `KAFKA_BROKER`. Les brokers Kafka sont les serveurs qui gèrent les clusters Kafka.
 *
 * Utilisation :
 * 1. Importez ce module dans vos fichiers pour obtenir une instance configurée du client Kafka.
 * 2. Utilisez cette instance pour produire ou consommer des messages dans les topics Kafka.
 *
 * Exemple :
 * ```javascript
 * const kafka = require('./kafka');
 * const producer = kafka.producer();
 *
 * await producer.connect();
 * await producer.send({
 *   topic: 'notifications',
 *   messages: [
 *     { value: 'Message de test' },
 *   ],
 * });
 * await producer.disconnect();
 * ```
 *
 * Prérequis :
 * - Assurez-vous que Kafka est correctement configuré et accessible via l'URL spécifiée
 *   dans `process.env.KAFKA_BROKER`.
 * - La variable d'environnement `KAFKA_BROKER` doit être définie avec l'URL d'un ou plusieurs brokers Kafka.
 *
 * @module kafka
 */

const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'notification-service',
  brokers: [process.env.KAFKA_BROKER],
});

module.exports = kafka;
