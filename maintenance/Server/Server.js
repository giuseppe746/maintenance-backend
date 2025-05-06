const express = require('express');
const multer = require('multer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// Percorso immagini archiviate
const uploadDir = path.join(__dirname, 'foto-archivio');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
  console.log('📁 Cartella "foto-archivio" creata');
}

// Percorso dati utenti (assoluto per evitare problemi)
const utentiFile = 'F:/Progetto Definitivo/maintenance/Server/utenti.json';
if (!fs.existsSync(utentiFile)) {
  fs.writeFileSync(utentiFile, '[]', 'utf8');
  console.log('✅ File utenti.json creato.');
}

// Espone immagini archiviate
app.use('/foto-archivio', express.static(uploadDir));
app.use('/archivio', express.static(uploadDir));

// Upload immagini
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const nome = `${Date.now()}-${Math.round(Math.random() * 1E9)}${ext}`;
    cb(null, nome);
  }
});
const upload = multer({ storage });

app.post('/upload', upload.single('foto'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Nessun file ricevuto' });
  const url = `http://localhost:${PORT}/foto-archivio/${req.file.filename}`;
  res.json({ file: req.file.filename, url });
});

// Lista immagini archiviate
app.get('/api/lista-immagini', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.status(500).json({ error: 'Errore lettura archivio' });
    const immagini = files.filter(f => /\.(jpg|jpeg|png|gif)$/i.test(f));
    res.json(immagini);
  });
});

// 🔹 API GESTIONE UTENTI
app.get('/utenti', (req, res) => {
  console.log('📥 Richiesta GET /utenti');
  try {
    const data = fs.readFileSync(utentiFile, 'utf8');
    const utenti = JSON.parse(data || '[]');
    res.json(utenti);
  } catch (err) {
    console.error('❌ Errore lettura utenti:', err);
    res.status(500).json({ error: 'Errore lettura utenti' });
  }
});

app.post('/utenti', (req, res) => {
  const utenti = req.body;
  console.log('📤 Ricevuti utenti da salvare:', utenti);
  console.log('📁 Scrittura in:', utentiFile);

  try {
    fs.writeFileSync(utentiFile, JSON.stringify(utenti, null, 2), 'utf8');
    console.log('✅ Scrittura completata con successo!');
    res.json({ message: 'Utenti salvati' });
  } catch (err) {
    console.error('❌ Errore durante la scrittura:', err);
    res.status(500).json({ error: 'Errore salvataggio utenti' });
  }
});

// 🔧 Endpoint di test scrittura diretta
app.get('/test-scrittura', (req, res) => {
  const utentiFinti = [
    {
      nome: "Mario",
      cognome: "Test",
      username: "prova",
      password: "123",
      email: "test@example.com",
      telefono: "1111111111",
      ruolo: "Amministratore"
    }
  ];

  try {
    fs.writeFileSync(utentiFile, JSON.stringify(utentiFinti, null, 2), 'utf8');
    console.log("✅ Scrittura diretta funzionante!");
    res.json({ esito: "ok", utenti: utentiFinti });
  } catch (err) {
    console.error("❌ Fallimento scrittura:", err);
    res.status(500).json({ esito: "errore", dettagli: err.message });
  }
});

// Avvio server
app.listen(PORT, () => {
  console.log(`✅ Server avviato su http://localhost:${PORT}`);
});
