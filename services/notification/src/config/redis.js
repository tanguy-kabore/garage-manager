/**
 * Configuration et gestion du client Redis pour le service de notification.
 *
 * Ce module initialise et exporte un client Redis configuré à l'aide de la bibliothèque `redis`. 
 * Redis est une base de données en mémoire utilisée principalement comme cache ou stockage 
 * temporaire pour améliorer les performances et la rapidité des applications.
 *
 * Paramètres :
 * - `url` : URL du serveur Redis, définie dans la variable d'environnement `REDIS_URL`. 
 *   Cela permet au client de se connecter au serveur Redis spécifié.
 *
 * Gestion des événements :
 * - Un gestionnaire d'événements `on('error')` est configuré pour capturer et afficher 
 *   toute erreur pouvant survenir lors des opérations avec Redis.
 * - La méthode `connect()` est utilisée pour établir la connexion avec le serveur Redis.
 *
 * Utilisation :
 * 1. Importez ce module pour accéder à une instance configurée du client Redis.
 * 2. Utilisez l'instance pour des opérations telles que `GET`, `SET`, `DEL` ou d'autres commandes Redis.
 *
 * Exemple :
 * ```javascript
 * const redisClient = require('./redis');
 * 
 * async function cacheData(key, value) {
 *   await redisClient.set(key, value, { EX: 3600 }); // Définit une clé avec une expiration de 1 heure
 *   console.log(`Données mises en cache pour la clé : ${key}`);
 * }
 * 
 * async function getData(key) {
 *   const data = await redisClient.get(key);
 *   return data ? `Données récupérées : ${data}` : 'Aucune donnée trouvée.';
 * }
 * ```
 *
 * Prérequis :
 * - Redis doit être installé et accessible via l'URL spécifiée dans `process.env.REDIS_URL`.
 * - La variable d'environnement `REDIS_URL` doit être configurée correctement pour permettre
 *   une connexion au serveur Redis.
 *
 * @module redisClient
 */

const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Redis error:', err));
redisClient.connect();

module.exports = redisClient;
