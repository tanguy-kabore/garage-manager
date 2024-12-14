require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
// const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const jwt = require('jsonwebtoken');
const { createProxyMiddleware, fixRequestBody } = require('http-proxy-middleware');
const expressStatusMonitor = require('express-status-monitor');

// Initialisation de l'application
const app = express();

// Middleware de surveillance
app.use(expressStatusMonitor());

// Sécurisation des en-têtes HTTP avec Helmet
// app.use(helmet());

// Middleware de sécurité CORS
app.use(cors({
  origin: '*', // Ajustez pour permettre uniquement les domaines autorisés
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));
app.options('*', cors()); // Permet les requêtes OPTIONS

// Middleware de journalisation
app.use(morgan('combined'));

// Middleware pour les requêtes JSON
app.use(express.json());

// Limitation des requêtes (Rate Limiting) pour prévenir les attaques DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Fenêtre de 15 minutes
  max: 100, // Limite de 100 requêtes par IP
  message: { message: 'Trop de requêtes, veuillez réessayer plus tard.' },
});
app.use(limiter);

// Déclaration des routes vers les microservices
const routes = {
  '/auth': process.env.AUTH_SERVICE_URL,
  '/users': process.env.USER_SERVICE_URL,
  '/maintenances': process.env.MAINTENANCE_SERVICE_URL,
  '/vehicules': process.env.VEHICULE_SERVICE_URL,
};

// Liste des routes exemptées de validation JWT
const exemptedRoutes = [
  '/auth/login',
  '/auth/signup',
];

// Middleware pour valider les tokens JWT
const validateToken = (req, res, next) => {
  // Vérifie si la route fait partie des exemptées
  if (exemptedRoutes.some((route) => req.path.startsWith(route))) {
    return next();
  }

  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ message: 'Token manquant ou invalide.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded; // Ajouter les informations utilisateur au req pour les microservices
    next();
  } catch (err) {
    return res.status(403).json({ message: 'Token invalide.' });
  }
};

// Configuration des middlewares de proxy
Object.entries(routes).forEach(([route, target]) => {
  if (!target) {
    console.error(`URL manquante pour la route ${route}. Vérifiez les variables d'environnement.`);
    return;
  }

  console.log(`Route définie pour : ${route} avec cible ${target}`);
  app.use(
    route,
    // validateToken, // Middleware pour sécuriser les routes avec JWT
    createProxyMiddleware({
      target,
      changeOrigin: true,
      on: {
        proxyReq: fixRequestBody, // Fixer les problèmes liés à bodyParser
      },
      pathRewrite: (path) => path.replace(new RegExp(`^${route}`), ''), // Supprime le préfixe de la route
      onError: (err, req, res) => {
        console.error(`Erreur de proxy pour ${req.originalUrl}:`, err.message);
        res.status(502).json({ message: 'Erreur de communication avec le service cible.' });
      },
      secure: true, // Active les communications sécurisées pour HTTPS
    })
  );
});

// Endpoint de surveillance
app.get('/status', (req, res) => {
  res.status(200).json({ message: 'API Gateway fonctionne correctement' });
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`API Gateway en cours d'exécution sur le port ${PORT}`);
});
