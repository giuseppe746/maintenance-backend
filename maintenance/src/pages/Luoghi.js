import React, { useState, useEffect } from 'react';

function Luoghi() {
  const [luoghi, setLuoghi] = useState(() => JSON.parse(localStorage.getItem('luoghi')) || []);
  const [nome, setNome] = useState('');
  const [indirizzo, setIndirizzo] = useState('');

  const handleAggiungiLuogo = () => {
    if (nome.trim() !== '' && indirizzo.trim() !== '') {
      const nuovoLuogo = { nome, indirizzo };
      const nuoviLuoghi = [...luoghi, nuovoLuogo];
      setLuoghi(nuoviLuoghi);
      localStorage.setItem('luoghi', JSON.stringify(nuoviLuoghi));
      setNome('');
      setIndirizzo('');
    }
  };

  const handleRimuoviLuogo = (nomeDaRimuovere) => {
    const aggiornati = luoghi.filter(l => l.nome !== nomeDaRimuovere);
    setLuoghi(aggiornati);
    localStorage.setItem('luoghi', JSON.stringify(aggiornati));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestione Luoghi</h2>

      <div style={{ marginBottom: '15px' }}>
        <label>Nome luogo:</label><br />
        <input
          type="text"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          placeholder="Es. Magazzino Est"
          style={{ padding: '8px', width: '300px', marginBottom: '10px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <label>Indirizzo:</label><br />
        <input
          type="text"
          value={indirizzo}
          onChange={(e) => setIndirizzo(e.target.value)}
          placeholder="Es. Via Roma 123"
          style={{ padding: '8px', width: '300px', marginBottom: '10px' }}
        />
      </div>

      <button onClick={handleAggiungiLuogo} style={{ padding: '10px 15px' }}>Aggiungi</button>

      <ul style={{ marginTop: '30px' }}>
        {luoghi.map((luogo, index) => (
          <li key={index} style={{ marginBottom: '10px' }}>
            <strong>{luogo.nome}</strong> – {luogo.indirizzo}
            <button
              onClick={() => handleRimuoviLuogo(luogo.nome)}
              style={{ marginLeft: '10px', backgroundColor: 'red', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}
            >
              Rimuovi
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Luoghi;
