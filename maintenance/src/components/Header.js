import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from 'react-router-dom';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const [logo, setLogo] = useState(localStorage.getItem('appLogo')); // ✅ cambiato qui
  const [headerColor, setHeaderColor] = useState(localStorage.getItem('headerColor') || '#000');
  const [textColor, setTextColor] = useState(localStorage.getItem('headerTextColor') || '#fff');
  const [testoSidebar, setTestoSidebar] = useState(localStorage.getItem('testoSidebar') || '');
  const navigate = useNavigate();

  useEffect(() => {
    // Polling per aggiornare dinamicamente
    const interval = setInterval(() => {
      setLogo(localStorage.getItem('appLogo')); // ✅ leggiamo da appLogo
      setHeaderColor(localStorage.getItem('headerColor') || '#000');
      setTextColor(localStorage.getItem('headerTextColor') || '#fff');
      setTestoSidebar(localStorage.getItem('testoSidebar') || '');
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header
      className="header"
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        background: headerColor,
        color: textColor
      }}
    >
      <div className="logo" style={{ display: 'flex', alignItems: 'center' }}>
        {logo && <img src={logo} alt="Logo" style={{ width: '100px', marginRight: '10px' }} />}
        {testoSidebar && <span style={{ fontSize: '1.5em', fontWeight: 'bold' }}>{testoSidebar}</span>}
      </div>

      {user && (
        <div className="header-nav">
          <span style={{ marginRight: '10px' }}>Benvenuto, {user.username}</span>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: textColor,
              color: headerColor,
              padding: '8px 12px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      )}
    </header>
  );
}

export default Header;



