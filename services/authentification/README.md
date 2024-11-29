# Documentation de l'API d'authentification

## Modèle `User`

### Description

Le modèle `User` est utilisé pour représenter les utilisateurs dans la base de données. Il contient les informations essentielles pour l'inscription et la connexion.

### Propriétés du modèle

- **email** : L'adresse e-mail de l'utilisateur. Ce champ est unique et ne peut pas être nul.
  - Type : `STRING`
  - Validations : 
    - Doit être un e-mail valide (`isEmail`).
    - Doit être unique (aucun utilisateur ne peut avoir le même e-mail).
  - Exemple : `example@example.com`

- **password** : Le mot de passe de l'utilisateur, stocké de manière sécurisée après un hachage avec `bcrypt`.
  - Type : `STRING`
  - Validation : Ne peut pas être nul.
  - Exemple : `password123`

### Définition du modèle

```javascript
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

module.exports = User;
```

## Tester l'Inscription (Signup)

### Endpoint

- **URL** : `/api/auth/signup`
- **Méthode** : `POST`
- **Description** : Permet de créer un nouvel utilisateur en envoyant son e-mail et son mot de passe.
- **Request Body** :
  - `email` : L'e-mail de l'utilisateur.
  - `password` : Le mot de passe de l'utilisateur.

### Exemple de Requête

```bash
POST http://localhost:3000/api/auth/signup
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123"
}
```

### Exemple de Réponse

Si l'utilisateur est créé avec succès, la réponse renverra un message de succès et un token JWT pour les requêtes suivantes :

```json
{
  "message": "Utilisateur créé avec succès",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY0Nzc0NzMwNywiZXhwIjoxNjQ3NzUwMTA3fQ.abc12345"
}
```

Si l'e-mail est déjà utilisé par un autre utilisateur, la réponse sera :

```json
{
  "message": "Utilisateur déjà existant"
}
```

### Tester l'Inscription avec Postman

1. Ouvrez [Postman](https://www.postman.com/).
2. Sélectionnez la méthode `POST`.
3. Entrez l'URL `http://localhost:3000/api/auth/signup`.
4. Dans l'onglet `Body`, choisissez `raw` et `JSON` comme type de contenu.
5. Ajoutez les données JSON pour l'e-mail et le mot de passe.
6. Cliquez sur `Send` pour envoyer la requête.

---

## Tester la Connexion (Login)

### Endpoint

- **URL** : `/api/auth/login`
- **Méthode** : `POST`
- **Description** : Permet à un utilisateur de se connecter en envoyant son e-mail et son mot de passe.
- **Request Body** :
  - `email` : L'e-mail de l'utilisateur.
  - `password` : Le mot de passe de l'utilisateur.

### Exemple de Requête

```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "newuser@example.com",
  "password": "password123"
}
```

### Exemple de Réponse

Si la connexion est réussie et que les identifiants sont corrects, la réponse renverra un message de succès et un token JWT :

```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTY0Nzc0NzMwNywiZXhwIjoxNjQ3NzUwMTA3fQ.abc12345"
}
```

Si l'utilisateur ou le mot de passe est incorrect, la réponse sera :

```json
{
  "message": "Identifiants incorrects"
}
```

### Tester la Connexion avec Postman

1. Ouvrez [Postman](https://www.postman.com/).
2. Sélectionnez la méthode `POST`.
3. Entrez l'URL `http://localhost:3000/api/auth/login`.
4. Dans l'onglet `Body`, choisissez `raw` et `JSON` comme type de contenu.
5. Ajoutez les données JSON pour l'e-mail et le mot de passe.
6. Cliquez sur `Send` pour envoyer la requête.

---

## Gestion des Erreurs

### Erreurs Courantes

- **Utilisateur déjà existant** : Si l'utilisateur tente de s'inscrire avec un e-mail déjà pris, un code d'état `409` (Conflict) sera renvoyé avec le message :
  ```json
  { "message": "Utilisateur déjà existant" }
  ```

- **Identifiants incorrects** : Si l'utilisateur entre un e-mail ou un mot de passe incorrect lors de la connexion, un code d'état `401` (Unauthorized) sera renvoyé avec le message :
  ```json
  { "message": "Identifiants incorrects" }
  ```

---

## Conclusion

Cette API d'authentification gère les opérations de base liées à la gestion des utilisateurs, y compris l'inscription, la connexion et l'authentification via JWT. Les étapes de test avec **Postman** permettent de vérifier rapidement son bon fonctionnement.