import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SelezionaCategoriaCollaudo() {
  const navigate = useNavigate();
  const [categorie, setCategorie] = useState([]);
  const [riepilogo, setRiepilogo] = useState({ collaudati: 0, daCollaudare: 0 });

  useEffect(() => {
    const salvate = JSON.parse(localStorage.getItem('categorie')) || [];
    const interventi = JSON.parse(localStorage.getItem("interventi")) || [];

    const conteggioPerCategoria = {};
    interventi.forEach(i => {
      if (i.completato && !i.colloaudabile && i.categoria) {
        conteggioPerCategoria[i.categoria] = (conteggioPerCategoria[i.categoria] || 0) + 1;
      }
    });

    const nomi = salvate.map(c => ({ nome: c.name, conteggio: conteggioPerCategoria[c.name] || 0 }));
    setCategorie(nomi);

    const collaudati = interventi.filter(i => i.colloaudabile).length;
    const daCollaudare = interventi.filter(i => i.completato && !i.colloaudabile).length;
    setRiepilogo({ collaudati, daCollaudare });
  }, []);

  return (
    <div style={{ padding: '30px' }}>
      <h2>Seleziona una Categoria per il Collaudo</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '30px' }}>
        {categorie.map(({ nome, conteggio }, index) => (
          <div key={index} style={{ textAlign: 'center' }}>
            <button
              onClick={() => navigate(`/collaudo-interventi/${nome}`)}
              style={{ padding: '15px 30px', fontSize: '1.1em', borderRadius: '8px', border: '1px solid #ccc', cursor: 'pointer' }}
            >
              {nome}
            </button>
            {conteggio > 0 && (
              <div style={{ marginTop: '8px', color: '#e67e22', fontWeight: 'bold' }}>
                {conteggio} da collaudare
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '40px', padding: '15px', backgroundColor: '#f1f1f1', borderRadius: '6px', display: 'flex', justifyContent: 'space-around' }}>
        <div style={{ color: '#e67e22', fontWeight: 'bold' }}>🕐 Da collaudare: {riepilogo.daCollaudare}</div>
        <div style={{ color: '#2ecc71', fontWeight: 'bold' }}>✅ Collaudati: {riepilogo.collaudati}</div>
      </div>
    </div>
  );
}

export default SelezionaCategoriaCollaudo;

