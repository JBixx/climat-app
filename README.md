# 🌦️ Climat-App

**Climat-App** est une application complète permettant de collecter, gérer et visualiser des événements climatiques.  
Elle est composée de deux parties :  
- **Backend** (API REST en Node.js avec Express & SQLite)  
- **Frontend** (interface utilisateur en React/Vite)  

---

## 📂 Structure du projet

climat-app/
│
├── backend/ # API REST (Express + SQLite)
│ ├── server.js # Point d'entrée du serveur
│ ├── events.db # Base de données SQLite (générée automatiquement)
│ ├── package.json # Dépendances backend
│ └── ...
│
├── frontend/ # Application React (Vite ou CRA)
│ ├── src/ # Code source React
│ ├── public/ # Assets publics
│ ├── package.json # Dépendances frontend
│ └── ...
│
├── .gitignore
├── package-lock.json
└── README.md

yaml
Copier le code

---

## 🚀 Installation

### 1. Cloner le projet
```sh
git clone https://github.com/JBixx/climat-app.git
cd climat-app
2. Installer et lancer le backend
sh
Copier le code
cd backend
npm install
npm start
Le backend démarre sur : http://localhost:4000

3. Installer et lancer le frontend
sh
Copier le code
cd frontend
npm install
npm run dev
Le frontend démarre sur : http://localhost:5173 (par défaut avec Vite).

📦 Dépendances principales

Backend
Express – Framework web rapide et minimaliste

SQLite – Base de données embarquée

Axios – Requêtes HTTP

CORS – Middleware CORS

Frontend
React – Librairie UI

Vite – Outil de build rapide

Axios – Requêtes HTTP

🔗 API Endpoints
Ajouter un événement
POST /api/events

Exemple de body JSON :


{
  "type": "pluie",
  "intensite": 8,
  "duree": "2h",
  "date": "2025-10-15T08:00:00"
}
Réponse :


{
  "status": "reçu",
  "message": "Événement enregistré avec succès",
  "id": 1,
  "envoyé_externe": "tentative effectuée"
}
Récupérer l’historique des événements
GET /api/events

Réponse :


[
  {
    "id": 1,
    "type": "pluie",
    "intensite": 8,
    "duree": "2h",
    "date": "2025-10-15T08:00:00",
    "statut": "envoyé",
    "source": "manuel"
  }
]

⚙️ Configuration
Le backend enregistre les données dans events.db (SQLite, créé automatiquement).

Une tentative d’envoi est faite vers l’API externe configurée dans :


const EXTERNAL_API_URL = 'http://192.168.100.162/api/evenements-externes/';

➡️ Modifier cette URL si nécessaire.

🛠️ Développement
Backend : démarrage avec npm start (sur port 4000)

Frontend : démarrage avec npm run dev (port 5173 par défaut)

👤 Auteur
Développé par Jean Baptiste HIRWA (JBixx)

GitHub : https://github.com/JBixx






