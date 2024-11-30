Documentation de l'API du Service Client

Vue d'ensemble
Cette documentation couvre les détails de mise en œuvre de l'API de Gestion des Clients au sein de notre projet. L'API facilite les opérations CRUD pour la gestion des données des clients et est construite en utilisant Node.js et Express.

Configuration
- Node.js et Express sont nécessaires pour exécuter le service.
- Swagger est utilisé pour la documentation de l'API.
- Module de base de données : L'API interagit avec la base de données en utilisant un module personnalisé situé à ./database.js.

Points de terminaison de l'API
1. Ajouter un nouveau client
- Point de terminaison : POST /api/clients
- Fonctionnalité : Valide et ajoute de nouvelles données de client à la base de données.
- Validation : Vérifie les champs nécessaires tels que le numéro d'identité, le prénom et le format de l'email.

2. Récupérer les détails du client
- Point de terminaison : GET /api/clients/{id}
- Fonctionnalité : Récupère les détails d'un client spécifique par leur ID.

3. Mettre à jour les détails du client
- Point de terminaison : PUT /api/clients/{id}
- Fonctionnalité : Met à jour les données existantes du client dans la base de données en fonction de l'ID du client fourni.
- Validation : Similaire à l'ajout d'un nouveau client, comprend des vérifications pour la présence de champs et le format de l'email.

4. Supprimer un client
- Point de terminaison : DELETE /api/clients/{id}
- Fonctionnalité : Supprime les données du client de la base de données.

Documentation de l'API
- URL d'accès : http://localhost:3000/api-docs
- Interface utilisateur Swagger : Fournit une interface utilisateur interactive pour explorer et tester les points de terminaison de l'API directement depuis un navigateur.

Serveur
- Port : Le service fonctionne sur le port 3000.
- Démarrage : Utilisez node server.js pour démarrer le service, en vous assurant que toutes les dépendances sont installées.

Définition du schéma
Des définitions détaillées du schéma JSON pour les données des clients sont incluses dans la configuration Swagger, définissant des propriétés requises telles que le numéro d'identité, le prénom, le nom de famille, l'email, le téléphone et l'adresse.

Notes
- Assurez-vous que le module de base de données (./database.js) est correctement configuré pour se connecter à votre configuration spécifique de la base de données.
- Validez la connectivité du serveur et de la base de données avant le déploiement ou les tests de l'API.
