const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// Railway DB connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Database connected successfully');
});

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Fetch plumbers
app.get('/api/plumbers', (req, res) => {
  db.query('SELECT * FROM plumbers', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Create booking
app.post('/api/book', (req, res) => {
  const { custName, custMobile, custAddress, plumberName } = req.body;

  const sql = `
    INSERT INTO bookings
    (custName, custMobile, custAddress, plumberName)
    VALUES (?, ?, ?, ?)
  `;

  db.query(sql, [custName, custMobile, custAddress, plumberName], (err, result) => {
    if (err) return res.status(500).send(err);

    res.json({
      message: 'Success',
      id: result.insertId
    });
  });
});

// Admin bookings
app.get('/api/admin/bookings', (req, res) => {
  db.query('SELECT * FROM bookings ORDER BY id DESC', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// Update plumber status
app.post('/api/admin/update-status', (req, res) => {
  const { name, status } = req.body;

  db.query(
    'UPDATE plumbers SET status = ? WHERE name = ?',
    [status, name],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Updated' });
    }
  );
});

module.exports = app;