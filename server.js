const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 3000;
const dbPath = path.join(__dirname, 'database.sqlite');

app.use(express.json());
app.use(express.static(__dirname));

const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erreur de connexion à la base SQLite :', err.message);
    } else {
        console.log('Connexion SQLite OK');
        db.run(`
      CREATE TABLE IF NOT EXISTS recap (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        grade TEXT,
        nom TEXT,
        compagnie TEXT,
        batiment TEXT,
        message TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
    }
});

app.get('/api/recap', (req, res) => {
    db.get(`SELECT grade, nom, compagnie, batiment, message FROM recap ORDER BY id DESC LIMIT 1`, (err, row) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de la lecture des données.' });
        }

        if (!row) {
            return res.json({
                grade: '',
                nom: '',
                compagnie: '',
                batiment: '',
                message: ''
            });
        }

        res.json(row);
    });
});

app.post('/api/recap', (req, res) => {
    const { grade, nom, compagnie, batiment, message } = req.body || {};

    if (!grade || !nom || !compagnie || !batiment || !message) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    const query = `
    INSERT INTO recap (grade, nom, compagnie, batiment, message)
    VALUES (?, ?, ?, ?, ?)
  `;

    db.run(query, [grade, nom, compagnie, batiment, message], function (err) {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Erreur lors de l’enregistrement.' });
        }

        res.status(201).json({ id: this.lastID });
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/recap.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'recap.html'));
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
