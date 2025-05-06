import React, { useState } from 'react';

function RecuperaPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simula l'invio di un'email per il recupero della password.
    setMessage("Se l'indirizzo esiste, riceverai un'email per il recupero della password.");
    setEmail('');
  };

  return (
    <div>
      <h2>Recupera Password</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Inserisci la tua email"
            required
          />
        </div>
        <button type="submit">Invia Email di Recupero</button>
      </form>
    </div>
  );
}

export default RecuperaPassword;
