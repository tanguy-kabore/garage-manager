/**
 * Contrôleur pour la gestion des utilisateurs.
 *
 * Ce module contient des fonctions pour créer, récupérer, mettre à jour et supprimer des utilisateurs.
 * 
 * Fonctionnalités :
 * - Créer un utilisateur avec vérification des doublons et des rôles.
 * - Obtenir tous les utilisateurs.
 * - Obtenir un utilisateur par email ou ID.
 * - Mettre à jour les informations d'un utilisateur.
 * - Supprimer un utilisateur.
 *
 * Utilise les packages suivants :
 * - `bcrypt` pour le hachage des mots de passe.
 */

const User = require('@models/user');
const bcrypt = require('bcrypt');

/**
 * Créer un utilisateur.
 *
 * Cette méthode permet de créer un utilisateur en vérifiant que l'email est unique,
 * que le rôle est valide, et en sécurisant le mot de passe via un hachage.
 *
 * @param {Object} req - La requête HTTP contenant les données de l'utilisateur.
 * @param {Object} res - La réponse HTTP renvoyée au client.
 */
exports.createUser = async (req, res) => {
  try {
    const { firstName, lastName, address, email, password, role } = req.body;

    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Utilisateur déjà existant' });
    }

    // Vérification des rôles
    /*if (!['client', 'mecanicien'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide. Utilisez "client" ou "mecanicien".' });
    }*/

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const newUser = await User.create({
      firstName,
      lastName,
      address,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
  } catch (error) {
    console.error('Erreur lors de la création de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Obtenir tous les utilisateurs.
 *
 * Cette méthode récupère la liste complète des utilisateurs de la base de données.
 *
 * @param {Object} req - La requête HTTP.
 * @param {Object} res - La réponse HTTP renvoyée au client avec la liste des utilisateurs.
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ message: 'Utilisateurs récupérés avec succès', users: users });
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Obtenir un utilisateur par email ou ID.
 *
 * Cette méthode récupère un utilisateur spécifique en fonction de son email ou de son identifiant.
 *
 * @param {Object} req - La requête HTTP contenant l'identifiant (email ou ID).
 * @param {Object} res - La réponse HTTP renvoyée au client avec les informations de l'utilisateur.
 */
exports.getUser = async (req, res) => {
  try {
    const { identifier } = req.params;

    // Vérifiez si l'identifiant est un email ou un ID (en fonction du format)
    const user = identifier.includes('@')
      ? await User.findOne({ where: { email: identifier } })
      : await User.findByPk(identifier);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    res.status(200).json({ message: 'Utilisateur récupéré avec succès', user: user });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Mettre à jour un utilisateur.
 *
 * Cette méthode met à jour les informations d'un utilisateur spécifique en vérifiant que le rôle est valide.
 *
 * @param {Object} req - La requête HTTP contenant les nouvelles données de l'utilisateur.
 * @param {Object} res - La réponse HTTP renvoyée au client avec les informations mises à jour de l'utilisateur.
 */
exports.updateUser = async (req, res) => {
  try {
    const { firstName, lastName, address, email, role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Validation des rôles
    if (role && !['client', 'mecanicien'].includes(role)) {
      return res.status(400).json({ message: 'Rôle invalide. Utilisez "client" ou "mecanicien".' });
    }

    // Mise à jour des informations utilisateur
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.address = address || user.address;
    user.email = email || user.email;
    user.role = role || user.role;

    await user.save();
    res.status(200).json({ message: 'Utilisateur mis à jour avec succès', user: user });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Supprimer un utilisateur.
 *
 * Cette méthode supprime un utilisateur spécifique de la base de données.
 *
 * @param {Object} req - La requête HTTP contenant l'ID de l'utilisateur à supprimer.
 * @param {Object} res - La réponse HTTP confirmant la suppression de l'utilisateur.
 */
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    await user.destroy();
    res.status(200).json({ message: 'Utilisateur supprimé avec succès', user: user });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur :', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};
