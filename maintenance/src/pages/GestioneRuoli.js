import React, { useState, useEffect } from 'react';

const ruoliPredefiniti = [
  { nome: 'Amministratore', descrizione: 'Accesso completo a tutte le funzionalità del sistema.' },
  { nome: 'Manutentore', descrizione: 'Può visualizzare e aggiornare interventi, ma non crearli né cancellarli.' },
  { nome: 'Supervisore', descrizione: 'Supervisiona lo stato degli interventi e gestisce i report.' },
  { nome: 'Notificatore', descrizione: 'Riceve notifiche e promemoria, senza possibilità di modifica.' }
];

function GestioneRuoli() {
  const [ruoli, setRuoli] = useState(() => {
    const salvati = JSON.parse(localStorage.getItem('ruoliAggiuntivi')) || [];
    return [...ruoliPredefiniti, ...salvati];
  });

  const [nuovoRuolo, setNuovoRuolo] = useState('');
  const [descrizione, setDescrizione] = useState('');

  useEffect(() => {
    const aggiuntivi = ruoli.filter(r => !ruoliPredefiniti.some(p => p.nome === r.nome));
    localStorage.setItem('ruoliAggiuntivi', JSON.stringify(aggiuntivi));
  }, [ruoli]);

  const handleAggiungiRuolo = () => {
    if (!nuovoRuolo || !descrizione) return;
    if (ruoli.some(r => r.nome === nuovoRuolo)) return;

    const nuovi = [...ruoli, { nome: nuovoRuolo, descrizione }];
    setRuoli(nuovi);
    setNuovoRuolo('');
    setDescrizione('');
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestione Ruoli</h2>

      <div style={{ marginBottom: '30px' }}>
        <h3>Aggiungi Nuovo Ruolo</h3>
        <input
          type="text"
          placeholder="Nome ruolo"
          value={nuovoRuolo}
          onChange={(e) => setNuovoRuolo(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '200px' }}
        />
        <input
          type="text"
          placeholder="Descrizione"
          value={descrizione}
          onChange={(e) => setDescrizione(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', width: '400px' }}
        />
        <button onClick={handleAggiungiRuolo} style={{ padding: '8px 16px' }}>Aggiungi</button>
      </div>

      <h3>Elenco Ruoli</h3>
      <ul>
        {ruoli.map((ruolo, idx) => (
          <li key={idx} style={{ marginBottom: '10px' }}>
            <strong>{ruolo.nome}</strong>: {ruolo.descrizione}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GestioneRuoli;