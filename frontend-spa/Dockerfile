# Étape 1 : Construction
FROM node:16 AS build

# Définir le répertoire de travail
WORKDIR /app

# Copier les fichiers package.json et package-lock.json
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le code source
COPY . .

# Construire l'application
RUN npm run build

# Étape 2 : Serveur web NGINX pour servir les fichiers statiques
FROM nginx:stable-alpine

# Copier les fichiers construits depuis l'étape précédente
COPY --from=build /app/build /usr/share/nginx/html

# Copier un fichier de configuration NGINX personnalisé (optionnel)
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exposer le port 80
EXPOSE 80

# Commande par défaut pour démarrer le serveur NGINX
CMD ["nginx", "-g", "daemon off;"]
