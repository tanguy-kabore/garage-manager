# Utiliser une image Node.js comme base
FROM node:19-bullseye

# Définir le répertoire de travail
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json dans le répertoire de travail
COPY package*.json ./

# Augmenter la limite des processus utilisateur et installer les dépendances
RUN /bin/bash -c "ulimit -u 1024 && npm install"

# Copier tout le code source dans le conteneur
COPY . .

# Exposer le port de l'application
EXPOSE 8080

# Commande de démarrage de l'application
CMD ["npx", "nodemon", "src/index.js"]
