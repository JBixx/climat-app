
import React, { useState, useEffect } from 'react';
import './App.css';

function RainBarChart({ data }) {
  // data: [{ hour, intensity }]
  const max = Math.max(...data.map(d => d.intensity), 100);
  return (
    <svg width={data.length * 48} height={80} style={{ display: 'block', margin: '0 auto 24px auto', background: 'rgba(255,255,255,0.18)', borderRadius: 16 }}>
      {data.map((d, i) => (
        <g key={i}>
          <rect
            x={i * 48 + 16}
            y={80 - (d.intensity / max) * 60 - 18}
            width={16}
            height={(d.intensity / max) * 60}
            fill="#4f8ef7"
            rx={6}
          />
          <text x={i * 48 + 24} y={78} fontSize="12" textAnchor="middle" fill="#fff">{d.hour}</text>
        </g>
      ))}
    </svg>
  );
}

const initialEvents = [
  { type: 'Pluie', state: 'inactif', icon: '🌧️', color: '#2196f3' },
  { type: 'Vent fort', state: 'inactif', icon: '💨', color: '#4caf50' },
  { type: 'Houle', state: 'inactif', icon: '🌊', color: '#ff9800' },
  { type: 'Marée haute', state: 'inactif', icon: '🌊', color: '#9c27b0' },
];

// Pour la démo, météo simulée
const city = 'Abidjan';
const temperature = 28;
const mainWeather = 'Pluie'; // Peut être dynamique plus tard
const mainIcon = mainWeather === 'Pluie' ? '🌧️' : mainWeather === 'Vent fort' ? '💨' : mainWeather === 'Houle' ? '🌊' : '☀️';

function RainAnimation() {
  // Simple animation de gouttes de pluie
  return (
    <div className="rain-animation">
      {[...Array(20)].map((_, i) => (
        <div key={i} className="raindrop" style={{ left: `${Math.random()*100}%`, animationDelay: `${Math.random()*2}s` }} />
      ))}
    </div>
  );
}

// Prévisions horaires simulées
const hourlyForecast = [
  { hour: '13h', temp: 28, icon: '🌧️', intensity: 80 },
  { hour: '14h', temp: 27, icon: '🌧️', intensity: 70 },
  { hour: '15h', temp: 27, icon: '🌦️', intensity: 40 },
  { hour: '16h', temp: 26, icon: '🌦️', intensity: 20 },
  { hour: '17h', temp: 26, icon: '☀️', intensity: 0 },
  { hour: '18h', temp: 25, icon: '☀️', intensity: 0 },
];

function getBackground(mainWeather) {
  switch (mainWeather) {
    case 'Pluie':
      return 'linear-gradient(135deg, #4f8ef7 0%, #a1c4fd 100%)';
    case 'Vent fort':
      return 'linear-gradient(135deg, #b2fefa 0%, #0ed2f7 100%)';
    case 'Houle':
      return 'linear-gradient(135deg, #43cea2 0%, #185a9d 100%)';
    case 'Soleil':
      return 'linear-gradient(135deg, #f7971e 0%, #ffd200 100%)';
    default:
      return 'linear-gradient(135deg, #4f8ef7 0%, #a1c4fd 100%)';
  }
}

