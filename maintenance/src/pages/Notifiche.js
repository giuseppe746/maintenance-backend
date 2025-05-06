import React, { useState, useEffect } from 'react';

function Notifiche() {
  const [notifiche, setNotifiche] = useState([]);

  useEffect(() => {
    // Dati dummy per le notifiche. In futuro, puoi sostituirli con una chiamata API.
    const dummyNotifications = [
      { id: 1, text: "Nuovo intervento inserito", date: "2023-03-15" },
      { id: 2, text: "Intervento aggiornato", date: "2023-03-16" },
      { id: 3, text: "Intervento cancellato", date: "2023-03-17" },
    ];
    setNotifiche(dummyNotifications);
  }, []);

  return (
    <div>
      <h2>Notifiche</h2>
      {notifiche.length > 0 ? (
        <ul>
          {notifiche.map((n) => (
            <li key={n.id}>
              <strong>{n.date}:</strong> {n.text}
            </li>
          ))}
        </ul>
      ) : (
        <p>Nessuna notifica</p>
      )}
    </div>
  );
}

export default Notifiche;
