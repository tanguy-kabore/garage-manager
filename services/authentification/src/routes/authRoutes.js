const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Import the middleware

// Routes d'authentification
router.post('/signup', authController.signup);
router.post('/login', authController.login);

// Exemple de route protégée (nécessite un token valide)
router.get('/protected', authMiddleware.auth, (req, res) => {
  res.json({ message: `Hello, ${req.user.email}! You are authenticated.` });
});

module.exports = router;