function App() {
  const [events, setEvents] = useState(initialEvents);
  const [history, setHistory] = useState([]);
  const [form, setForm] = useState({
    type: 'Pluie',
    intensite: '',
    duree: '',
    date: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('http://localhost:4000/api/events')
      .then(res => res.json())
      .then(data => setHistory(data))
      .catch(() => setError("Impossible de charger l'historique depuis le serveur."));
  }, []);

  const toggleEvent = (index) => {
    setEvents((prev) =>
      prev.map((ev, i) =>
        i === index
          ? {
              ...ev,
              state:
                ev.state === 'inactif'
                  ? 'détecté'
                  : 'inactif',
            }
          : ev
      )
    );
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.intensite || !form.duree || !form.date) return;
    setLoading(true);
    try {
      const res = await fetch('http://localhost:4000/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.status === 'reçu') {
        const histoRes = await fetch('http://localhost:4000/api/events');
        const histo = await histoRes.json();
        setHistory(histo);
        setForm({ type: 'Pluie', intensite: '', duree: '', date: '' });
      } else {
        setError(data.message || 'Erreur lors de l’envoi.');
      }
    } catch (err) {
      setError("Erreur de connexion au serveur.");
    }
    setLoading(false);
  };

  return (
    <div className="App" style={{ background: getBackground(mainWeather) }}>
      {/* Animation de fond météo principale */}
      {mainWeather === 'Pluie' && <RainAnimation />}
      <div className="weather-header">
        <div className="weather-header-city">{city}</div>
        <div className="weather-header-temp">{temperature}°C</div>
        <div className="weather-header-icon">{mainIcon}</div>
        <div className="weather-header-desc">{mainWeather}</div>
      </div>
      {/* Prévisions horaires */}
      <div className="forecast-section">
        <div className="forecast-title">Prévisions horaires</div>
        <RainBarChart data={hourlyForecast.map(f => ({ hour: f.hour, intensity: f.intensity }))} />
        <div className="forecast-cards">
          {hourlyForecast.map((f, idx) => (
            <div className="forecast-card" key={idx}>
              <div className="forecast-hour">{f.hour}</div>
              <div className="forecast-icon">{f.icon}</div>
              <div className="forecast-temp">{f.temp}°C</div>
              <div className="forecast-intensity">{f.intensity > 0 ? `${f.intensity} mm/h` : '-'}</div>
            </div>
          ))}
        </div>
      </div>
      <h1>Tableau de bord météo</h1>
      <div className="dashboard">
      {/* ...existing code... */}
        {events.map((event, idx) => (
          <div className="weather-card" key={event.type}>
            <div className="weather-icon">{event.icon}</div>
            <div className="weather-type">{event.type}</div>
            <div className="weather-state">
              {event.state === 'détecté' ? (
                <span style={{ color: event.color }}>Détecté&nbsp;✅</span>
              ) : (
                <span style={{ color: '#bbb' }}>Inactif&nbsp;⭕</span>
              )}
            </div>
            <button className="weather-action-btn" onClick={() => toggleEvent(idx)}>
              {event.state === 'inactif' ? 'Déclencher' : 'Arrêter'}
            </button>
          </div>
        ))}
      </div>

      <div style={{ margin: '48px auto 0 auto', maxWidth: 400, background: 'rgba(255,255,255,0.92)', borderRadius: 20, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)', padding: 24 }}>
        <h2 style={{ color: '#4f8ef7', fontWeight: 600, marginBottom: 12 }}>Créer un événement météo</h2>
        <form onSubmit={handleFormSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label>
            Type&nbsp;:
            <select name="type" value={form.type} onChange={handleFormChange} style={{ marginLeft: 8 }}>
              <option>Pluie</option>
              <option>Vent fort</option>
              <option>Houle</option>
              <option>Marée haute</option>
            </select>
          </label>
          <label>
            Intensité&nbsp;:
            <input name="intensite" type="number" min="0" value={form.intensite} onChange={handleFormChange} placeholder="ex: 80 (mm/h ou km/h)" style={{ marginLeft: 8 }} />
          </label>
          <label>
            Durée&nbsp;:
            <input name="duree" type="text" value={form.duree} onChange={handleFormChange} placeholder="ex: 2h" style={{ marginLeft: 8 }} />
          </label>
          <label>
            Date/heure&nbsp;:
            <input name="date" type="datetime-local" value={form.date} onChange={handleFormChange} style={{ marginLeft: 8 }} />
          </label>
          <button className="weather-action-btn" type="submit" style={{ marginTop: 8 }} disabled={loading}>
            {loading ? 'Envoi...' : 'Déclencher'}
          </button>
          {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
        </form>
      </div>

      <div style={{ margin: '40px auto 0 auto', maxWidth: 600, background: 'rgba(255,255,255,0.93)', borderRadius: 20, boxShadow: '0 2px 12px 0 rgba(0,0,0,0.07)', padding: 24 }}>
        <h2 style={{ color: '#4f8ef7', fontWeight: 600, marginBottom: 12 }}>Historique des événements</h2>
        {history.length === 0 ? (
          <div style={{ color: '#888' }}>Aucun événement pour l’instant.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ color: '#222', fontWeight: 500 }}>
                <th>Type</th>
                <th>Intensité</th>
                <th>Durée</th>
                <th>Date/heure</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {history.map(ev => (
                <tr key={ev.id} style={{ borderTop: '1px solid #e0e0e0' }}>
                  <td>{ev.type}</td>
                  <td>{ev.intensite}</td>
                  <td>{ev.duree}</td>
                  <td>{new Date(ev.date).toLocaleString()}</td>
                  <td>{ev.statut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
