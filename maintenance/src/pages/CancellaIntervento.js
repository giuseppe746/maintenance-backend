import React, { useState } from 'react';

function CancellaIntervento() {
  const [interventoId, setInterventoId] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulazione della cancellazione: in una versione reale eseguiresti una chiamata API per cancellare il record
    alert(`Intervento con ID ${interventoId} è stato cancellato (simulazione)`);
    setInterventoId('');
  };

  return (
    <div>
      <h2>Cancella Intervento</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ID Intervento:</label>
          <input 
            type="text"
            value={interventoId}
            onChange={(e) => setInterventoId(e.target.value)}
            placeholder="Inserisci l'ID dell'intervento da cancellare"
            required
          />
        </div>
        <button type="submit">Cancella Intervento</button>
      </form>
    </div>
  );
}

export default CancellaIntervento;
