const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL Connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'plumbing_db'
});

db.connect(err => {
    if (err) {
        console.error('Database Error: ' + err.message);
        return;
    }
    console.log('Connected to MySQL Database!');
});


app.get('/api/plumbers', (req, res) => {
    db.query("SELECT * FROM plumbers", (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});


app.post('/api/book', (req, res) => {
    const { custName, custMobile, custAddress, plumberName } = req.body;
    const sql = "INSERT INTO bookings (custName, custMobile, custAddress, plumberName) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [custName, custMobile, custAddress, plumberName], (err, result) => {
        if (err) return res.status(500).send(err);
        
        db.query("UPDATE plumbers SET status = 'Booked' WHERE name = ?", [plumberName]);
        res.send({ message: "Success", id: result.insertId });
    });
});


app.get('/api/admin/bookings', (req, res) => {
    db.query("SELECT * FROM bookings ORDER BY id DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});


app.post('/api/admin/update-status', (req, res) => {
    const { name, status } = req.body;
    db.query("UPDATE plumbers SET status = ? WHERE name = ?", [status, name], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Updated" });
    });
});

app.listen(3000, () => console.log(`Server: http://localhost:3000`));

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

