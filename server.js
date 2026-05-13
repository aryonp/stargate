const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const port = 3000;
const DB_PATH = path.join(__dirname, 'stargate.db');

app.use(express.json());
app.use(express.static('public'));

const db = new sqlite3.Database(DB_PATH);

app.get('/api/glyphs', (req, res) => {
    db.all("SELECT * FROM glyphs", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/addresses', (req, res) => {
    db.all("SELECT * FROM addresses", [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.post('/api/check-address', (req, res) => {
    const { address } = req.body;
    db.get("SELECT * FROM addresses WHERE address = ?", [address], (err, row) => {
        if (err) return res.status(500).json({ error: err.message });
        if (row) {
            res.json({ success: true, destination: row });
        } else {
            res.json({ success: false });
        }
    });
});

// CRUD for addresses
app.post('/api/addresses', (req, res) => {
    const { destination, description, episode, address, galaxy } = req.body;
    db.run("INSERT INTO addresses (destination, description, episode, address, galaxy) VALUES (?, ?, ?, ?, ?)",
        [destination, description, episode, address, galaxy],
        function(err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true, id: this.lastID });
        }
    );
});

app.put('/api/addresses/:id', (req, res) => {
    const { destination, description, episode, address, galaxy } = req.body;
    db.run("UPDATE addresses SET destination = ?, description = ?, episode = ?, address = ?, galaxy = ? WHERE id = ?",
        [destination, description, episode, address, galaxy, req.params.id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ success: true });
        }
    );
});

app.delete('/api/addresses/:id', (req, res) => {
    db.run("DELETE FROM addresses WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ success: true });
    });
});

app.listen(port, () => {
    console.log(`Stargate Dialer server running at http://localhost:${port}`);
});
