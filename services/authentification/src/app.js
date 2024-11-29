const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const sequelize = require('./config/database'); // Import de la connexion à la base de données

dotenv.config(); // Charger les variables d'environnement

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);

// Synchronisation avec la base de données
sequelize.sync()
  .then(() => {
    console.log('Base de données synchronisée');
  })
  .catch(err => {
    console.error('Erreur lors de la synchronisation de la base de données:', err);
  });

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur en écoute sur le port ${port}`);
});