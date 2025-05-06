import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from "../context/AuthContext";



function Profilo() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <p>Non sei autenticato. Accedi per visualizzare il profilo.</p>;
  }

  return (
    <div>
      <h2>Profilo Utente</h2>
      <p><strong>Nome Utente:</strong> {user.username}</p>
      {/* Aggiungi qui altri dettagli del profilo se necessario */}
      <Link to="/modifica-profilo">
        <button>Modifica Profilo</button>
      </Link>
    </div>
  );
}

export default Profilo;
