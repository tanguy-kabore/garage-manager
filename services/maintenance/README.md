# Service de Maintenance

Le service de maintenance est une API REST qui permet de gérer les opérations de maintenance pour les véhicules. Ce service utilise **Kafka** pour la communication inter-services.

---

## Introduction

Le service de maintenance permet de créer, mettre à jour et gérer les maintenances des véhicules dans un garage. Chaque maintenance est associée à un véhicule, un mécanicien, et un statut. Ce service communique avec d'autres services via Kafka pour assurer une gestion efficace.

### Fonctionnalités principales
1. **Création de maintenance** : Permet de créer une nouvelle opération de maintenance pour un véhicule.
2. **Mise à jour du statut** : Permet de mettre à jour le statut d'une maintenance, par exemple de "planifiée" à "terminée".
3. **Communication avec Kafka** : Utilisation de Kafka pour la gestion des messages et l'intercommunication avec d'autres services.

---

## Prérequis

Avant de démarrer le service de maintenance, assurez-vous que les éléments suivants sont configurés :

1. **Node.js** (v14 ou supérieur)
2. **Kafka** installé et configuré sur `localhost:9092`
3. **Base de données MySQL** avec les tables nécessaires configurées

---

## Installation

### 1. Clonez le dépôt
Clonez le repository Git du projet pour récupérer tous les fichiers nécessaires :

```bash
git clone https://github.com/tanguy-kabore/garage-manager.git
cd garage-manager/services/maintenance
```

### 2. Installez les dépendances
Installez toutes les dépendances nécessaires via npm :

```bash
npm install
```

### 3. Configurez le service
Créez un fichier `.env` à la racine du répertoire `src` et configurez les variables suivantes :

```bash
PORT=3001
MYSQL_HOST=localhost
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DATABASE=garage_maintenance
KAFKA_BROKER=localhost:9092
KAFKA_CLIENT_ID=maintenance-service
```

---

## Démarrage

Pour démarrer le service de maintenance, exécutez la commande suivante :

```bash
node src/app.js
```

---

## Utilisation de l'API

### **Base URL**
```
http://localhost:3001/api
```

### **Endpoints disponibles**

#### **1. Créer une maintenance**
- **URL** : `/maintenances`
- **Méthode** : `POST`
- **Corps de la requête** :
```json
{
  "vehicle_id": 1,
  "start_date": "2024-12-01",
  "end_date": "2024-12-02",
  "mechanic_id": 2,
  "status": "planned"
}
```
- **Réponse** :
```json
{
  "fieldCount": 0,
  "affectedRows": 1,
  "insertId": 2,
  "info": "",
  "serverStatus": 2,
  "warningStatus": 0,
  "changedRows": 0
}
```

#### **2. Mettre à jour le statut d'une maintenance**
- **URL** : `/maintenances/:id`
- **Méthode** : `PATCH`
- **Paramètres** :
  - `id` : Identifiant de la maintenance
- **Corps de la requête** :
```json
{
  "status": "completed"
}
```
- **Réponse** :
```json
{
  "message": "Maintenance status updated"
}
```

---

## Gestion des erreurs

### Kafka : `There is no leader for this topic-partition as we are in the middle of a leadership election`

Cette erreur indique que Kafka est en train d'élire un leader pour le topic-partition utilisé par le service.

#### Solutions possibles :
- Assurez-vous que Kafka est correctement configuré et que le cluster est stable.
- Vérifiez les logs de Kafka pour identifier les problèmes spécifiques.

### Installation de Kafka
Si Kafka n'est pas encore installé sur votre machine, vous pouvez suivre ce tutoriel vidéo pour l'installer et le configurer :  
[Installation de Kafka sur Windows](https://www.youtube.com/watch?v=BwYFuhVhshI&ab_channel=AmpCode)

Assurez-vous de suivre les étapes pour télécharger Kafka, configurer ZooKeeper (si nécessaire), et démarrer le broker Kafka sur `localhost:9092`.

---

## Conclusion

Ce service de maintenance permet de gérer efficacement les opérations de maintenance pour les véhicules, tout en utilisant Kafka pour une communication fluide entre différents services. Le processus est simple et sécurisé, et il offre une interface API claire pour l'intégration avec d'autres systèmes.