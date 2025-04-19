const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Connect to the SQLite DB
const dbPath = path.join(dataDir, 'mydatabase.db');
const db = new sqlite3.Database(dbPath);

// Example API: Get all users
app.get('/users', (req, res) => {
  db.all('SELECT * FROM users', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

// Add this endpoint to check database status
app.get('/debug/db-status', (req, res) => {
  db.get("SELECT name FROM sqlite_master WHERE type='table'", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ 
        error: err.message,
        dbPath: dbPath,
        exists: fs.existsSync(dbPath),
        directory: fs.existsSync(dataDir)
      });
    }
    res.json({ 
      tables: rows,
      dbPath: dbPath,
      exists: fs.existsSync(dbPath),
      directory: fs.existsSync(dataDir)
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
