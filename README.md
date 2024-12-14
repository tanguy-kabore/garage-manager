Ce projet utilise Docker et Kubernetes pour déployer une application de gestion de garage. Vous trouverez ci-dessous les commandes utiles pour travailler avec Docker et Kubernetes.

## Prérequis

Avant de commencer, assurez-vous d'avoir les outils suivants installés sur votre machine :

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Kubernetes (Minikube)](https://minikube.sigs.k8s.io/docs/)

## Docker

### Créer l'image Docker

Pour créer les images Docker à partir des fichiers `docker-compose.yml` :

```bash
docker-compose up --build
```

### Recréer l'image sans utiliser le cache

Si vous avez des problèmes lors de la construction de l'image, vous pouvez reconstruire l'image sans utiliser le cache avec la commande suivante :

```bash
docker-compose build --no-cache
```

### Gérer les images Docker

Pour lister toutes les images Docker disponibles sur votre machine :

```bash
docker images
```

Pour supprimer les images Docker inutilisées et libérer de l'espace disque :

```bash
docker image prune -f
```

## Kubernetes

### Démarrer Minikube

Pour démarrer Minikube, qui est un environnement Kubernetes local :

```bash
minikube start
```

### Ouvrir le tableau de bord de Minikube

Pour ouvrir le tableau de bord de Minikube, qui permet de visualiser l'état des ressources Kubernetes de manière graphique :

```bash
minikube dashboard
```

### Déployer sur Kubernetes

Pour déployer les ressources Kubernetes définies dans le fichier `deployment.yml` (assurez-vous que le fichier est bien configuré avec les bonnes ressources) :

```bash
kubectl apply -f .\deployment.yml
```

### Vérifier les ressources déployées

Pour vérifier l'état des pods dans le namespace `garage-manager` :

```bash
kubectl get pods -n garage-manager
```

Pour vérifier les services dans le namespace `garage-manager` :

```bash
kubectl get services -n garage-manager
```

Pour accéder au service `frontend` via Minikube et obtenir l'URL locale de l'application :

```bash
minikube service frontend -n garage-manager
```

### Supprimer le namespace et toutes les ressources associées

Si vous souhaitez supprimer le namespace `garage-manager` et toutes les ressources qu'il contient :

```bash
kubectl delete namespace garage-manager
```

### Autres commandes utiles

- Pour obtenir des informations détaillées sur un pod spécifique :

```bash
kubectl describe pod <nom-du-pod> -n garage-manager
```

- Pour supprimer un pod spécifique :

```bash
kubectl delete pod <nom-du-pod> -n garage-manager
```

## Nettoyage

### Supprimer tous les conteneurs et images Docker

Si vous souhaitez supprimer tous les conteneurs et images Docker inutilisées :

```bash
docker system prune -f
```

### Redémarrer le cluster Kubernetes

Pour redémarrer Minikube, vous pouvez exécuter les commandes suivantes :

```bash
minikube stop
minikube start
```

Cela redémarrera votre cluster local Kubernetes.