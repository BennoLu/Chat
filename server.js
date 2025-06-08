const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname)));

const db = new sqlite3.Database('./texte.db');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS beitraege (id INTEGER PRIMARY KEY AUTOINCREMENT, inhalt TEXT)');
  db.run(`CREATE TABLE IF NOT EXISTS editorinhalte (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text1 TEXT,
    text2 TEXT,
    text3 TEXT
  )`);
});

app.post('/eintrag', (req, res) => {
  const text = req.body.text;
  db.run('INSERT INTO beitraege (inhalt) VALUES (?)', [text], function (err) {
    if (err) {
      return res.status(500).send('Fehler beim Speichern');
    }
    res.json({ id: this.lastID });
  });
});

app.get('/beitraege', (req, res) => {
  db.all('SELECT * FROM beitraege', (err, rows) => {
    if (err) {
      return res.status(500).send('Fehler beim Abrufen');
    }
    res.json(rows);
  });
});

app.post('/editorinhalte', (req, res) => {
  const { text1, text2, text3 } = req.body;
  db.run(
    'INSERT INTO editorinhalte (text1, text2, text3) VALUES (?, ?, ?)',
    [text1, text2, text3],
    function (err) {
      if (err) {
        return res.status(500).send('Fehler beim Speichern');
      }
      res.json({ id: this.lastID });
    }
  );
});

app.get('/editorinhalte', (req, res) => {
  db.all('SELECT * FROM editorinhalte', (err, rows) => {
    if (err) {
      return res.status(500).send('Fehler beim Abrufen');
    }
    res.json(rows);
  });
});

app.listen(port, () => console.log(`Server läuft auf http://localhost:${port}`));
