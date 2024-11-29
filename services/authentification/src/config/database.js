const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize('garage_auth', 'root', 'root', {
  host: 'localhost',
  dialect: 'mysql',
  logging: false // Désactive les logs de requêtes SQL (optionnel)
});

// Test de connexion
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

module.exports = sequelize; // Exportez directement l'instance Sequelize
