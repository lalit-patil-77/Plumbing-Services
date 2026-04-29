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

// १. सर्व प्लंबर्स मिळवण्यासाठी
app.get('/api/plumbers', (req, res) => {
    db.query("SELECT * FROM plumbers", (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

// २. नवीन बुकिंग सेव्ह करण्यासाठी
app.post('/api/book', (req, res) => {
    const { custName, custMobile, custAddress, plumberName } = req.body;
    const sql = "INSERT INTO bookings (custName, custMobile, custAddress, plumberName) VALUES (?, ?, ?, ?)";
    
    db.query(sql, [custName, custMobile, custAddress, plumberName], (err, result) => {
        if (err) return res.status(500).send(err);
        // बुकिंग झाल्यावर प्लंबरचा स्टेटस 'Booked' करणे
        db.query("UPDATE plumbers SET status = 'Booked' WHERE name = ?", [plumberName]);
        res.send({ message: "Success", id: result.insertId });
    });
});

// ३. सर्व बुकिंग्स पाहण्यासाठी (Admin)
app.get('/api/admin/bookings', (req, res) => {
    db.query("SELECT * FROM bookings ORDER BY id DESC", (err, result) => {
        if (err) return res.status(500).send(err);
        res.send(result);
    });
});

// ४. प्लंबर स्टेटस अपडेट करण्यासाठी (Admin)
app.post('/api/admin/update-status', (req, res) => {
    const { name, status } = req.body;
    db.query("UPDATE plumbers SET status = ? WHERE name = ?", [status, name], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: "Updated" });
    });
});

app.listen(3000, () => console.log(`Server: http://localhost:3000`));