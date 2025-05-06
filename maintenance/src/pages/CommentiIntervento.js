import React, { useState } from 'react';

function CommentiIntervento({ interventionId }) {
  const [commenti, setCommenti] = useState([
    { id: 1, text: "Prima revisione intervento", date: "2023-03-10" },
  ]);
  const [nuovoCommento, setNuovoCommento] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nuovoCommento.trim() !== "") {
      const nuovoId = commenti.length > 0 ? commenti[commenti.length - 1].id + 1 : 1;
      const newComment = {
        id: nuovoId,
        text: nuovoCommento,
        date: new Date().toLocaleDateString(),
      };
      setCommenti([...commenti, newComment]);
      setNuovoCommento("");
    }
  };

  return (
    <div>
      <h3>Commenti sull'Intervento {interventionId}</h3>
      <ul>
        {commenti.map(comment => (
          <li key={comment.id}>
            <strong>{comment.date}:</strong> {comment.text}
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={nuovoCommento} 
          onChange={(e) => setNuovoCommento(e.target.value)} 
          placeholder="Aggiungi un commento..."
        />
        <button type="submit">Aggiungi</button>
      </form>
    </div>
  );
}

export default CommentiIntervento;
