// File InserisciIntervento.js aggiornato per NON usare localStorage, ma salvare da backend
import React, { useState, useEffect } from 'react';
import { salvaFoto } from '../utils/gestioneDati';

function InserisciIntervento() {
  const [logoInserisci, setLogoInserisci] = useState(null);
  const [tipo, setTipo] = useState('');
  const [categoria, setCategoria] = useState('');
  const [categorie, setCategorie] = useState([]);
  const [priorita, setPriorita] = useState('media');
  const [descrizione, setDescrizione] = useState('');
  const [luogo, setLuogo] = useState('');
  const [conferma, setConferma] = useState('');
  const [anteprima, setAnteprima] = useState(null);
  const [utenteAssegnato, setUtenteAssegnato] = useState('');
  const [utenti, setUtenti] = useState([]);
  const [luoghi, setLuoghi] = useState([]);
  const [salvataggioFinale, setSalvataggioFinale] = useState(false);
  const [fotoList, setFotoList] = useState([]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [textColor, setTextColor] = useState('#000000');

  useEffect(() => {
    fetch('https://manutenzione-backend.onrender.com/utenti')
      .then(res => res.json())
      .then(setUtenti);

    fetch('https://manutenzione-backend.onrender.com/luoghi')
      .then(res => res.json())
      .then(setLuoghi);

    fetch('https://manutenzione-backend.onrender.com/categorie')
      .then(res => res.json())
      .then(setCategorie);

    fetch('https://manutenzione-backend.onrender.com/impostazioni')
      .then(res => res.json())
      .then(data => {
        if (data.colori?.inserisciColor) setBgColor(data.colori.inserisciColor);
        if (data.colori?.inserisciTextColor) setTextColor(data.colori.inserisciTextColor);
        if (data.logoInserisci) setLogoInserisci(data.logoInserisci);
      });
  }, []);

  const salvaIntervento = () => {
    if (!tipo || !categoria || !descrizione || !utenteAssegnato || !luogo) {
      setConferma('Compila tutti i campi obbligatori.');
      return;
    }

    const nuovo = {
      id: Date.now(),
      tipo,
      categoria,
      priorita,
      descrizione,
      luogo,
      assegnatoA: utenteAssegnato,
      data: new Date().toLocaleDateString(),
      foto: fotoList
    };

    setConferma('Intervento pronto per la conferma finale ✅');
    setAnteprima(nuovo);
    setSalvataggioFinale(false);
  };

  const confermaFinale = () => {
    fetch("https://manutenzione-backend.onrender.com/interventi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(anteprima)
    })
      .then(res => res.json())
      .then(() => {
        fotoList.forEach((foto, index) => {
          salvaFoto('iniziali', anteprima.id + "_" + index, foto);
        });

        setConferma('Intervento salvato con successo definitivo ✅');
        setAnteprima(null);
        setTipo('');
        setCategoria('');
        setDescrizione('');
        setPriorita('media');
        setUtenteAssegnato('');
        setLuogo('');
        setFotoList([]);
        setSalvataggioFinale(true);
      })
      .catch(() => {
        setConferma('Errore nel salvataggio. Riprova.');
      });
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

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', padding: '20px', maxWidth: '1200px', margin: 'auto', backgroundColor: bgColor, color: textColor }}>
      <div style={{ flex: 1, paddingRight: '30px' }}>
        <button onClick={() => window.history.back()} style={{ marginBottom: '20px' }}>⬅️ Torna indietro</button>
        <h2>Inserisci Intervento</h2>

        <div style={{ marginBottom: '15px' }}>
          <label>Oggetto*</label>
          <input value={tipo} onChange={e => setTipo(e.target.value)} style={{ width: '100%', padding: '8px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Categoria*</label>
          <select value={categoria} onChange={e => setCategoria(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="">Seleziona</option>
            {categorie.map((cat, i) => <option key={i} value={cat.name}>{cat.name}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Priorità</label>
          <select value={priorita} onChange={e => setPriorita(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="bassa">Bassa</option>
            <option value="media">Media</option>
            <option value="alta">Alta</option>
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Descrizione*</label>
          <textarea value={descrizione} onChange={e => setDescrizione(e.target.value)} style={{ width: '100%', padding: '8px', minHeight: '100px' }} />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Luogo*</label>
          <select value={luogo} onChange={e => setLuogo(e.target.value)} style={{ width: '100%', padding: '8px' }}>
            <option value="">Seleziona luogo</option>
            {luoghi.map((luogo, i) => <option key={i} value={luogo.nome}>{luogo.nome} - {luogo.indirizzo}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Assegna a*</label>
          <select value={utenteAssegnato} onChange={e => setUtenteAssegnato(e.target.value)} style={{ width: '100%', padding: '8px' }}>
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
                <button onClick={() => rimuoviFoto(i)} style={{ position: "absolute", top: 0, right: 0, background: "red", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer" }}>×</button>
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

        <button onClick={salvaIntervento} style={{ padding: '10px 20px', marginRight: '10px' }}>Salva</button>
        {anteprima && (
          <button onClick={confermaFinale} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white' }}>Conferma Salvataggio</button>
        )}
        {conferma && <p style={{ marginTop: '15px', fontWeight: 'bold' }}>{conferma}</p>}
      </div>

      {logoInserisci && (
        <div style={{ flexShrink: 0 }}>
          <img src={logoInserisci} alt="Logo Inserisci" style={{ maxHeight: '400px' }} />
        </div>
      )}
    </div>
  );
}

export default InserisciIntervento;
