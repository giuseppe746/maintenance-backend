import React, { useState, useEffect } from "react";
import { API_URL } from '../config';

function ElencoInterventi() {
  const [dati, setDati] = useState([]);
  const [filtri, setFiltri] = useState({
    stato: "",
    esito: "",
    dataInserimentoDa: "",
    dataInserimentoA: "",
    dataCompletamentoDa: "",
    dataCompletamentoA: "",
    dataCollaudoDa: "",
    dataCollaudoA: "",
  });

  useEffect(() => {
    fetch(`${API_URL}/interventi`)
      .then(res => res.json())
      .then(data => setDati(data))
      .catch(() => setDati([]));
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("it-IT");
  };

  const applicaFiltri = (intervento) => {
    const {
      stato,
      esito,
      dataInserimentoDa,
      dataInserimentoA,
      dataCompletamentoDa,
      dataCompletamentoA,
      dataCollaudoDa,
      dataCollaudoA,
    } = filtri;

    const inRange = (val, da, a) => {
      if (!val) return false;
      const d = new Date(val);
      if (da && new Date(da) > d) return false;
      if (a && new Date(a) < d) return false;
      return true;
    };

    if (stato === "daCompletare" && !intervento.daCompletare) return false;
    if (stato === "completato" && !intervento.completato) return false;
    if (stato === "collaudato" && !intervento.esitoCollaudo) return false;

    if (esito && intervento.esitoCollaudo !== esito) return false;

    if (
      (dataInserimentoDa || dataInserimentoA) &&
      !inRange(intervento.data, dataInserimentoDa, dataInserimentoA)
    ) return false;

    if (
      (dataCompletamentoDa || dataCompletamentoA) &&
      !inRange(intervento.dataCompletato, dataCompletamentoDa, dataCompletamentoA)
    ) return false;

    if (
      (dataCollaudoDa || dataCollaudoA) &&
      !inRange(intervento.dataCollaudo, dataCollaudoDa, dataCollaudoA)
    ) return false;

    return true;
  };

  const handleChange = (e) => {
    setFiltri({ ...filtri, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFiltri({
      stato: "",
      esito: "",
      dataInserimentoDa: "",
      dataInserimentoA: "",
      dataCompletamentoDa: "",
      dataCompletamentoA: "",
      dataCollaudoDa: "",
      dataCollaudoA: "",
    });
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Elenco Completo Interventi
      </h2>

      <div style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
        <select name="stato" value={filtri.stato} onChange={handleChange}>
          <option value="">Tutti gli stati</option>
          <option value="daCompletare">Da completare</option>
          <option value="completato">Completato</option>
          <option value="collaudato">Collaudato</option>
        </select>

        <select name="esito" value={filtri.esito} onChange={handleChange}>
          <option value="">Tutti gli esiti</option>
          <option value="positivo">Positivo</option>
          <option value="negativo">Negativo</option>
        </select>

        <div>
          <label>Data Inserimento:</label>
          <input type="date" name="dataInserimentoDa" value={filtri.dataInserimentoDa} onChange={handleChange} />
          <input type="date" name="dataInserimentoA" value={filtri.dataInserimentoA} onChange={handleChange} />
        </div>

        <div>
          <label>Data Completamento:</label>
          <input type="date" name="dataCompletamentoDa" value={filtri.dataCompletamentoDa} onChange={handleChange} />
          <input type="date" name="dataCompletamentoA" value={filtri.dataCompletamentoA} onChange={handleChange} />
        </div>

        <div>
          <label>Data Collaudo:</label>
          <input type="date" name="dataCollaudoDa" value={filtri.dataCollaudoDa} onChange={handleChange} />
          <input type="date" name="dataCollaudoA" value={filtri.dataCollaudoA} onChange={handleChange} />
        </div>

        <button onClick={handleReset}>Reset Filtri</button>
      </div>

      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ backgroundColor: "#5D4037", color: "white" }}>
            <th>Tipo</th>
            <th>Assegnato</th>
            <th>Data Inserimento</th>
            <th>Data Completamento</th>
            <th>Data Collaudo</th>
            <th>Esito</th>
          </tr>
        </thead>
        <tbody>
          {dati.filter(applicaFiltri).map((row, index) => (
            <tr key={index} style={{ borderBottom: "1px solid #ccc", textAlign: "center" }}>
              <td>{row.tipo}</td>
              <td>{row.assegnatoA}</td>
              <td>{formatDate(row.data)}</td>
              <td>{formatDate(row.dataCompletato)}</td>
              <td>{formatDate(row.dataCollaudo)}</td>
              <td>{row.esitoCollaudo || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ElencoInterventi;

