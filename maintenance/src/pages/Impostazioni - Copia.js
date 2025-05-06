// File Impostazioni.js completo e funzionante
import React, { useState, useEffect } from 'react';
import './Impostazioni.css';
import {
  salvaBackupSuDisco,
  importaBackupDaFile,
  verificaBackupAutomatico,
  salvaTutteLeImpostazioni
} from '../utils/storageUtils';
import { salvaDirectoryHandle, recuperaDirectoryHandle } from '../utils/fsUtils';

function Impostazioni() {
  const [logoIntestazione, setLogoIntestazione] = useState(localStorage.getItem('appLogo'));
  const [logoVisualizza, setLogoVisualizza] = useState(localStorage.getItem('logoVisualizza'));
  const [logoArchivio, setLogoArchivio] = useState(localStorage.getItem('logoArchivio'));
  const [logoCollaudo, setLogoCollaudo] = useState(localStorage.getItem('logoCollaudo'));
  const [logoElenco, setLogoElenco] = useState(localStorage.getItem('logoElenco'));
  const [logoStorico, setLogoStorico] = useState(localStorage.getItem('logoStorico'));
  const [chartType, setChartType] = useState(localStorage.getItem('chartType') || 'bar');
  const [colorGrafico, setColorGrafico] = useState(localStorage.getItem('colorGrafico') || '#007bff');
  const [colorCompletati, setColorCompletati] = useState(localStorage.getItem('colorCompletati') || '#28a745');
  const [colorDaCompletare, setColorDaCompletare] = useState(localStorage.getItem('colorDaCompletare') || '#ffc107');
  const [backupGiorni, setBackupGiorni] = useState(Number(localStorage.getItem('backupGiorni')) || 0);
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
  const [categorieColori, setCategorieColori] = useState(() => JSON.parse(localStorage.getItem('categorieColori')) || {});
  const categorieSalvate = JSON.parse(localStorage.getItem('categorie')) || [];

  useEffect(() => {
    verificaBackupAutomatico(backupGiorni);
    const nuoviColori = {};
    sezioniColori.forEach(([_, bgKey, txtKey]) => {
      nuoviColori[bgKey] = localStorage.getItem(bgKey) || '#ffffff';
      nuoviColori[txtKey] = localStorage.getItem(txtKey) || '#000000';
    });
    setColori(nuoviColori);

    const dir = recuperaDirectoryHandle();
    dir.then(handle => {
      if (handle && handle.name) setFotoDirectoryName(handle.name);
    });
  }, [backupGiorni]);

  useEffect(() => {
    localStorage.setItem('chartType', chartType);
    localStorage.setItem('colorGrafico', colorGrafico);
    localStorage.setItem('colorCompletati', colorCompletati);
    localStorage.setItem('colorDaCompletare', colorDaCompletare);
    localStorage.setItem('categorieColori', JSON.stringify(categorieColori));

    fetch('http://localhost:3001/impostazioni', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chartType, colorGrafico, colorCompletati, colorDaCompletare, categorieColori })
    }).catch(err => console.error('Errore salvataggio impostazioni nel backend:', err));
  }, [chartType, colorGrafico, colorCompletati, colorDaCompletare, categorieColori]);

  const aggiornaColore = (chiave, valore) => {
    setColori(prev => ({ ...prev, [chiave]: valore }));
  };

  const aggiornaColoreCategoria = (categoria, colore) => {
    setCategorieColori(prev => ({ ...prev, [categoria]: colore }));
  };

  const applicaColori = () => {
    Object.entries(colori).forEach(([k, v]) => localStorage.setItem(k, v));
    alert('Colori salvati con successo.');
  };

  const salvaLogo = (file, key, setPreview) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      localStorage.setItem(key, reader.result);
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



