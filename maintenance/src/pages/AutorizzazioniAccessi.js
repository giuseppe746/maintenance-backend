import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AutorizzazioniAccessi() {
  const [utenti, setUtenti] = useState([]);
  const [permessi, setPermessi] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const utentiSalvati = JSON.parse(localStorage.getItem('utenti')) || [];
    const permessiSalvati = JSON.parse(localStorage.getItem('permessi')) || {};
    setUtenti(utentiSalvati);
    setPermessi(permessiSalvati);
  }, []);

  const handleClickUtente = (username) => {
    navigate(`/autorizzazioni-accessi/${username}`);
  };

  const labelInterventi = {
    inserisci: 'Inserisci Intervento',
    visualizza: 'Visualizza Intervento',
    collaudo: 'Collaudo Intervento',
    storico: 'Storico'
  };

  const labelGestione = {
    utenti: 'Gestione Utenti',
    categorie: 'Gestione Categorie',
    impostazioni: 'Impostazioni',
    notifiche: 'Notifiche'
  };

  const formatPermessi = (utente) => {
    const p = permessi[utente.username];
    if (!p) return "Nessuna autorizzazione";

    const interventi = Object.keys(labelInterventi).map(key => {
      const valore = p[key] || 'nessuno';
      return `🛠 ${labelInterventi[key]}: ${capitalize(valore)}`;
    });

    const gestione = Object.keys(labelGestione).map(key => {
      const valore = p[key] || 'non_attivo';
      return `⚙️ ${labelGestione[key]}: ${valore === 'attivo' ? 'Attivo' : 'Non Attivo'}`;
    });

    return [...interventi, ...gestione].join(' | ');
  };

  const capitalize = (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  // 🔄 Gruppo utenti per ruolo
  const utentiPerRuolo = utenti.reduce((acc, utente) => {
    const ruolo = utente.ruolo || 'Ruolo non definito';
    if (!acc[ruolo]) {
      acc[ruolo] = [];
    }
    acc[ruolo].push(utente);
    return acc;
  }, {});

  return (
    <div style={{ padding: '20px' }}>
      <h2>Autorizzazioni e Accessi</h2>
      <p>Clicca su un utente per modificare i suoi permessi.</p>

      {Object.entries(utentiPerRuolo).map(([ruolo, utentiRuolo]) => (
        <div key={ruolo} style={{ marginBottom: '30px' }}>
          <h3 style={{ borderBottom: '1px solid #ccc', paddingBottom: '5px' }}>{ruolo}</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {utentiRuolo.map((utente, index) => (
              <li
                key={index}
                onClick={() => handleClickUtente(utente.username)}
                style={{
                  padding: '10px',
                  marginBottom: '10px',
                  backgroundColor: '#eee',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = '#ddd'; }}
                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = '#eee'; }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>👤 {utente.nome} {utente.cognome} ({utente.username})</span>
                  <span style={{ fontWeight: 'bold' }}>→</span>
                </div>
                <div style={{ fontSize: '0.9em', marginTop: '5px', color: '#555' }}>
                  {formatPermessi(utente)}
                </div>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default AutorizzazioniAccessi;
