import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFoto } from "../utils/gestioneDati";

function DettagliDescrizione() {
  const navigate = useNavigate();
  const [intervento, setIntervento] = useState(null);
  const [foto, setFoto] = useState(null);

  useEffect(() => {
    const dati = localStorage.getItem("descrizioneInterventoSelezionato");
    if (dati) {
      const interventoCaricato = JSON.parse(dati);
      setIntervento(interventoCaricato);

      const immagine = getFoto("iniziali", interventoCaricato.id);
      if (immagine) {
        setFoto(immagine);
      }
    }
  }, []);

  if (!intervento) {
    return <p>Nessuna descrizione disponibile</p>;
  }

  return (
    <div style={{ padding: "30px", maxWidth: "700px", margin: "auto" }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: "20px", padding: "8px 12px" }}>← Indietro</button>

      <h2>Dettagli Intervento</h2>
      <p><strong>Oggetto:</strong> {intervento.tipo}</p>
      <p><strong>Categoria:</strong> {intervento.categoria}</p>
      <p><strong>Priorità:</strong> {intervento.priorita}</p>
      <p><strong>Luogo:</strong> {intervento.luogo}</p>
      <p><strong>Assegnato a:</strong> {intervento.assegnatoA}</p>
      <p><strong>Data:</strong> {intervento.data}</p>
      <p><strong>Descrizione:</strong></p>
      <div style={{ backgroundColor: "#f4f4f4", padding: "10px", borderRadius: "6px", marginBottom: "15px" }}>
        {intervento.descrizione || "(nessuna descrizione)"}
      </div>

      {foto && (
        <div style={{ textAlign: "center" }}>
          <h4>Foto Allegata</h4>
          <img src={foto} alt="Foto intervento" style={{ maxWidth: "100%", borderRadius: "6px", marginBottom: "20px" }} />
          <button onClick={() => navigate(-1)} style={{ padding: "8px 12px", marginTop: "10px" }}>← Indietro</button>
        </div>
      )}
    </div>
  );
}

export default DettagliDescrizione;
