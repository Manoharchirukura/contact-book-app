const express = require('express');
const cors = require('cors');
const db = require('./database.js');

const app = express();
const PORT = 5001;

app.use(cors());
app.use(express.json());

// GET /api/contacts - Fetch contacts with pagination
app.get('/api/contacts', (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const sqlContacts = 'SELECT * FROM contacts ORDER BY name LIMIT ? OFFSET ?';
    const sqlCount = 'SELECT COUNT(id) as totalCount FROM contacts';

    db.get(sqlCount, [], (err, countRow) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.all(sqlContacts, [limit, offset], (err, rows) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({
                contacts: rows,
                totalCount: countRow.totalCount
            });
        });
    });
});

// POST /api/contacts - Add a new contact
app.post('/api/contacts', (req, res) => {
    const { name, email, phone } = req.body;

    if (!name || !email || !phone) {
        return res.status(400).json({ error: 'All fields are required.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
    }
    if (!/^\d{10}$/.test(phone)) {
        return res.status(400).json({ error: 'Phone number must be 10 digits.' });
    }

    const sql = 'INSERT INTO contacts (name, email, phone) VALUES (?, ?, ?)';
    db.run(sql, [name, email, phone], function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                return res.status(409).json({ error: 'Email already exists.' });
            }
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: this.lastID, name, email, phone });
    });
});

// DELETE /api/contacts/:id - Delete a contact
app.delete('/api/contacts/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM contacts WHERE id = ?';

    db.run(sql, id, function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ error: 'Contact not found.' });
        }
        res.status(204).send();
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});