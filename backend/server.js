import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import axios from 'axios';

const app = express();
const PORT = 4000;

// Configuration de l'API externe
const EXTERNAL_API_URL = 'http://192.168.100.162/api/evenements-externes/';

app.use(cors());
app.use(express.json());

// DB setup
let db;
(async () => {
  db = await open({
    filename: './events.db',
    driver: sqlite3.Database
  });
  await db.exec(`CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT,
    intensite INTEGER,
    duree TEXT,
    date TEXT,
    statut TEXT,
    source TEXT
  )`);
})();

// POST /api/events : ajouter un événement
app.post('/api/events', async (req, res) => {
  const { type, intensite, duree, date, statut = 'envoyé', source = 'manuel' } = req.body;
  if (!type || !intensite || !duree || !date) {
    return res.status(400).json({ status: 'erreur', message: 'Champs manquants' });
  }
  
  try {
    // Enregistrer en base de données locale
    const result = await db.run(
      'INSERT INTO events (type, intensite, duree, date, statut, source) VALUES (?, ?, ?, ?, ?, ?)',
      [type, intensite, duree, date, statut, source]
    );
    
    // Préparer les données pour l'API externe
    const eventData = {
      type: type,
      intensite: intensite,
      duree: duree,
      date: date,
      statut: statut,
      source: source,
      id: result.lastID
    };
    
    // Envoyer vers l'API externe
    try {
      await axios.post(EXTERNAL_API_URL, eventData, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000 // Timeout de 5 secondes
      });
      console.log(`Événement ${result.lastID} envoyé avec succès vers l'API externe`);
    } catch (externalApiError) {
      console.error('Erreur lors de l\'envoi vers l\'API externe:', externalApiError.message);
      // L'événement est quand même enregistré localement
    }
    
    res.json({ 
      status: 'reçu', 
      message: 'Événement enregistré avec succès', 
      id: result.lastID,
      envoyé_externe: 'tentative effectuée'
    });
  } catch (error) {
    console.error('Erreur lors de l\'enregistrement:', error);
    res.status(500).json({ status: 'erreur', message: 'Erreur serveur' });
  }
});

// GET /api/events : lister l'historique
app.get('/api/events', async (req, res) => {
  const events = await db.all('SELECT * FROM events ORDER BY date DESC');
  res.json(events);
});

app.listen(PORT, () => {
  console.log(`Serveur backend météo démarré sur http://localhost:${PORT}`);
});
