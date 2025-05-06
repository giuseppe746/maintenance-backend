import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ScattaFoto = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [foto, setFoto] = useState([]);

  useEffect(() => {
    const interventi = JSON.parse(localStorage.getItem('interventi')) || [];
    const trovato = interventi.find(i => i.id === id);
    if (trovato?.fotoCompletamento) {
      setFoto(trovato.fotoCompletamento);
    }
  }, [id]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('foto', file);

    try {
      const res = await axios.post('http://localhost:4000/upload', formData);
      const nuovaFoto = res.data.url;
      const nuove = [...foto, nuovaFoto];
      setFoto(nuove);

      const interventi = JSON.parse(localStorage.getItem('interventi')) || [];
      const aggiornati = interventi.map(i => {
        if (i.id === id) {
          return { ...i, fotoCompletamento: nuove };
        }
        return i;
      });
      localStorage.setItem('interventi', JSON.stringify(aggiornati));
    } catch (error) {
      console.error("Errore durante l'upload:", error);
    }
  };

  const handleRemove = (index) => {
    const nuove = foto.filter((_, i) => i !== index);
    setFoto(nuove);
    const interventi = JSON.parse(localStorage.getItem('interventi')) || [];
    const aggiornati = interventi.map(i => {
      if (i.id === id) {
        return { ...i, fotoCompletamento: nuove };
      }
      return i;
    });
    localStorage.setItem('interventi', JSON.stringify(aggiornati));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Foto scattate - Intervento #{id}</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {foto.length === 0 ? (
        <p>Nessuna foto disponibile.</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          {foto.map((src, index) => (
            <div key={index} style={{ position: 'relative' }}>
              <img src={src} alt={`foto-${index}`} style={{ width: '150px', borderRadius: '8px' }} />
              <button
                onClick={() => handleRemove(index)}
                style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'red', color: 'white', border: 'none', borderRadius: '50%', width: '25px', height: '25px', cursor: 'pointer' }}
              >
                ❌
              </button>
            </div>
          ))}
        </div>
      )}

      <button onClick={() => navigate(-1)} style={{ marginTop: '20px' }}>⬅ Torna indietro</button>
    </div>
  );
};

export default ScattaFoto;
