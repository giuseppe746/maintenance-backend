import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../config";

function VisualizzaInterventi() {
  const { user } = useContext(AuthContext);
  const [dati, setDati] = useState([]);
  const [logoVisualizza, setLogoVisualizza] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/interventi`)
      .then(res => res.json())
      .then(data => setDati(data))
      .catch(() => setDati([]));

    const logo = localStorage.getItem("logoVisualizza");
    if (logo) setLogoVisualizza(logo);
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("it-IT");
  };

  const aggiornaBackend = (nuovi) => {
    setDati(nuovi);
    fetch(`${API_URL}/interventi`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuovi)
    });
  };

  const handleCheckboxChange = (index, campo, valore) => {
    const nuovi = [...dati];
    nuovi[index][campo] = valore;

    if (campo === "completato" && !valore) {
      nuovi[index].dataCompletato = "";
      nuovi[index].fotoCompletamento = [];
    }

    aggiornaBackend(nuovi);
  };

  const handleDataCompletamento = (index, data) => {
    const nuovi = [...dati];
    nuovi[index].dataCompletato = data;
    aggiornaBackend(nuovi);
  };

  const handleScattaFoto = (id) => {
    navigate(`/scatta-foto/${id}`);
  };

  const handleAllegaFoto = (id) => {
    navigate(`/allega-foto/${id}`);
  };

  const handleVisualizzaFoto = (id) => {
    navigate(`/foto-intervento/${id}`);
  };

  const handleSave = (index) => {
    const intervento = dati[index];
    localStorage.setItem("interventoDaModificare", JSON.stringify(intervento));
    navigate("/aggiorna-intervento");
  };

  const handleRemove = (index) => {
    if (window.confirm("Sei sicuro di voler eliminare questo intervento?")) {
      const nuovi = dati.filter((_, i) => i !== index);
      aggiornaBackend(nuovi);
    }
  };

  const handleInviaACollaudo = (index) => {
    const nuovi = [...dati];
    nuovi[index].prontoPerCollaudo = true;
    aggiornaBackend(nuovi);
    alert("Intervento inviato a collaudo!");
  };

  return (
    <div style={{ padding: "30px", maxWidth: "100%", margin: "auto" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
        <div style={{ flex: 1 }}>
          <h2 style={{ marginBottom: "30px", color: "#333" }}>
            Visualizza Interventi
          </h2>

          {dati.length === 0 ? (
            <p style={{ textAlign: "center", fontSize: "18px", color: "#777" }}>
              Nessun intervento presente
            </p>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse", backgroundColor: "#fff" }}>
              <thead>
                <tr style={{ backgroundColor: "#5D4037", color: "white" }}>
                  <th>Intervento</th>
                  <th>Assegnato a</th>
                  <th>Data</th>
                  <th>Descrizione</th>
                  <th>Foto</th>
                  <th>Da completare</th>
                  <th>Completato</th>
                  <th>Data</th>
                  <th>Scatta foto</th>
                  <th>Azioni</th>
                </tr>
              </thead>
              <tbody>
                {dati.map((row, index) => (
                  <tr key={index} style={{ borderBottom: "1px solid #ddd", textAlign: "center" }}>
                    <td>{row.tipo}</td>
                    <td>{row.assegnatoA}</td>
                    <td>{formatDate(row.data)}</td>
                    <td>{row.descrizione}</td>
                    <td>
                      <button onClick={() => handleVisualizzaFoto(row.id)}>📷 Visualizza</button>
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={row.daCompletare || false}
                        onChange={(e) => handleCheckboxChange(index, "daCompletare", e.target.checked)}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={row.completato || false}
                        onChange={(e) => handleCheckboxChange(index, "completato", e.target.checked)}
                      />
                    </td>
                    <td>
                      {row.completato && (
                        <input
                          type="date"
                          value={row.dataCompletato || ""}
                          onChange={(e) => handleDataCompletamento(index, e.target.value)}
                        />
                      )}
                    </td>
                    <td>
                      {row.completato && (
                        <>
                          <button onClick={() => handleScattaFoto(row.id)} style={{ fontSize: '16px', padding: '6px 12px' }}>📸 Scatta</button>
                          <button onClick={() => handleAllegaFoto(row.id)} style={{ marginLeft: "5px", fontSize: '16px', padding: '6px 12px' }}>📌 Allega</button>
                        </>
                      )}
                    </td>
                    <td>
                      <button onClick={() => handleSave(index)}>✏️</button>
                      <button onClick={() => handleRemove(index)}>🗑️</button>
                      <button
                        onClick={() => handleInviaACollaudo(index)}
                        style={{ marginLeft: "5px", backgroundColor: "#28a745", color: "white", border: "none", padding: "5px 10px", borderRadius: "5px" }}
                      >
                        ✅ Invia a Collaudo
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        {logoVisualizza && (
          <img src={logoVisualizza} alt="Logo Visualizza" style={{ maxHeight: '400px', marginLeft: '40px' }} />
        )}
      </div>
    </div>
  );
}

export default VisualizzaInterventi;
