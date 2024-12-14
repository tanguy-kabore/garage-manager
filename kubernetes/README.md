# Installation d'Istio

## 1.1 Prérequis

Avant de commencer, assurez-vous que vous avez installé Istio et que vous utilisez un cluster Kubernetes (Minikube ou un cluster réel). Vous devez disposer de `kubectl` et d'un cluster Kubernetes fonctionnel.

### 1.2 Installation d'Istio

Suivez les étapes ci-dessous pour installer Istio sur votre système en fonction de votre environnement.

---

### **Installation sur Linux/MacOS**

1. **Téléchargez Istio**  
   Ouvrez un terminal et exécutez la commande suivante pour télécharger Istio :

   ```bash
   curl -L https://istio.io/downloadIstio | sh -
   ```

2. **Accédez au répertoire d'installation**  
   Une fois l'installation terminée, accédez au dossier `istio-*/bin` où Istio a été installé.

   ```bash
   cd istio-*/bin
   ```

3. **Déplacez le binaire `istioctl` dans votre répertoire d'exécution**  
   Cela vous permettra d'exécuter `istioctl` depuis n'importe quel répertoire :

   ```bash
   sudo mv istioctl /usr/local/bin/
   ```

4. **Vérifiez l'installation**  
   Exécutez la commande suivante pour vérifier qu'Istio a bien été installé :

   ```bash
   istioctl version
   ```

### **Installation sur Windows**

1. **Téléchargez Istio**  
   Ouvrez PowerShell ou votre terminal préféré, puis exécutez cette commande pour télécharger Istio :

   ```bash
   curl -L https://istio.io/downloadIstio | sh -
   ```

2. **Ajoutez `istioctl` au PATH**  
   Après l'installation, ajoutez le répertoire `bin` d'Istio à votre PATH pour pouvoir exécuter `istioctl` de n'importe où. Modifiez votre fichier d'environnement PowerShell ou utilisez cette commande :

   ```bash
   $env:Path += ";C:\chemin\vers\istio\bin"
   ```

3. **Vérifiez l'installation**  
   Exécutez la commande suivante dans PowerShell pour vérifier qu'Istio a bien été installé :

   ```bash
   istioctl version
   ```

---

## 1.3 Déployer Istio sur Kubernetes

Une fois Istio installé, vous pouvez procéder à son déploiement dans votre cluster Kubernetes.

1. **Déployer Istio avec le profil demo**  
   Utilisez la commande suivante pour installer Istio sur Kubernetes avec le profil `demo`, qui inclut tous les composants nécessaires (comme Istiod et les proxies Envoy) :

   ```bash
   istioctl install --set profile=demo -y
   ```

2. **Vérifiez l'installation d'Istio sur Kubernetes**  
   Vous pouvez vérifier si les composants d'Istio ont été correctement déployés en exécutant la commande suivante :

   ```bash
   kubectl get pods -n istio-system
   ```

---

## 1.4 Activer l'injection automatique des sidecars

L'injection automatique des sidecars Envoy permet à Istio de gérer le trafic pour vos microservices. Suivez ces étapes pour activer l'injection automatique dans votre namespace `garage-manager`.

1. **Labellez le namespace pour l'injection automatique des sidecars**  
   Exécutez la commande suivante pour activer l'injection automatique des sidecars dans le namespace `garage-manager` :

   ```bash
   kubectl label namespace garage-manager istio-injection=enabled
   ```

   Cela permet à Istio d'injecter automatiquement les proxies Envoy dans les pods du namespace `garage-manager`.

---

## 1.5 Appliquer les configurations de déploiement

Après avoir installé Istio et configuré l'injection automatique, vous pouvez appliquer les fichiers de configuration pour vos microservices. Assurez-vous d’avoir créé les fichiers YAML nécessaires pour les déploiements, services et règles Istio.

### Déployer les configurations des microservices

1. **Appliquez les déploiements du frontend (Blue et Canary)** :

   ```bash
   kubectl apply -f frontend-blue-deployment.yaml
   kubectl apply -f frontend-canary-deployment.yaml
   ```

