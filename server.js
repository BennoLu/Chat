const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

app.use(express.json());

const db = new sqlite3.Database('./texte.db');

db.serialize(() => {
  db.run('CREATE TABLE IF NOT EXISTS beitraege (id INTEGER PRIMARY KEY AUTOINCREMENT, inhalt TEXT)');
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

app.listen(port, () => console.log(`Server läuft auf http://localhost:${port}`));
