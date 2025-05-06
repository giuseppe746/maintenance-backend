import React, { useState, useEffect } from 'react';
import './Login.css';

function Login() {
  const [logoLogin, setLogoLogin] = useState(null);

  useEffect(() => {
    const logo = localStorage.getItem('logoLogin');
    if (logo) setLogoLogin(logo);
  }, []);

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Accedi</h2>
        <form>
          <div>
            <label>Username</label>
            <input type="text" required />
          </div>
          <div>
            <label>Password</label>
            <input type="password" required />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>

      {logoLogin && (
        <div style={{ textAlign: 'right' }}>
          <img src={logoLogin} alt="Logo Login" className="logo-preview" />
        </div>
      )}
    </div>
  );
}

export default Login;
