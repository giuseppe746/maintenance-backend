// ArchivioFoto.js
import React, { useEffect, useState } from 'react';
import { API_URL } from '../config';

function ArchivioFoto({ interventiFiltrati = [] }) {
  const [immaginiSalvate, setImmaginiSalvate] = useState([]);

  const uploadToBackend = async () => {
    const formData = new FormData();
    let count = 0;

    for (const intv of interventiFiltrati) {
      const tutteFoto = [...(intv.fotoCompletamento || []), ...(intv.fotoAllegate || [])];

      for (const src of tutteFoto) {
        try {
          const res = await fetch(src);
          const blob = await res.blob();
          const file = new File([blob], `foto_${intv.id}_${count}.jpg`, { type: 'image/jpeg' });
          formData.append('foto', file);
          count++;
        } catch (e) {
          console.error('Errore fetch immagine:', e);
        }
      }
    }

    if (formData.has('foto')) {
      try {
        const resp = await fetch(`${API_URL}/upload-archivio`, {
          method: 'POST',
          body: formData,
        });

        const contentType = resp.headers.get('content-type');
        console.log('📥 Content-Type ricevuto:', contentType);

        if (!resp.ok) {
          const text = await resp.text();
          console.error('❌ Errore testo server:', text);
          throw new Error(`Errore server (${resp.status})`);
        }

        const data = await resp.json();
        console.log('✅ Immagini salvate in:', data.savedFiles);
        alert('✅ Immagini salvate nel server con successo!');
        fetchImmagini(); // aggiorna lista
      } catch (error) {
        console.error('Errore salvataggio:', error);
        alert('❌ Errore nel salvataggio delle immagini.');
      }
    } else {
      alert('⚠️ Nessuna immagine da salvare.');
    }
  };

  const fetchImmagini = async () => {
    try {
      const resp = await fetch(`${API_URL}/api/lista-immagini`);
      if (!resp.ok) throw new Error('Errore caricamento immagini');
      const immagini = await resp.json();
      setImmaginiSalvate(immagini);
    } catch (err) {
      console.error('Errore caricamento immagini:', err);
    }
  };

  useEffect(() => {
    fetchImmagini();
  }, []);

  return (
    <div>
      <h2>Archivio Foto</h2>
      <button
        onClick={uploadToBackend}
        style={{
          padding: '10px 20px',
          margin: '20px',
          backgroundColor: '#2196F3',
          color: '#fff',
          border: 'none',
          borderRadius: '5px'
        }}
      >
        📤 Salva tutte nel server
      </button>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        {immaginiSalvate.map((file, idx) => (
          <div key={idx}>
            <img
              src={`${API_URL}/archivio/${file}`}
              alt={file}
              style={{ width: '150px', height: 'auto', border: '1px solid #ccc' }}
            />
            <p style={{ textAlign: 'center', maxWidth: '150px', wordBreak: 'break-all' }}>{file}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ArchivioFoto;
