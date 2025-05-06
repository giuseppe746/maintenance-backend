import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function DettaglioAutorizzazioni() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [utente, setUtente] = useState(null);
  const [autorizzazioni, setAutorizzazioni] = useState({ lettura: false, modifica: false, elimina: false });

  useEffect(() => {
    const utenti = JSON.parse(localStorage.getItem('utenti')) || [];
    const trovato = utenti.find(u => u.nome === username);
    if (trovato) {
      setUtente(trovato);
      setAutorizzazioni(trovato.autorizzazioni);
    }
  }, [username]);

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setAutorizzazioni(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSave = () => {
    const utenti = JSON.parse(localStorage.getItem('utenti')) || [];
    const updated = utenti.map(u => {
      if (u.nome === username) {
        return { ...u, autorizzazioni };
      }
      return u;
    });
    localStorage.setItem('utenti', JSON.stringify(updated));
    alert('Autorizzazioni aggiornate!');
    navigate('/gestione-utenti');
  };

  if (!utente) return <p>Caricamento utente...</p>;

  return (
    <div style={{ padding: '20px' }}>
      <h2>Autorizzazioni per: {utente.nome}</h2>
      <p><strong>Ruolo:</strong> {utente.ruolo}</p>
      <p><strong>Categoria:</strong> {utente.categoria}</p>

      <div>
        <label>
          <input type="checkbox" name="lettura" checked={autorizzazioni.lettura} onChange={handleCheckboxChange} /> Sola Lettura
        </label><br />
        <label>
          <input type="checkbox" name="modifica" checked={autorizzazioni.modifica} onChange={handleCheckboxChange} /> Modifica
        </label><br />
        <label>
          <input type="checkbox" name="elimina" checked={autorizzazioni.elimina} onChange={handleCheckboxChange} /> Elimina
        </label>
      </div>

      <button onClick={handleSave} style={{ marginTop: '15px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px' }}>
        Salva
      </button>
    </div>
  );
}

export default DettaglioAutorizzazioni;
