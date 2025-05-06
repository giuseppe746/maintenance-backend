import React, { useState, useEffect } from 'react';
import { FaUsers } from 'react-icons/fa';
import { API_URL } from '../config';

const ruoliPredefiniti = [
  "Amministratore",
  "Manutentore",
  "Supervisore",
  "Notificatore"
];

function GestioneUtenti() {
  const [users, setUsers] = useState([]);
  const [nome, setNome] = useState('');
  const [cognome, setCognome] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ruolo, setRuolo] = useState('');
  const [message, setMessage] = useState('');
  const [ruoliDisponibili, setRuoliDisponibili] = useState([]);

  useEffect(() => {
    fetch(`${API_URL}/utenti`)
      .then(res => res.json())
      .then(setUsers)
      .catch(() => setUsers([]));

    const aggiuntivi = JSON.parse(localStorage.getItem('ruoliAggiuntivi')) || [];
    const nomiAggiuntivi = aggiuntivi.map(r => r.nome);
    setRuoliDisponibili([...ruoliPredefiniti, ...nomiAggiuntivi]);
  }, []);

  const salvaUtentiBackend = (utentiAggiornati) => {
    fetch(`${API_URL}/utenti`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(utentiAggiornati)
    });
  };

  const handleAddUser = () => {
    if (users.find(u => u.username === username)) {
      setMessage(`Errore: l'username "${username}" è già in uso.`);
      return;
    }

    const newUser = { nome, cognome, username, password, email, telefono, ruolo };
    const updatedUsers = [...users, newUser];

    setUsers(updatedUsers);
    salvaUtentiBackend(updatedUsers);
    setMessage("Utente aggiunto con successo!");

    setNome('');
    setCognome('');
    setUsername('');
    setPassword('');
    setEmail('');
    setTelefono('');
    setRuolo('');
  };

  const handleDeleteUser = (index) => {
    const updatedUsers = users.filter((_, i) => i !== index);
    setUsers(updatedUsers);
    salvaUtentiBackend(updatedUsers);
    setMessage("Utente eliminato.");
  };

  return (
    <div>
      <h2><FaUsers /> Gestione Utenti</h2>
      <div style={{ width: '50%', margin: '20px auto' }}>
        <h3>Aggiungi nuovo utente</h3>

        {message && <p style={{ color: message.startsWith('Errore') ? 'red' : 'green' }}>{message}</p>}

        <form onSubmit={(e) => { e.preventDefault(); handleAddUser(); }}>
          <div><label>Nome:</label><input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} /></div>
          <div><label>Cognome:</label><input type="text" value={cognome} onChange={(e) => setCognome(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} /></div>
          <div><label>Username:</label><input type="text" value={username} onChange={(e) => setUsername(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} /></div>
          <div><label>Password:</label><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} /></div>
          <div><label>Email:</label><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} /></div>
          <div><label>Telefono:</label><input type="text" value={telefono} onChange={(e) => setTelefono(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }} /></div>
          <div>
            <label>Ruolo:</label>
            <select value={ruolo} onChange={(e) => setRuolo(e.target.value)} required style={{ width: '100%', padding: '10px', marginBottom: '10px' }}>
              <option value="">Seleziona un ruolo</option>
              {ruoliDisponibili.map((r, idx) => (
                <option key={idx} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <button type="submit" style={{ marginTop: '20px', padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            Salva Utente
          </button>
        </form>
      </div>

      <h3>Elenco Utenti Registrati</h3>
      <table style={{ width: '100%', marginTop: '20px', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Cognome</th>
            <th>Username</th>
            <th>Email</th>
            <th>Telefono</th>
            <th>Ruolo</th>
            <th>Azioni</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.nome}</td>
              <td>{user.cognome}</td>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.telefono}</td>
              <td>{user.ruolo}</td>
              <td>
                <button onClick={() => handleDeleteUser(index)} style={{ padding: '5px 10px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                  Elimina
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default GestioneUtenti;
