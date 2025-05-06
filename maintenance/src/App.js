import React, { useState, useEffect, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import BackupAutomatico from "./components/BackupAutomatico";

import Luoghi from './pages/Luoghi';
import Dashboard from './pages/Dashboard';
import ElencoInterventi from './pages/ElencoInterventi';
import InterventiCategoria from './pages/InterventiCategoria';
import Storico from './pages/Storico';
import GestioneUtenti from './pages/GestioneUtenti';
import Impostazioni from './pages/Impostazioni';
import Login from './pages/Login';
import RecuperaPassword from './pages/RecuperaPassword';
import Profilo from './pages/Profilo';
import ModificaProfilo from './pages/ModificaProfilo';
import InserisciIntervento from './pages/InserisciIntervento';
import AggiornaIntervento from './pages/AggiornaIntervento';
import CancellaIntervento from './pages/CancellaIntervento';
import DettagliIntervento from './pages/DettagliIntervento';
import DettagliDescrizione from './pages/DettagliDescrizione';
import Notifiche from './pages/Notifiche';
import GestioneCategorie from './pages/GestioneCategorie';
import ModificaPassword from './pages/ModificaPassword';
import VisualizzaInterventi from './pages/VisualizzaInterventi';
import SelezionaCategoriaCollaudo from './pages/SelezionaCategoriaCollaudo';
import CollaudoCategoria from './pages/CollaudoCategoria';
import AutorizzazioniAccessi from './pages/AutorizzazioniAccessi';
import AutorizzazioniDettaglio from './pages/AutorizzazioniDettaglio';
import GestioneRuoli from './pages/GestioneRuoli';
import FotoIntervento from './pages/FotoIntervento';
import ScattaFoto from './pages/ScattaFoto';
import AllegaFoto from './pages/AllegaFoto';
import ArchivioFoto from './pages/ArchivioFoto';
import UploadFoto from './pages/UploadFoto';

import './App.css';

function AppContent() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [interventi, setInterventi] = useState([]);
  const [luoghi, setLuoghi] = useState([]);
  const [utenti, setUtenti] = useState([]);

  useEffect(() => {
    fetch("https://manutenzione-backend.onrender.com/interventi")
      .then(res => res.json())
      .then(data => setInterventi(data))
      .catch(err => {
        console.error("Errore nel caricamento interventi:", err);
        setInterventi([]);
      });

    fetch("https://manutenzione-backend.onrender.com/luoghi")
      .then(res => res.json())
      .then(data => setLuoghi(data))
      .catch(err => {
        console.error("Errore nel caricamento luoghi:", err);
        setLuoghi([]);
      });

    fetch("https://manutenzione-backend.onrender.com/utenti")
      .then(res => res.json())
      .then(data => setUtenti(data))
      .catch(err => {
        console.error("Errore nel caricamento utenti:", err);
        setUtenti([]);
      });
  }, []);

  const addIntervento = (nuovo) => {
    fetch("https://manutenzione-backend.onrender.com/interventi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(nuovo)
    })
      .then(res => res.json())
      .then(() => setInterventi(prev => [...prev, nuovo]))
      .catch(err => {
        console.error("Errore nel salvataggio intervento:", err);
      });
  };

  const updateIntervento = (index, updated) => {
    const nuovi = [...interventi];
    nuovi[index] = updated;
    setInterventi(nuovi);
    // Se vuoi, puoi anche aggiornare sul backend
  };

  const removeIntervento = (index) => {
    setInterventi(prev => prev.filter((_, i) => i !== index));
    // Potresti anche aggiungere DELETE su backend
  };

  const addLuogo = (nuovo) => {
    const aggiornati = [...luoghi, nuovo];

    fetch("https://manutenzione-backend.onrender.com/luoghi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(aggiornati)
    })
      .then(res => res.json())
      .then(() => setLuoghi(aggiornati))
      .catch(err => {
        console.error("Errore nel salvataggio luoghi:", err);
      });
  };

  const addUtente = (nuovo) => {
    const aggiornati = [...utenti, nuovo];

    fetch("https://manutenzione-backend.onrender.com/utenti", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(aggiornati)
    })
      .then(res => res.json())
      .then(() => setUtenti(aggiornati))
      .catch(err => {
        console.error("Errore nel salvataggio utenti:", err);
      });
  };

  return (
    <div className="app-container">
      {location.pathname !== "/login" && user && <Header />}
      {user && <BackupAutomatico />}
      <div className="content-wrapper">
        {location.pathname !== "/login" && user && <Sidebar />}
        <div className="main-content">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/recupera-password" element={<RecuperaPassword />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/elenco-interventi" element={<ElencoInterventi interventi={interventi} />} />
            <Route path="/elenco-interventi/:categoria" element={<InterventiCategoria interventi={interventi} />} />
            <Route path="/storico" element={<Storico />} />
            <Route path="/gestione-utenti" element={<GestioneUtenti utenti={utenti} addUtente={addUtente} />} />
            <Route path="/gestione-categorie" element={<GestioneCategorie />} />
            <Route path="/gestione-ruoli" element={<GestioneRuoli />} />
            <Route path="/gestione-autorizzazioni" element={<AutorizzazioniAccessi />} />
            <Route path="/gestione-autorizzazioni/:username" element={<AutorizzazioniDettaglio />} />
            <Route path="/impostazioni" element={<Impostazioni />} />
            <Route path="/profilo" element={<Profilo />} />
            <Route path="/modifica-profilo" element={<ModificaProfilo />} />
            <Route path="/inserisci-intervento" element={<InserisciIntervento addIntervento={addIntervento} luoghi={luoghi} utenti={utenti} />} />
            <Route path="/aggiorna-intervento" element={<AggiornaIntervento />} />
            <Route path="/cancella-intervento" element={<CancellaIntervento />} />
            <Route path="/dettagli-intervento/:id" element={<DettagliIntervento />} />
            <Route path="/dettagli-descrizione" element={<DettagliDescrizione />} />
            <Route path="/notifiche" element={<Notifiche />} />
            <Route path="/modifica-password" element={<ModificaPassword />} />
            <Route path="/visualizza-interventi" element={<VisualizzaInterventi interventi={interventi} updateIntervento={updateIntervento} removeIntervento={removeIntervento} />} />
            <Route path="/collaudo-interventi" element={<SelezionaCategoriaCollaudo interventi={interventi} />} />
            <Route path="/collaudo-interventi/:categoria" element={<CollaudoCategoria interventi={interventi} />} />
            <Route path="/luoghi" element={<Luoghi luoghi={luoghi} addLuogo={addLuogo} />} />
            <Route path="/intervento/:id" element={<DettagliIntervento />} />
            <Route path="/foto-intervento/:id" element={<FotoIntervento />} />
            <Route path="/scatta-foto/:id" element={<ScattaFoto />} />
            <Route path="/allega-foto/:id" element={<AllegaFoto />} />
            <Route path="/archivio-foto" element={<ArchivioFoto />} />
            <Route path="/upload-foto" element={<UploadFoto />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
