const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname));

// MySQL Connection
const db = mysql.createConnection({
    host: 'YOUR_DB_HOST',
    user: 'YOUR_DB_USER',
    password: 'YOUR_DB_PASSWORD',
    database: 'YOUR_DB_NAME'
});

db.connect(err => {
    if (err) {
        console.error(err);
        return;
    }
    console.log('DB Connected');
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/plumbers', (req, res) => {
    db.query('SELECT * FROM plumbers', (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

app.post('/api/book', (req, res) => {
    const { custName, custMobile, custAddress, plumberName } = req.body;

    const sql = `INSERT INTO bookings 
    (custName, custMobile, custAddress, plumberName) 
    VALUES (?, ?, ?, ?)`;

    db.query(sql, [custName, custMobile, custAddress, plumberName], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Success' });
    });
});

module.exports = app;