const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérification si l'utilisateur existe déjà
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Utilisateur déjà existant' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer le nouvel utilisateur
    const user = await User.create({ email, password: hashedPassword });

    // Générer le token JWT
    const token = jwt.sign({ userId: user.id }, 'mE9+BL18O7i3H743g6Got5eJFqCxwKi1OxYoMkuyNVs=', { expiresIn: '1h' });

    res.status(201).json({ message: 'Utilisateur créé avec succès', token });
  } catch (error) {
    console.error('Erreur lors de l\'inscription :', error);
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Trouver l'utilisateur par son email
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    // Comparer le mot de passe hashé
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Identifiants incorrects' });
    }

    // Générer le token JWT
    const token = jwt.sign({ userId: user.id }, 'mE9+BL18O7i3H743g6Got5eJFqCxwKi1OxYoMkuyNVs=', { expiresIn: '1h' });

    res.status(200).json({ message: 'Connexion réussie', token });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ message: 'Erreur lors de la connexion' });
  }
};
