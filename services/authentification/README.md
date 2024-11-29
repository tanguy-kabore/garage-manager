
# Documentation du Service d'Authentification

## Introduction

Le service d'authentification permet de gérer les utilisateurs dans le système. Il offre des fonctionnalités pour s'inscrire (création de compte) et se connecter (authentification) à l'application. Ce service renvoie un **token JWT** (JSON Web Token) pour authentifier les utilisateurs dans leurs interactions ultérieures avec l'application.

### Fonctionnalités principales
1. **Inscription** : Permet à un nouvel utilisateur de s'enregistrer en utilisant un e-mail et un mot de passe.
2. **Connexion** : Permet à un utilisateur existant de se connecter avec son e-mail et mot de passe.
3. **Token JWT** : Un token sécurisé est généré lors de la connexion ou de l'inscription, permettant à l'utilisateur d'accéder aux fonctionnalités protégées de l'application.

---

## 1. Inscription d'un Nouvel Utilisateur

### Description

L'inscription permet à un utilisateur de créer un nouveau compte dans le système en fournissant un e-mail valide et un mot de passe. Un **token JWT** sera généré après une inscription réussie.

### Points importants pour l'inscription

- **E-mail** : L'adresse e-mail de l'utilisateur. Elle doit être unique, c'est-à-dire qu'aucun autre utilisateur ne doit avoir le même e-mail.
- **Mot de passe** : Un mot de passe sécurisé. Le mot de passe sera stocké sous forme hachée pour des raisons de sécurité.

### Requête d'Inscription

**Méthode HTTP** : `POST`

**URL** : `/api/auth/signup`

**Body de la requête** (exemple) :

```json
{
  "email": "nouvelutilisateur@example.com",
  "password": "motdepassefort"
}
```

### Réponse d'Inscription

**Réponse réussie** (Utilisateur créé) :

```json
{
  "message": "Utilisateur créé avec succès",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTY0Nzc0NzMwNywiZXhwIjoxNjQ3NzUwMTA3fQ.abc12345"
}
```

**Réponse d'erreur** (Utilisateur déjà existant) :

```json
{
  "message": "Utilisateur déjà existant"
}
```

### Cas d'erreur courants

- **Utilisateur déjà existant** : Si l'e-mail est déjà enregistré, l'inscription échouera avec un message indiquant que l'utilisateur existe déjà.

---

## 2. Connexion d'un Utilisateur

### Description

La connexion permet à un utilisateur déjà inscrit d'accéder à son compte en utilisant son e-mail et son mot de passe. Un **token JWT** sera généré et renvoyé pour que l'utilisateur puisse accéder aux services protégés.

### Points importants pour la connexion

- **E-mail** : L'adresse e-mail de l'utilisateur.
- **Mot de passe** : Le mot de passe de l'utilisateur.

### Requête de Connexion

**Méthode HTTP** : `POST`

**URL** : `/api/auth/login`

**Body de la requête** (exemple) :

```json
{
  "email": "nouvelutilisateur@example.com",
  "password": "motdepassefort"
}
```

### Réponse de Connexion

**Réponse réussie** (Connexion réussie) :

```json
{
  "message": "Connexion réussie",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImlhdCI6MTY0Nzc0NzMwNywiZXhwIjoxNjQ3NzUwMTA3fQ.abc12345"
}
```

**Réponse d'erreur** (Identifiants incorrects) :

```json
{
  "message": "Identifiants incorrects"
}
```

### Cas d'erreur courants

- **Identifiants incorrects** : Si l'e-mail ou le mot de passe est incorrect, la connexion échouera avec un message indiquant que les identifiants sont incorrects.

---

## 3. Gestion des Erreurs

### Erreurs d'Inscription

- **Utilisateur déjà existant** : Si l'adresse e-mail est déjà utilisée par un autre utilisateur.
  - Code d'erreur HTTP : `409 Conflict`
  - Message : `"Utilisateur déjà existant"`

### Erreurs de Connexion

- **Identifiants incorrects** : Si l'e-mail ou le mot de passe est incorrect.
  - Code d'erreur HTTP : `401 Unauthorized`
  - Message : `"Identifiants incorrects"`

---

## Conclusion

Cette API permet de gérer facilement les utilisateurs via des fonctionnalités de **création de compte (inscription)** et **connexion**. Le processus d'authentification est sécurisé avec des tokens JWT, garantissant un accès sécurisé aux ressources protégées de l'application.