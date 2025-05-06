// File Impostazioni.js aggiornato per salvare SOLO nel backend
import React, { useState, useEffect } from 'react';
import './Impostazioni.css';
import {
  salvaBackupSuDisco,
  importaBackupDaFile,
  verificaBackupAutomatico,
  salvaTutteLeImpostazioni
} from '../utils/storageUtils';
import { salvaDirectoryHandle, recuperaDirectoryHandle } from '../utils/fsUtils';
import { API_URL } from '../config';

function Impostazioni() {
  const [logoIntestazione, setLogoIntestazione] = useState(null);
  const [logoVisualizza, setLogoVisualizza] = useState(null);
  const [logoArchivio, setLogoArchivio] = useState(null);
  const [logoCollaudo, setLogoCollaudo] = useState(null);
  const [logoElenco, setLogoElenco] = useState(null);
  const [logoStorico, setLogoStorico] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const [colorGrafico, setColorGrafico] = useState('#007bff');
  const [colorCompletati, setColorCompletati] = useState('#28a745');
  const [colorDaCompletare, setColorDaCompletare] = useState('#ffc107');
  const [backupGiorni, setBackupGiorni] = useState(0);
  const [fotoDirectoryName, setFotoDirectoryName] = useState(null);

  const sezioniColori = [
    ['Intestazione', 'headerColor', 'headerTextColor'],
    ['Sidebar', 'sidebarColor', 'sidebarTextColor'],
    ['Dashboard', 'dashboardColor', 'dashboardTextColor'],
    ['Inserisci Intervento', 'inserisciColor', 'inserisciTextColor'],
    ['Visualizza Interventi', 'visualizzaColor', 'visualizzaTextColor'],
    ['Collaudo Interventi', 'collaudoColor', 'collaudoTextColor'],
    ['Storico', 'storicoColor', 'storicoTextColor'],
    ['Gestione Utenti', 'utentiColor', 'utentiTextColor']
  ];
  const [colori, setColori] = useState({});
  const [categorieColori, setCategorieColori] = useState({});
  const [categorieSalvate, setCategorieSalvate] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/impostazioni`)
      .then(res => res.json())
      .then(data => {
        setChartType(data.chartType || 'bar');
        setColorGrafico(data.colorGrafico || '#007bff');
        setColorCompletati(data.colorCompletati || '#28a745');
        setColorDaCompletare(data.colorDaCompletare || '#ffc107');
        setCategorieColori(data.categorieColori || {});
        setCategorieSalvate(data.categorie || []);
        setColori(data.colori || {});
      })
      .catch(err => console.error("Errore lettura impostazioni dal backend:", err));
  }, []);

  useEffect(() => {
    verificaBackupAutomatico(backupGiorni);
    const dir = recuperaDirectoryHandle();
    dir.then(handle => {
      if (handle && handle.name) setFotoDirectoryName(handle.name);
    });
  }, [backupGiorni]);

  useEffect(() => {
    fetch(`${API_URL}/impostazioni`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chartType, colorGrafico, colorCompletati, colorDaCompletare, categorieColori, colori })
    }).catch(err => console.error('Errore salvataggio impostazioni nel backend:', err));
  }, [chartType, colorGrafico, colorCompletati, colorDaCompletare, categorieColori, colori]);

  const aggiornaColore = (chiave, valore) => {
    setColori(prev => ({ ...prev, [chiave]: valore }));
  };

  const aggiornaColoreCategoria = (categoria, colore) => {
    setCategorieColori(prev => ({ ...prev, [categoria]: colore }));
  };

  const applicaColori = () => {
    alert('Colori aggiornati. Salvataggio automatico attivo.');
  };

  const salvaLogo = (file, key, setPreview) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem(key, reader.result); // mantenuto per anteprima, ma si può salvare anche su backend
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const rimuoviLogo = (key, setPreview) => {
    localStorage.removeItem(key);
    setPreview(null);
  };

  const scegliCartellaFoto = async () => {
    try {
      const handle = await window.showDirectoryPicker();
      await salvaDirectoryHandle(handle);
      setFotoDirectoryName(handle.name);
    } catch (err) {
      console.error(err);
    }
  };

  const handleImportBackup = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      await importaBackupDaFile(file);
      alert('Backup importato con successo!');
    } catch (err) {
      alert('Errore durante importazione: ' + err.message);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '30px' }}>Impostazioni</h1>
      <div className="impostazioni-container" style={{ display: 'flex', flexDirection: 'row', gap: '40px' }}>
        <div style={{ flex: 1 }}>
          {[['Logo Intestazione', 'appLogo', logoIntestazione, setLogoIntestazione],
            ['Logo Visualizza Interventi', 'logoVisualizza', logoVisualizza, setLogoVisualizza],
            ['Logo Archivio Foto', 'logoArchivio', logoArchivio, setLogoArchivio],
            ['Logo Collaudo Interventi', 'logoCollaudo', logoCollaudo, setLogoCollaudo],
            ['Logo Elenco Interventi', 'logoElenco', logoElenco, setLogoElenco],
            ['Logo Storico', 'logoStorico', logoStorico, setLogoStorico]
          ].map(([label, key, value, setter]) => (
            <section key={key}>
              <h3>{label}</h3>
              <input type="file" accept="image/*" onChange={(e) => salvaLogo(e.target.files[0], key, setter)} />
              {value && <img src={value} alt={label} className="logo-preview" />}
              <div style={{ display: 'flex', gap: '10px' }}>
                <button onClick={() => alert('Applicato!')}>Applica</button>
                <button onClick={() => rimuoviLogo(key, setter)} style={{ backgroundColor: '#dc3545', color: '#fff' }}>Rimuovi</button>
              </div>
            </section>
          ))}

          <section style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
            <button onClick={applicaColori} style={{ backgroundColor: '#007bff', color: '#fff' }}>Applica Colori</button>
            <button onClick={salvaTutteLeImpostazioni} style={{ backgroundColor: '#28a745', color: '#fff' }}>💾 Salva Configurazione</button>
          </section>
        </div>

        <div style={{ flex: 1 }}>
          <section>
            <h3>Gestione Grafici Dashboard</h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
                <option value="bar">Grafico a barre</option>
                <option value="pie">Grafico a torta</option>
                <option value="line">Grafico a linee</option>
              </select>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <label>Colore:</label>
                <input type="color" value={colorGrafico} onChange={(e) => setColorGrafico(e.target.value)} />
              </div>
            </div>
          </section>

          <section style={{ marginTop: '20px' }}>
            <h4>Riepilogo Colori Categorie e Interventi</h4>
            <table border="1" style={{ borderCollapse: 'collapse', marginTop: '10px', width: '100%', maxWidth: '500px' }}>
              <thead>
                <tr>
                  <th style={{ padding: '8px' }}>Categoria / Tipo</th>
                  <th style={{ padding: '8px' }}>Colore</th>
                </tr>
              </thead>
              <tbody>
                {categorieSalvate.map(cat => (
                  <tr key={cat.id || cat.name}>
                    <td style={{ padding: '6px' }}>{cat.name}</td>
                    <td style={{ padding: '6px' }}>
                      <input
                        type="color"
                        value={categorieColori[cat.name] || '#888'}
                        onChange={(e) => aggiornaColoreCategoria(cat.name, e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
                <tr>
                  <td style={{ padding: '6px' }}>Interventi da completare</td>
                  <td style={{ padding: '6px' }}>
                    <input type="color" value={colorDaCompletare} onChange={(e) => setColorDaCompletare(e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '6px' }}>Interventi completati</td>
                  <td style={{ padding: '6px' }}>
                    <input type="color" value={colorCompletati} onChange={(e) => setColorCompletati(e.target.value)} />
                  </td>
                </tr>
                <tr>
                  <td style={{ padding: '6px' }}>Totale Interventi</td>
                  <td style={{ padding: '6px' }}>
                    <input type="color" value={colorGrafico} onChange={(e) => setColorGrafico(e.target.value)} />
                  </td>
                </tr>
              </tbody>
            </table>
          </section>

          <section style={{ marginTop: '30px' }}>
            <h3>Gestione Colori</h3>
            <table border="1">
              <thead>
                <tr><th>Sezione</th><th>Colore Sfondo</th><th>Colore Testo</th></tr>
              </thead>
              <tbody>
                {sezioniColori.map(([label, bgKey, txtKey]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td><input type="color" value={colori[bgKey]} onChange={(e) => aggiornaColore(bgKey, e.target.value)} /></td>
                    <td><input type="color" value={colori[txtKey]} onChange={(e) => aggiornaColore(txtKey, e.target.value)} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section>
            <h3>Backup automatico (giorni)</h3>
            <input type="number" value={backupGiorni} onChange={(e) => setBackupGiorni(Number(e.target.value))} min={0} max={30} />
          </section>

          <section>
            <h3>Backup Manuale</h3>
            <button onClick={salvaBackupSuDisco} style={{ backgroundColor: '#007bff', color: '#fff' }}>Esporta Backup</button>
            <div style={{ marginTop: '10px' }}>
              <label>Importa Backup: </label>
              <input type="file" accept=".json" onChange={handleImportBackup} />
            </div>
          </section>

          <section>
            <h3>Cartella per il salvataggio delle foto</h3>
            <button onClick={scegliCartellaFoto}>Scegli Cartella</button>
            {fotoDirectoryName && <p>📁 Cartella attuale: <strong>{fotoDirectoryName}</strong></p>}
          </section>
        </div>
      </div>
    </div>
  );
}

export default Impostazioni;



