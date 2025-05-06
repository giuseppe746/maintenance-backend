import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AutorizzazioniDettaglio() {
  const { username } = useParams();
  const navigate = useNavigate();
  const [utente, setUtente] = useState(null);
  const [permessi, setPermessi] = useState({});

  const sezioni = {
    interventi: [
      { key: 'inserisci', label: 'Inserisci Intervento' },
      { key: 'visualizza', label: 'Visualizza Intervento' },
      { key: 'collaudo', label: 'Collaudo Intervento' },
      { key: 'storico', label: 'Storico' }
    ],
    gestione: [
      { key: 'utenti', label: 'Gestione Utenti' },
      { key: 'categorie', label: 'Gestione Categorie' },
      { key: 'impostazioni', label: 'Impostazioni' },
      { key: 'notifiche', label: 'Notifiche' }
    ]
  };

  useEffect(() => {
    const utenti = JSON.parse(localStorage.getItem('utenti')) || [];
    const trovato = utenti.find(u => u.username === username);
    if (trovato) {
      setUtente(trovato);
    }

    const permessiSalvati = JSON.parse(localStorage.getItem('permessi')) || {};
    setPermessi(permessiSalvati[username] || {});
  }, [username]);

  const handleChangeLivello = (key, livello) => {
    setPermessi(prev => ({
      ...prev,
      [key]: livello
    }));
  };

  const handleToggleAttivo = (key, value) => {
    setPermessi(prev => ({
      ...prev,
      [key]: value ? 'attivo' : 'non_attivo'
    }));
  };

  const handleSalva = () => {
    const permessiSalvati = JSON.parse(localStorage.getItem('permessi')) || {};
    permessiSalvati[username] = permessi;
    localStorage.setItem('permessi', JSON.stringify(permessiSalvati));
    alert("Permessi salvati con successo!");
    setTimeout(() => {
      navigate('/autorizzazioni-accessi');
    }, 100);
  };

  if (!utente) return <p style={{ padding: '20px' }}>Utente non trovato</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Autorizzazioni per {utente.nome} {utente.cognome} ({utente.username})</h2>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', marginTop: '20px' }}>
        <h3>Sezione Interventi</h3>
        {sezioni.interventi.map(({ key, label }) => (
          <div key={key} style={{ marginBottom: '15px' }}>
            <strong>{label}</strong>
            <div style={{ marginTop: '5px' }}>
              <label style={{ marginRight: '15px' }}>
                <input
                  type="radio"
                  name={key}
                  value="nessuno"
                  checked={permessi[key] === 'nessuno'}
                  onChange={() => handleChangeLivello(key, 'nessuno')}
                />
                {' '}Nessuno
              </label>
              <label style={{ marginRight: '15px' }}>
                <input
                  type="radio"
                  name={key}
                  value="visualizzazione"
                  checked={permessi[key] === 'visualizzazione'}
                  onChange={() => handleChangeLivello(key, 'visualizzazione')}
                />
                {' '}Solo Visualizzazione
              </label>
              <label style={{ marginRight: '15px' }}>
                <input
                  type="radio"
                  name={key}
                  value="inserimento"
                  checked={permessi[key] === 'inserimento'}
                  onChange={() => handleChangeLivello(key, 'inserimento')}
                />
                {' '}Inserimento
              </label>
              <label>
                <input
                  type="radio"
                  name={key}
                  value="modifica"
                  checked={permessi[key] === 'modifica'}
                  onChange={() => handleChangeLivello(key, 'modifica')}
                />
                {' '}Modifica
              </label>
            </div>
          </div>
        ))}
      </div>

      <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '10px', marginTop: '40px' }}>
        <h3>Gestione e Impostazioni</h3>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left' }}>Sezione</th>
              <th style={{ textAlign: 'center' }}>Accesso</th>
            </tr>
          </thead>
          <tbody>
            {sezioni.gestione.map(({ key, label }) => (
              <tr key={key}>
                <td style={{ padding: '10px 0' }}>{label}</td>
                <td style={{ textAlign: 'center' }}>
                  <label style={{ marginRight: '20px' }}>
                    <input
                      type="radio"
                      name={key}
                      value="attivo"
                      checked={permessi[key] === 'attivo'}
                      onChange={() => handleToggleAttivo(key, true)}
                    />
                    {' '}Attivo
                  </label>
                  <label>
                    <input
                      type="radio"
                      name={key}
                      value="non_attivo"
                      checked={permessi[key] === 'non_attivo'}
                      onChange={() => handleToggleAttivo(key, false)}
                    />
                    {' '}Non Attivo
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button
        onClick={handleSalva}
        style={{
          marginTop: '30px',
          padding: '10px 20px',
          backgroundColor: '#4CAF50',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Salva Permessi
      </button>
    </div>
  );
}

export default AutorizzazioniDettaglio;




