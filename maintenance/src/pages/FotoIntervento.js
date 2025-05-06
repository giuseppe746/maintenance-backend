import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function FotoIntervento() {
  const { id } = useParams();
  const [foto, setFoto] = useState([]);
  const [descrizione, setDescrizione] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const interventi = JSON.parse(localStorage.getItem("interventi")) || [];
    const intervento = interventi.find((item) => item.id.toString() === id);
    if (intervento) {
      setDescrizione(intervento.descrizione || "Nessuna descrizione disponibile");
      if (intervento.foto) {
        const lista = Array.isArray(intervento.foto) ? intervento.foto : [intervento.foto];
        setFoto(lista);
      } else {
        setFoto([]);
      }
    } else {
      setFoto([]);
    }
  }, [id]);

  return (
    <div style={{ padding: "30px", maxWidth: "900px", margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px" }}>⬅️ Torna indietro</button>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>📷 Foto intervento ID: {id}</h2>
      <p style={{ textAlign: "center", fontStyle: "italic", marginBottom: "30px" }}>{descrizione}</p>

      {foto.length === 0 ? (
        <p style={{ textAlign: "center" }}>Nessuna foto disponibile per questo intervento.</p>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "15px", justifyContent: "center" }}>
          {foto.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`foto-${i}`}
              style={{
                width: "250px",
                height: "auto",
                objectFit: "contain",
                borderRadius: "10px",
                boxShadow: "0 0 8px rgba(0,0,0,0.2)"
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default FotoIntervento;

