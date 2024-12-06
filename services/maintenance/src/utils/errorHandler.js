/**
 * Middleware de gestion des erreurs.
 *
 * Ce middleware est utilisé pour capturer et gérer les erreurs qui surviennent dans l'application. 
 * Lorsqu'une erreur est lancée, il enregistre l'erreur dans la console et répond avec un message d'erreur 
 * générique, ainsi qu'un code de statut HTTP 500 (erreur interne du serveur).
 * 
 * Ce middleware doit être utilisé à la fin de la chaîne de middleware dans votre application 
 * afin de capturer toutes les erreurs qui n'ont pas été traitées précédemment.
 *
 * Exemple d'utilisation :
 * ```javascript
 * const errorHandler = require('./utils/errorHandler');
 * app.use(errorHandler);
 * ```
 *
 * @param {Error} err - L'objet erreur généré, qui contient des informations sur l'erreur.
 * @param {Object} req - L'objet de la requête HTTP.
 * @param {Object} res - L'objet de la réponse HTTP.
 * @param {Function} next - La fonction pour passer le contrôle au middleware suivant (non utilisée ici).
 *
 * @returns {void} - Cette fonction ne retourne rien, elle répond directement à la requête.
 */
const errorHandler = (err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    message: err.message || 'Internal Server Error',
  });
};

module.exports = errorHandler;
