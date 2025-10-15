# Backend météo (Node.js/Express)

## Installation

1. Ouvre un terminal dans le dossier `backend`
2. Installe les dépendances :
   ```bash
   npm install
   ```
3. Lance le serveur :
   ```bash
   npm start
   ```

Le backend sera accessible sur http://localhost:4000

## Endpoints principaux

- `POST /api/events` : ajouter un événement météo
- `GET /api/events` : récupérer l’historique

Compatible avec le frontend React fourni.
