import React from "react";
import { Link } from "react-router-dom";
import {
  FaTachometerAlt,
  FaTools,
  FaUsers,
  FaCog,
  FaBell,
  FaPlus,
  FaFolderOpen,
  FaWrench,
  FaHistory,
  FaCogs,
  FaMapMarkerAlt,
  FaUserShield,
  FaImage
} from "react-icons/fa";

function Sidebar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const permessi = JSON.parse(localStorage.getItem("permessi")) || {};
  const ruolo = user?.username?.toLowerCase();
  const ruoloPermessi = permessi[ruolo] || {};

  return (
    <div style={{ width: "250px", backgroundColor: "#5D4037", color: "white", minHeight: "100vh", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>Gestione</h2>

      <nav>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li style={{ padding: "10px 0" }}>
            <Link to="/" style={{ textDecoration: "none", color: "white" }}>
              <FaTachometerAlt style={{ marginRight: "10px" }} /> Dashboard
            </Link>
          </li>
          <hr />
          <h3>Interventi</h3>

          {ruoloPermessi.inserimento && (
            <li style={{ padding: "10px 0" }}>
              <Link to="/inserisci-intervento" style={{ textDecoration: "none", color: "white" }}>
                <FaPlus style={{ marginRight: "10px" }} /> Inserisci Intervento
              </Link>
            </li>
          )}

          {ruoloPermessi.visualizzazione && (
            <>
              <li style={{ padding: "10px 0" }}>
                <Link to="/visualizza-interventi" style={{ textDecoration: "none", color: "white" }}>
                  <FaFolderOpen style={{ marginRight: "10px" }} /> Visualizza Interventi
                </Link>
              </li>
              <li style={{ padding: "10px 0" }}>
                <Link to="/collaudo-interventi" style={{ textDecoration: "none", color: "white" }}>
                  <FaWrench style={{ marginRight: "10px" }} /> Collaudo Interventi
                </Link>
              </li>
              <li style={{ padding: "10px 0" }}>
                <Link to="/elenco-interventi" style={{ textDecoration: "none", color: "white" }}>
                  <FaTools style={{ marginRight: "10px" }} /> Elenco Interventi
                </Link>
              </li>
              <li style={{ padding: "10px 0" }}>
                <Link to="/storico" style={{ textDecoration: "none", color: "white" }}>
                  <FaHistory style={{ marginRight: "10px" }} /> Storico
                </Link>
              </li>
              <li style={{ padding: "10px 0" }}>
                <Link to="/archivio-foto" style={{ textDecoration: "none", color: "white" }}>
                  <FaImage style={{ marginRight: "10px" }} /> Archivio Foto
                </Link>
              </li>
            </>
          )}

          <hr />
          <h3>Gestione Utenti</h3>
          <li style={{ padding: "10px 0" }}>
            <Link to="/gestione-utenti" style={{ textDecoration: "none", color: "white" }}>
              <FaUsers style={{ marginRight: "10px" }} /> Gestione Utenti
            </Link>
          </li>
          <li style={{ padding: "10px 0" }}>
            <Link to="/gestione-autorizzazioni" style={{ textDecoration: "none", color: "white" }}>
              <FaUserShield style={{ marginRight: "10px" }} /> Autorizzazioni e Accessi
            </Link>
          </li>
          <li style={{ padding: "10px 0" }}>
            <Link to="/gestione-ruoli" style={{ textDecoration: "none", color: "white" }}>
              <FaCog style={{ marginRight: "10px" }} /> Gestione Ruoli
            </Link>
          </li>

          <hr />
          <h3>Impostazioni</h3>
          <li style={{ padding: "10px 0" }}>
            <Link to="/impostazioni" style={{ textDecoration: "none", color: "white" }}>
              <FaCog style={{ marginRight: "10px" }} /> Impostazioni
            </Link>
          </li>
          <li style={{ padding: "10px 0" }}>
            <Link to="/notifiche" style={{ textDecoration: "none", color: "white" }}>
              <FaBell style={{ marginRight: "10px" }} /> Notifiche
            </Link>
          </li>
          <li style={{ padding: "10px 0" }}>
            <Link to="/gestione-categorie" style={{ textDecoration: "none", color: "white" }}>
              <FaCogs style={{ marginRight: "10px" }} /> Gestione Categorie
            </Link>
          </li>
          <li style={{ padding: "10px 0" }}>
            <Link to="/luoghi" style={{ textDecoration: "none", color: "white" }}>
              <FaMapMarkerAlt style={{ marginRight: "10px" }} /> Luoghi
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default Sidebar;
