const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Percorsi ai file
const utentiFile = path.join(__dirname, 'utenti.json');
const luoghiFile = path.join(__dirname, 'luoghi.json');

// Se i file non esistono, li crea
if (!fs.existsSync(utentiFile)) {
  fs.writeFileSync(utentiFile, '[]', 'utf8');
}
if (!fs.existsSync(luoghiFile)) {
  fs.writeFileSync(luoghiFile, '[]', 'utf8');
}

// 🔹 GET /utenti - restituisce tutti gli utenti
app.get('/utenti', (req, res) => {
  try {
    const data = fs.readFileSync(utentiFile, 'utf8');
    const utenti = JSON.parse(data || '[]');
    res.json(utenti);
  } catch (error) {
    console.error('Errore nella lettura di utenti.json:', error);
    res.status(500).json({ error: 'Errore nella lettura del file utenti' });
  }
});

// 🔹 POST /utenti - sovrascrive l'elenco utenti
app.post('/utenti', (req, res) => {
  const utenti = req.body;
  try {
    fs.writeFileSync(utentiFile, JSON.stringify(utenti, null, 2), 'utf8');
    res.json({ message: 'Utenti salvati correttamente' });
  } catch (error) {
    console.error('
