import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function InterventiCategoria({ interventi }) {
  const { categoria } = useParams();
  const navigate = useNavigate();
  const [dataFiltro, setDataFiltro] = useState('');

  const interventiFiltrati = interventi.filter(i =>
    i.category === categoria &&
    (!dataFiltro || i.date === dataFiltro)
  );

  return (
    <div>
      <button
        onClick={() => navigate('/elenco-interventi')}
        style={{
          marginBottom: '20px',
          padding: '8px 16px',
          backgroundColor: '#888',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        ← Torna indietro
      </button>

      <h2>Interventi - Categoria: {categoria}</h2>

      <div style={{ marginBottom: '20px' }}>
        <label>Filtra per data: </label>
        <input
          type="date"
          value={dataFiltro}
          onChange={(e) => setDataFiltro(e.target.value)}
          style={{ padding: '5px', marginLeft: '10px' }}
        />
      </div>

      {interventiFiltrati.length === 0 ? (
        <p>Nessun intervento trovato.</p>
      ) : (
        <ul>
          {interventiFiltrati.map((intervento, index) => (
            <li key={index}>
              <strong>{intervento.titolo}</strong> - {intervento.description} - <em>{intervento.date}</em> - {intervento.status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InterventiCategoria;


