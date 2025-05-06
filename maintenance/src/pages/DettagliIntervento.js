import React from 'react';
import { useParams } from 'react-router-dom';
import CommentiIntervento from './CommentiIntervento';

function DettagliIntervento() {
  const { id } = useParams();

  // Dati fittizi per i dettagli dell'intervento (simula una chiamata API)
  const interventionsDetails = {
    1: { id: 1, category: 'Edile', description: 'Riparazione tetto urgente', status: 'Da effettuare', date: '2023-03-10' },
    2: { id: 2, category: 'Elettrico', description: 'Controllo impianto elettrico', status: 'In corso', date: '2023-03-12' },
    3: { id: 3, category: 'Idraulico', description: 'Sostituzione rubinetto', status: 'Concluso', date: '2023-03-08' },
    4: { id: 4, category: 'Varie', description: 'Manutenzione generale', status: 'Da effettuare', date: '2023-03-11' },
  };

  const intervento = interventionsDetails[id];

  if (!intervento) {
    return <p>Intervento non trovato.</p>;
  }

  return (
    <div>
      <h2>Dettagli Intervento</h2>
      <p><strong>ID:</strong> {intervento.id}</p>
      <p><strong>Categoria:</strong> {intervento.category}</p>
      <p><strong>Descrizione:</strong> {intervento.description}</p>
      <p><strong>Status:</strong> {intervento.status}</p>
      <p><strong>Data:</strong> {intervento.date}</p>
      {/* Includiamo il componente dei commenti */}
      <CommentiIntervento interventionId={intervento.id} />
    </div>
  );
}

export default DettagliIntervento;