2. **Appliquez les règles de routage du trafic (VirtualService et DestinationRule)** :

   ```bash
   kubectl apply -f frontend-virtualservice.yaml
   kubectl apply -f frontend-destinationrule.yaml
   ```

3. **Vérifiez les déploiements et les services**  
   Vous pouvez vérifier que les services et les règles ont été correctement appliqués :

   ```bash
   kubectl get pods -n garage-manager
   kubectl get virtualservices -n garage-manager
   kubectl get destinationrules -n garage-manager
   ```

Ces étapes vous permettront d'appliquer des stratégies de déploiement robustes, comme le Canary Deployment et le Blue-Green Deployment, pour garantir une disponibilité continue de vos microservices.

# Observabilité de l'application microservices

---

### i. **Visualisation des microservices et leurs relations**

La visualisation des microservices et leurs relations est essentielle pour comprendre comment les différents composants interagissent entre eux.

#### Utilisation de **Kiali** avec Istio

[Kiali](https://www.kiali.io/) est un outil open-source pour la visualisation et la gestion des services Istio. Il permet de voir les microservices, leurs relations et leurs états de santé.

**Étapes d'installation de Kiali :**

1. **Installer Kiali**  
   Vous pouvez installer Kiali dans votre cluster Kubernetes avec Istio en exécutant la commande suivante :

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/kiali/kiali/master/deploy/kubernetes/kiali-cr.yaml
   ```

2. **Accéder à Kiali**  
   Une fois Kiali installé, vous pouvez accéder à l'interface de visualisation via un port-forward sur le service Kiali :

   ```bash
   kubectl port-forward svc/kiali -n istio-system 20001:20001
   ```

   Ensuite, ouvrez un navigateur et allez sur [http://localhost:20001](http://localhost:20001). Vous pourrez voir les microservices, les flux de trafic, et les relations entre eux.

---

### ii. **Monitoring de chaque microservice**

Le monitoring permet de suivre la santé des microservices, d'observer les métriques de performance et d'identifier les problèmes potentiels.

#### Utilisation de **Prometheus** et **Grafana** avec Istio

1. **Installer Prometheus et Grafana**  
   Si vous avez installé Istio avec le profil `demo`, Prometheus et Grafana sont déjà inclus. Si ce n’est pas le cas, vous pouvez les installer en exécutant la commande suivante :

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/istio/istio/master/samples/addons/prometheus.yaml
   kubectl apply -f https://raw.githubusercontent.com/istio/istio/master/samples/addons/grafana.yaml
   ```

2. **Accéder à Prometheus et Grafana**  
   - Pour accéder à **Prometheus**, vous pouvez utiliser un port-forward :

     ```bash
     kubectl port-forward svc/prometheus -n istio-system 9090:9090
     ```

     Ensuite, allez sur [http://localhost:9090](http://localhost:9090) pour interroger les métriques.

   - Pour accéder à **Grafana**, utilisez un autre port-forward :

     ```bash
     kubectl port-forward svc/grafana -n istio-system 3000:3000
     ```

     Ensuite, ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur. L’interface de Grafana vous permettra de visualiser des tableaux de bord pour suivre la performance des microservices.

---

### iii. **Logging de chaque microservice**

Les logs sont cruciaux pour déboguer les applications microservices et surveiller les erreurs. Istio fournit un ensemble d'outils pour collecter et visualiser les logs.

#### Utilisation de **Elasticsearch, Fluentd et Kibana (EFK)**

1. **Installer le stack EFK**  
   Installez Elasticsearch, Fluentd et Kibana (EFK) pour collecter, stocker et afficher les logs :

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/istio/istio/master/samples/addons/elasticsearch.yaml
   kubectl apply -f https://raw.githubusercontent.com/istio/istio/master/samples/addons/fluentd.yaml
   kubectl apply -f https://raw.githubusercontent.com/istio/istio/master/samples/addons/kibana.yaml
   ```

2. **Accéder à Kibana**  
   Pour accéder à Kibana et visualiser les logs des microservices :

   ```bash
   kubectl port-forward svc/kibana -n istio-system 5601:5601
   ```

   Ensuite, ouvrez votre navigateur et allez sur [http://localhost:5601](http://localhost:5601) pour accéder à l'interface de Kibana et explorer les logs collectés.

---

### iv. **Tracing des appels et échanges entre microservices**

Le tracing permet de suivre les requêtes traversant plusieurs microservices pour identifier les goulots d'étranglement et analyser les performances.

#### Utilisation de **Jaeger** avec Istio

[Jaeger](https://www.jaegertracing.io/) est un système de tracing distribué qui permet de suivre les requêtes entre microservices. Istio intègre Jaeger pour le tracing des appels.

1. **Installer Jaeger**  
   Pour installer Jaeger dans votre cluster Kubernetes, vous pouvez exécuter les commandes suivantes :

   ```bash
   kubectl apply -f https://raw.githubusercontent.com/istio/istio/master/samples/addons/jaeger.yaml
   ```

2. **Accéder à Jaeger**  
   Vous pouvez utiliser un port-forward pour accéder à l'interface Jaeger :

   ```bash
   kubectl port-forward svc/jaeger-query -n istio-system 5775:5775
   kubectl port-forward svc/jaeger-query -n istio-system 16686:16686
   ```

   Ensuite, ouvrez un navigateur et allez sur [http://localhost:16686](http://localhost:16686) pour accéder à l'interface Jaeger et explorer les traces des requêtes entre vos microservices.

---

### Conclusion

Avec Istio, Prometheus, Grafana, Kiali, Jaeger et EFK, vous avez un ensemble complet d'outils pour assurer l'observabilité de vos microservices. Voici un récapitulatif des outils que vous pouvez utiliser pour chaque fonction :

- **Visualisation des microservices** : [Kiali](https://www.kiali.io/)
- **Monitoring** : [Prometheus](https://prometheus.io/) + [Grafana](https://grafana.com/)
- **Logging** : [EFK stack (Elasticsearch, Fluentd, Kibana)](https://www.elastic.co/what-is/efk-stack)
- **Tracing** : [Jaeger](https://www.jaegertracing.io/)

Ces outils vous permettent d'avoir une vue d'ensemble sur les performances, la santé, les logs et les traces des appels dans votre application microservices.

# Communication sécurisée entre les services (via mTLS)

La sécurité des communications entre microservices est essentielle dans un environnement de microservices. Istio facilite la gestion de cette sécurité grâce à l'activation de **mTLS** (Mutual TLS) pour chiffrer et authentifier les communications entre les services. Le mTLS garantit que seules les communications entre services autorisées sont acceptées, et que les données sont protégées lors de leur transit.

#### Activer mTLS dans Istio

1. **Activer mTLS pour l’ensemble du namespace**  
   Vous pouvez activer mTLS pour tous les services dans le namespace `garage-manager` en créant une `PeerAuthentication` qui définit le mode d'authentification à utiliser.

   Créez un fichier `peer-authentication.yaml` avec le contenu suivant :

   ```yaml
   apiVersion: security.istio.io/v1beta1
   kind: PeerAuthentication
   metadata:
     name: default
     namespace: garage-manager
   spec:
     mtls:
       mode: STRICT
   ```

   Ce fichier applique mTLS en mode **STRICT** à tout le namespace, ce qui signifie que tous les services doivent communiquer en utilisant mTLS. Pour appliquer cette configuration, exécutez la commande suivante :

   ```bash
   kubectl apply -f peer-authentication.yaml
   ```

2. **Configurer la sécurité côté serveur (DestinationRule)**  
   Vous pouvez définir des règles de destination pour activer mTLS au niveau des services. Créez un fichier `destination-rule.yaml` pour appliquer mTLS à un service spécifique :

   ```yaml
   apiVersion: networking.istio.io/v1alpha3
   kind: DestinationRule
   metadata:
     name: redis-mtls
     namespace: garage-manager
   spec:
     host: redis
     trafficPolicy:
       tls:
         mode: ISTIO_MUTUAL
   ```

   Appliquez-le avec la commande suivante :

   ```bash
   kubectl apply -f destination-rule.yaml
   ```

3. **Vérifier la communication sécurisée (mTLS)**  
   Pour vérifier que mTLS fonctionne correctement entre vos services, vous pouvez vérifier les en-têtes envoyés avec les requêtes et les logs d'Istio pour vérifier si le trafic est sécurisé.

   ```bash
   kubectl get peerauthentications -n garage-manager
   ```

   Cette commande vous permet de vérifier que mTLS est bien appliqué à tous les services dans le namespace.

---

# Circuit Breaking (implémenté au niveau de l'API Gateway)

Le **Circuit Breaking** est une technique de tolérance aux pannes qui permet de prévenir un effet de domino dans un environnement de microservices. Si un service rencontre des problèmes (comme une latence élevée ou un taux d'erreurs élevé), le circuit breaker interrompt les appels vers ce service pour éviter que l’ensemble de l’application soit affecté.

Dans Istio, le circuit breaking peut être configuré au niveau des **API Gateway** ou des **services** en définissant des règles de trafic dans les `DestinationRules` et `VirtualServices`.

#### Activer le Circuit Breaking pour un service

1. **Créer une DestinationRule pour le Circuit Breaking**  
   Vous pouvez configurer des limites de connexions, de requêtes et de délais dans une `DestinationRule` pour définir le circuit breaker pour un service particulier. Voici un exemple pour configurer un circuit breaker pour le service `frontend` :

   Créez un fichier `frontend-destination-rule-circuit-breaker.yaml` avec le contenu suivant :

   ```yaml
   apiVersion: networking.istio.io/v1alpha3
   kind: DestinationRule
   metadata:
     name: frontend-circuit-breaker
     namespace: garage-manager
   spec:
     host: frontend
     trafficPolicy:
       connectionPool:
         tcp:
           maxConnections: 100
         http:
           maxRequestsPerConnection: 1
           idleTimeout: 30s
       outlierDetection:
         consecutive5xxErrors: 5
         interval: 1s
         baseEjectionTime: 30s
         maxEjectionPercent: 50
   ```

   Dans cet exemple :
   - `connectionPool` définit les limites de connexions et de requêtes par service.
   - `outlierDetection` détecte si un service retourne plus de 5 erreurs 5xx consécutives, et active l'éjection du service pendant 30 secondes.

   Appliquez-le avec :

   ```bash
   kubectl apply -f frontend-destination-rule-circuit-breaker.yaml
   ```

2. **Configurer un VirtualService avec un Circuit Breaker**  
   Vous pouvez également définir un circuit breaker dans un `VirtualService` pour contrôler le routage en cas de panne d'un service. Créez un fichier `frontend-virtualservice-circuit-breaker.yaml` :

   ```yaml
   apiVersion: networking.istio.io/v1alpha3
   kind: VirtualService
   metadata:
     name: frontend
     namespace: garage-manager
   spec:
     hosts:
       - frontend
     http:
       - route:
           - destination:
               host: frontend
               subset: v1
         retries:
           attempts: 3
           perTryTimeout: 2s
           retryOn: 5xx
   ```

   Dans cet exemple, en cas de réponse 5xx, Istio tente de réessayer jusqu’à 3 fois avec un délai d'attente de 2 secondes par tentative. Ce mécanisme aide à éviter de solliciter un service défaillant et permet une meilleure gestion des erreurs.

3. **Vérifier le Circuit Breaking**  
   Pour vérifier que le circuit breaker fonctionne comme prévu, vous pouvez observer les logs d'Istio et les métriques Prometheus pour voir si des services sont éjectés en raison de comportements anormaux :

   ```bash
   kubectl get destinationrules -n garage-manager
   kubectl get virtualservices -n garage-manager
   ```

   Vous pouvez aussi utiliser **Grafana** pour visualiser les métriques liées au circuit breaking, comme les éjections de services et les erreurs 5xx.

---

### Conclusion

En activant **mTLS** pour sécuriser les communications entre vos services, vous vous assurez que les données échangées restent confidentielles et que les services sont authentifiés. Le **Circuit Breaking**, quant à lui, permet de protéger votre architecture en évitant que des défaillances dans un service se propagent à l’ensemble du système.