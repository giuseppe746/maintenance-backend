import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function AllegaFoto() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const savedFoto = localStorage.getItem(`foto-allegate-${id}`);
    if (savedFoto) {
      setPreview(savedFoto);
    }
  }, [id]);

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFoto(reader.result);
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSalvaFoto = () => {
    if (foto) {
      localStorage.setItem(`foto-allegate-${id}`, foto);

      const archivio = JSON.parse(localStorage.getItem('archivioFoto')) || [];
      archivio.push({ id, foto, data: new Date().toISOString() });
      localStorage.setItem('archivioFoto', JSON.stringify(archivio));

      alert('Foto salvata correttamente.');
    } else {
      alert('Seleziona una foto prima di salvare.');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Allega Foto Intervento</h2>

      <input type="file" accept="image/*" onChange={handleFotoChange} />

      {preview && (
        <div style={{ marginTop: '20px' }}>
          <img src={preview} alt="Anteprima" style={{ width: '300px', borderRadius: '8px' }} />
        </div>
      )}

      <div style={{ marginTop: '20px' }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#888',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            marginRight: '10px',
          }}
        >
          Torna Indietro
        </button>

        <button
          onClick={handleSalvaFoto}
          style={{
            padding: '8px 16px',
            backgroundColor: '#4CAF50',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Salva
        </button>
      </div>
    </div>
  );
}

export default AllegaFoto;
