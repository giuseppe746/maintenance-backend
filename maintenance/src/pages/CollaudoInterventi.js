import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

function CollaudoInterventi() {
  const navigate = useNavigate();
  const [interventi, setInterventi] = useState([]);
  const [logoCollaudo, setLogoCollaudo] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/interventi`)
      .then(res => res.json())
      .then(data => {
        const pronti = data.filter(intervento => intervento.prontoPerCollaudo);
        setInterventi(pronti);
      })
      .catch(() => setInterventi([]));

    fetch(`${API_URL}/impostazioni`)
      .then(res => res.json())
      .then(data => {
        if (data.logoCollaudo) setLogoCollaudo(data.logoCollaudo);
      });
  }, []);

  const handleVisualizzaFoto = (id) => {
    navigate(`/allega-foto/${id}`);
  };

  return (
    <div style={{ display: 'flex', padding: '20px' }}>
      <div style={{ flex: 1 }}>
        <h2 style={{ marginBottom: '20px' }}>Collaudo Interventi</h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
          <thead>
            <tr>
              <th>ID Intervento</th>
              <th>Oggetto</th>
              <th>Categoria</th>
              <th>Assegnato a</th>
              <th>Azioni</th>
            </tr>
          </thead>
          <tbody>
            {interventi.map((intervento, index) => (
              <tr key={index}>
                <td>{intervento.id}</td>
                <td>{intervento.tipo}</td>
                <td>{intervento.categoria}</td>
                <td>{intervento.assegnatoA}</td>
                <td>
                  <button
                    onClick={() => handleVisualizzaFoto(intervento.id)}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#2196F3',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '5px',
                      cursor: 'pointer',
                    }}
                  >
                    Visualizza Foto
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {logoCollaudo && (
        <div style={{ marginLeft: '40px' }}>
          <img
            src={logoCollaudo}
            alt="Logo Collaudo"
            style={{ maxHeight: '400px', maxWidth: '100%' }}
          />
        </div>
      )}
    </div>
  );
}

export default CollaudoInterventi;
