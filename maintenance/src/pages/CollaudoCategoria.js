import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { API_URL } from '../config';

function CollaudoCategoria() {
  const { categoria } = useParams();
  const [interventiFiltrati, setInterventiFiltrati] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/interventi`)
      .then(res => res.json())
      .then(data => {
        const filtrati = data.filter(i => i.categoria === categoria && i.stato === "Da Collaudare");
        setInterventiFiltrati(filtrati);
      })
      .catch(() => setInterventiFiltrati([]));
  }, [categoria]);

  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ marginBottom: "20px" }}>Collaudo - Categoria: {categoria}</h2>
      {interventiFiltrati.length === 0 ? (
        <p>Nessun intervento da collaudare per questa categoria.</p>
      ) : (
        <ul>
          {interventiFiltrati.map((intervento) => (
            <li key={intervento.id}>
              <strong>{intervento.tipo}</strong> - {intervento.descrizione}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CollaudoCategoria;
