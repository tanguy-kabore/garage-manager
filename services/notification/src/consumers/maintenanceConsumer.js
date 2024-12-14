/** 
 * Module de gestion des événements Kafka pour les notifications de maintenance.
 *
 * Ce module configure un consommateur Kafka pour écouter un topic spécifique, traiter les messages reçus,
 * et déclencher des notifications en conséquence. Il utilise la bibliothèque `kafkajs` pour interagir 
 * avec le cluster Kafka et des services définis pour gérer la logique métier.
 *
 * Fonctionnalités :
 * - Connexion au cluster Kafka en tant que consommateur dans un groupe nommé `notification-group`.
 * - Abonnement au topic `maintenance-events` pour recevoir des événements liés à la maintenance.
 * - Traitement des messages reçus en exécutant la logique appropriée selon le type d'événement.
 * 
 * Types d'événements pris en charge :
 * - `created` : Crée une nouvelle notification de maintenance.
 * - `completed` : Marque une maintenance comme terminée et envoie une notification.
 * - `cancelled` : Annule une maintenance et envoie une notification correspondante.
 * 
 * Exemple d'utilisation :
 * ```javascript
 * const { runConsumer } = require('./consumer');
 *
 * runConsumer()
 *   .then(() => console.log('Consumer Kafka lancé avec succès.'))
 *   .catch((err) => console.error('Erreur lors du lancement du consumer Kafka :', err));
 * ```
 *
 * @module runConsumer
 */

const kafka = require('@config/kafka');
const { sendMaintenanceNotification } = require('@services/notificationService');

const consumer = kafka.consumer({ groupId: 'notification-group' });

async function runConsumer() {
  try {
    await consumer.connect();
    console.log('Connexion au cluster Kafka réussie.');

    await consumer.subscribe({ topic: 'maintenance-events', fromBeginning: false });
    console.log("Abonnement au topic 'maintenance-events' effectué avec succès.");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const event = JSON.parse(message.value.toString());
          console.log(`[Kafka] Message reçu du topic ${topic}, partition ${partition}:`, event);

          // Gestion des événements spécifiques
          switch (event.event) {
            case 'created':
              console.log(`Création de maintenance :`, event.maintenance);
              await sendMaintenanceNotification(event.maintenance, 'created');
              console.log('Notification envoyée pour la création de maintenance.');
              break;

            case 'confirmed':
              console.log(`Maintenance confirmée :`, event.maintenance);
              await sendMaintenanceNotification(event.maintenance, 'confirmed');
              console.log('Notification envoyée pour la maintenance confirmée.');
              break;

            case 'completed':
              console.log(`Maintenance terminée :`, event.maintenance);
              await sendMaintenanceNotification(event.maintenance, 'completed');
              console.log('Notification envoyée pour la maintenance terminée.');
              break;

            case 'cancelled':
              console.log(`Maintenance annulée :`, event.maintenance);
              await sendMaintenanceNotification(event.maintenance, 'cancelled');
              console.log('Notification envoyée pour la maintenance annulée.');
              break;

            default:
              console.warn(`Type d'événement non reconnu: '${event.event}'. Aucun traitement appliqué.`);
          }
        } catch (error) {
          console.error('Erreur lors du traitement d\'un message Kafka:', error);
        }
      },
    });

    console.log('Consommateur Kafka en cours d\'exécution...');
  } catch (err) {
    console.error('Erreur lors de la configuration ou de l\'exécution du consommateur Kafka:', err);
  }
}

module.exports = { runConsumer };

