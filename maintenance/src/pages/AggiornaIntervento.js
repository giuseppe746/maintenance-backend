import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveToBackupFile } from '../utils/backup';

function AggiornaIntervento() {
  const [intervento, setIntervento] = useState(null);
  const [luoghi, setLuoghi] = useState([]);
  const [utenti, setUtenti] = useState([]);
  const [categorie, setCategorie] = useState([]);
  const [fotoList, setFotoList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const dati = JSON.parse(localStorage.getItem("interventoDaModificare"));
    if (dati) {
      setIntervento(dati);
      setFotoList(Array.isArray(dati.foto) ? dati.foto : dati.foto ? [dati.foto] : []);
    }
    setLuoghi(JSON.parse(localStorage.getItem("luoghi")) || []);
    setUtenti(JSON.parse(localStorage.getItem("utenti")) || []);
    setCategorie(JSON.parse(localStorage.getItem("categorie")) || []);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIntervento(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const gestisciFoto = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setFotoList(prev => [...prev, reader.result]);
    };
    if (file) reader.readAsDataURL(file);
  };

  const rimuoviFoto = (index) => {
    setFotoList(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tutti = JSON.parse(localStorage.getItem("interventi")) || [];
    const aggiornati = tutti.map((item) =>
      item.id === intervento.id
        ? { ...intervento, foto: fotoList, modificato: true }
        : item
    );

    localStorage.setItem("interventi", JSON.stringify(aggiornati));
    saveToBackupFile(aggiornati);
    localStorage.removeItem("interventoDaModificare");
    alert("✅ Intervento aggiornato!");
    navigate("/visualizza-interventi");
  };

  if (!intervento) return <p style={{ padding: 20 }}>⏳ Caricamento intervento...</p>;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '20px', maxWidth: '900px', margin: 'auto', backgroundColor: '#f9f9f9', color: '#000' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>⬅️ Torna indietro</button>
      <h2 style={{ textAlign: "center" }}>Modifica Intervento</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Tipo*</label>
          <input type="text" name="tipo" value={intervento.tipo || ''} onChange={handleChange} style={{ width: '100%', padding: '8px' }} required />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Categoria*</label>
          <select name="categoria" value={intervento.categoria || ''} onChange={handleChange} style={{ width: '100%', padding: '8px' }} required>
            <option value="">Seleziona</option>
            {categorie.map((cat, i) => <option key={i} value={cat.name}>{cat.name}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Priorità</label>
          <select name="priorita" value={intervento.priorita || 'media'} onChange={handleChange} style={{ width: '100%', padding: '8px' }}>
            <option value="bassa">Bassa</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Descrizione*</label>
          <textarea name="descrizione" value={intervento.descrizione || ''} onChange={handleChange} style={{ width: '100%', padding: '8px', minHeight: '100px' }} required />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Luogo*</label>
          <select name="luogo" value={intervento.luogo || ''} onChange={handleChange} style={{ width: '100%', padding: '8px' }} required>
            <option value="">Seleziona luogo</option>
            {luoghi.map((luogo, i) => <option key={i} value={luogo.nome}>{luogo.nome} - {luogo.indirizzo}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Assegna a*</label>
          <select name="assegnatoA" value={intervento.assegnatoA || ''} onChange={handleChange} style={{ width: '100%', padding: '8px' }} required>
            <option value="">Seleziona utente</option>
            {utenti.map((u, i) => <option key={i} value={`${u.nome} ${u.cognome}`}>{u.nome} {u.cognome}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '25px' }}>
          <label style={{ fontWeight: "bold", display: "block", marginBottom: "10px" }}>📷 Foto intervento:</label>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            {fotoList.map((foto, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img src={foto} alt={`foto-${i}`} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "6px", border: "1px solid #ccc" }} />
                <button onClick={() => rimuoviFoto(i)} type="button" style={{
                  position: "absolute", top: 0, right: 0, background: "red", color: "white", border: "none",
                  borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer"
                }}>×</button>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "15px", display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <label style={{ padding: "10px", background: "#e0e0e0", borderRadius: "5px", cursor: "pointer" }}>
              📎 Allega una foto
              <input type="file" accept="image/*" onChange={gestisciFoto} style={{ display: "none" }} />
            </label>
            <label style={{ padding: "10px", background: "#d4edda", borderRadius: "5px", cursor: "pointer" }}>
              📸 Scatta una foto
              <input type="file" accept="image/*" capture="environment" onChange={gestisciFoto} style={{ display: "none" }} />
            </label>
          </div>
        </div>

        <button type="submit" style={{ padding: '12px', width: '100%', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px' }}>
          💾 Salva modifiche
        </button>
      </form>
    </div>
  );
}

export default AggiornaIntervento;
