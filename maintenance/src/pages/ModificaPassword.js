import React, { useState, useContext } from 'react';
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

function ModificaPassword() {
  const { user } = useContext(AuthContext);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Controlla se la nuova password e la conferma coincidono
    if (newPassword !== confirmPassword) {
      alert("La nuova password e la conferma non coincidono!");
      return;
    }
    // Simula la verifica della vecchia password (in questo esempio, usiamo "admin" come password dummy)
    if (oldPassword !== "admin") {
      alert("La vecchia password non è corretta.");
      return;
    }
    // Simula l'aggiornamento della password (in una versione reale invieresti una richiesta al backend)
    alert("Password aggiornata con successo!");
    // Reindirizza alla pagina del profilo dopo l'aggiornamento
    navigate('/profilo');
  };

  return (
    <div>
      <h2>Modifica Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Vecchia Password:</label>
          <input 
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Nuova Password:</label>
          <input 
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Conferma Nuova Password:</label>
          <input 
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Aggiorna Password</button>
      </form>
    </div>
  );
}

export default ModificaPassword;
