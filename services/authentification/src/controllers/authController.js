/**
 * Contrôleur pour la gestion de l'authentification des utilisateurs.
 *
 * Ce module permet la gestion de la connexion et de la déconnexion des utilisateurs.
 * Il communique avec le service utilisateur pour vérifier les informations de l'utilisateur
 * et génère un token JWT pour l'authentification.
 *
 * Fonctionnalités :
 * - Connexion de l'utilisateur après vérification des identifiants (email et mot de passe).
 * - Génération d'un token JWT pour l'utilisateur connecté.
 * - Déconnexion de l'utilisateur en invalidant son token (en l'ajoutant à une liste noire).
 * 
 * Utilise les packages suivants :
 * - `jsonwebtoken` pour la génération du token JWT.
 * - `axios` pour appeler le service utilisateur et récupérer les informations de l'utilisateur.
 * - `bcrypt` pour comparer le mot de passe hashé de l'utilisateur.
 */
 
const jwt = require('jsonwebtoken');
const axios = require('axios');
require('dotenv').config();

// Liste noire des tokens invalidés
let blacklistedTokens = [];

/**
 * Méthode permettant à un utilisateur de se connecter.
 *
 * Cette méthode reçoit l'email et le mot de passe d'un utilisateur, puis elle :
 * - Vérifie si l'utilisateur existe en appelant le service utilisateur.
 * - Compare le mot de passe envoyé avec celui stocké dans la base de données (mot de passe hashé).
 * - Si l'authentification réussit, un token JWT est généré pour l'utilisateur avec une durée de validité de 1 heure.
 * - En cas d'échec, elle retourne un message d'erreur avec un statut 401 (identifiants incorrects).
 *
 * @param {Object} req - L'objet de la requête contenant les informations de connexion.
 * @param {Object} res - L'objet de la réponse pour renvoyer un message d'erreur ou un token.
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Utiliser l'URL du service utilisateur depuis les variables d'environnement
    const userServiceUrl = process.env.USER_SERVICE_URL;

    // Appeler le service User pour récupérer l'utilisateur
    const userResponse = await axios.get(`${userServiceUrl}/${email}`);
    const user = userResponse.data;

    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    // Comparer le mot de passe hashé
    const bcrypt = require('bcrypt');
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    // Générer un token JWT
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });
    res.status(200).json({ message: 'Connexion réussie', token });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};

/**
 * Méthode permettant de déconnecter un utilisateur.
 *
 * Cette méthode invalide le token JWT de l'utilisateur. En pratique, cela consiste à ajouter le token 
 * à une liste noire afin de le rendre invalide.
 * La prochaine fois que ce token sera utilisé pour une requête, il sera rejeté.
 *
 * @param {Object} req - L'objet de la requête contenant le token à invalider.
 * @param {Object} res - L'objet de la réponse pour renvoyer un message de déconnexion réussie.
 */
exports.logout = (req, res) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Récupérer le token depuis l'en-tête Authorization
  
  if (!token) {
    return res.status(400).json({ message: 'Aucun token fourni' });
  }

  // Ajouter le token à la liste noire pour le rendre invalide
  blacklistedTokens.push(token);
  
  // Répondre que la déconnexion a réussi
  res.status(200).json({ message: 'Déconnexion réussie' });
};

/**
 * Middleware pour vérifier si un token est dans la liste noire.
 * Ce middleware vérifie si le token JWT est dans la liste noire avant de permettre l'accès à la route.
 *
 * @param {Object} req - L'objet de la requête.
 * @param {Object} res - L'objet de la réponse.
 * @param {Function} next - Fonction pour passer au middleware suivant.
 */
exports.verifyTokenNotBlacklisted = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Récupérer le token depuis l'en-tête Authorization
  
  if (blacklistedTokens.includes(token)) {
    return res.status(403).json({ message: 'Token invalide, veuillez vous reconnecter.' });
  }
  
  next();
};
