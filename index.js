const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;

// Initialize SQLite database
const db = new sqlite3.Database('./notes.db', (err) => {
  if (err) {
    console.error('Could not connect to SQLite database:', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run('CREATE TABLE IF NOT EXISTS notes (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT)', (err) => {
      if (err) {
        console.error('Error creating table:', err.message);
      }
    });
  }
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Get all notes
app.get('/api/notes', (req, res) => {
  db.all('SELECT * FROM notes', [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(rows);
    }
  });
});

// Save a new note
app.post('/api/notes', (req, res) => {
  const { content } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Note content is required' });
  }

  db.run('INSERT INTO notes (content) VALUES (?)', [content], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: this.lastID, content });
    }
  });
});

// Delete a note by ID
app.delete('/api/notes/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id)) {
    return res.status(400).json({ error: 'Invalid ID' });
  }

  db.run('DELETE FROM notes WHERE id = ?', [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (this.changes === 0) {
      res.status(404).json({ error: 'Note not found' });
    } else {
      res.json({ message: 'Note deleted successfully' });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
