import React, { useState } from "react";

function Registrazione() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [telefono, setTelefono] = useState(""); // Nuovo stato per il numero di telefono

  const handleSubmit = (e) => {
    e.preventDefault();
    // Aggiungi qui la logica per inviare i dati al backend o memorizzarli
    console.log("Utente registrato:", { username, email, password, telefono });
  };

  return (
    <div style={{ padding: "20px", display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
      <div style={{ width: "50%" }}>
        <h2>Registrazione Utente</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{ padding: "10px", width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ padding: "10px", width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ padding: "10px", width: "100%" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="telefono">Numero di Telefono:</label>
            <input
              type="tel"
              id="telefono"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              required
              pattern="^[0-9]{10}$" // Pattern per un numero di telefono di 10 cifre
              placeholder="Es. 1234567890"
              style={{ padding: "10px", width: "100%" }}
            />
          </div>
          <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#5D4037", color: "white", width: "100%" }}>
            Registrati
          </button>
        </form>
      </div>
    </div>
  );
}

export default Registrazione;

