// AuthContext.js
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      // AUTOLOGIN per test
      const defaultUser = { username: "admin" };
      setUser(defaultUser);
      localStorage.setItem("user", JSON.stringify(defaultUser));

      const permessiBase = {
        [defaultUser.username.toLowerCase()]: {
          inserimento: true,
          visualizzazione: true,
          modifica: true,
          eliminazione: true
        }
      };
      localStorage.setItem("permessi", JSON.stringify(permessiBase));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    const permessiBase = {
      [userData.username.toLowerCase()]: {
        inserimento: true,
        visualizzazione: true,
        modifica: true,
        eliminazione: true
      }
    };
    localStorage.setItem("permessi", JSON.stringify(permessiBase));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("permessi");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
