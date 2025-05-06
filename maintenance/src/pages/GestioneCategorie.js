import React, { useState, useEffect } from 'react';

function GestioneCategorie() {
  const [categorie, setCategorie] = useState([]);
  const [nuovaCategoria, setNuovaCategoria] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Carica categorie da localStorage
  useEffect(() => {
    const salvate = JSON.parse(localStorage.getItem('categorie')) || [];
    setCategorie(salvate);
  }, []);

  // Salva nel localStorage
  const salvaCategorie = (nuove) => {
    setCategorie(nuove);
    localStorage.setItem('categorie', JSON.stringify(nuove));
  };

  const handleAggiungi = () => {
    const nome = nuovaCategoria.trim();
    if (nome === '') return;

    const esiste = categorie.some(cat => cat?.name?.toLowerCase() === nome.toLowerCase());
    if (esiste) {
      alert('Categoria già esistente');
      return;
    }

    const nuova = {
      id: Date.now(),
      name: nome
    };

    const nuoveCategorie = [...categorie, nuova];
    salvaCategorie(nuoveCategorie);
    setNuovaCategoria('');
  };

  const handleEdit = (id, name) => {
    setEditingId(id);
    setEditValue(name);
  };

  const handleSalva = (id) => {
    if (editValue.trim() === '') return;
    const nuove = categorie.map(cat =>
      cat.id === id ? { ...cat, name: editValue } : cat
    );
    salvaCategorie(nuove);
    setEditingId(null);
    setEditValue('');
  };

  const handleElimina = (id) => {
    if (window.confirm("Sei sicuro di voler eliminare questa categoria?")) {
      const nuove = categorie.filter(cat => cat.id !== id);
      salvaCategorie(nuove);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Gestione Categorie</h2>
      <p>Visualizza, aggiungi, modifica ed elimina le categorie degli interventi.</p>

      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          value={nuovaCategoria}
          onChange={(e) => setNuovaCategoria(e.target.value)}
          placeholder="Nome nuova categoria"
          style={{ padding: '5px', marginRight: '10px' }}
        />
        <button onClick={handleAggiungi}>Aggiungi</button>
      </div>

      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome Categoria</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {categorie.length === 0 ? (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>Nessuna categoria disponibile</td>
            </tr>
          ) : (
            categorie.map(cat => (
              <tr key={cat.id}>
                <td>{cat.id}</td>
                <td>
                  {editingId === cat.id ? (
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                    />
                  ) : (
                    cat.name
                  )}
                </td>
                <td>
                  {editingId === cat.id ? (
                    <button onClick={() => handleSalva(cat.id)}>Salva</button>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(cat.id, cat.name)}>Modifica</button>
                      <button onClick={() => handleElimina(cat.id)} style={{ color: 'red', marginLeft: '10px' }}>
                        Elimina
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default GestioneCategorie;
