const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const session = require('express-session');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const db = new sqlite3.Database('./users.db');

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({ secret: 'mysite-secret', resave: false, saveUninitialized: true }));

// Create users table
db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    password TEXT,
    isAdmin INTEGER DEFAULT 0
)`);

// Register
app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    db.run("INSERT INTO users(email, password) VALUES (?, ?)", [email, hash], function(err){
        if(err) return res.send("Error: "+err.message);
        res.send("Registered! You can login now.");
    });
});

// Login
app.post('/login', (req,res)=>{
    const { email, password } = req.body;
    db.get("SELECT * FROM users WHERE email=?", [email], async (err, row)=>{
        if(!row) return res.send("Invalid email or password");
        const match = await bcrypt.compare(password, row.password);
        if(match){
            req.session.user = { id: row.id, email: row.email, isAdmin: row.isAdmin };
            res.send("Logged in successfully!");
        } else {
            res.send("Invalid email or password");
        }
    });
});

// Check session
app.get('/session', (req,res)=>{
    if(req.session.user){
        res.json(req.session.user);
    } else {
        res.json({ loggedIn: false });
    }
});

// Logout
app.get('/logout', (req,res)=>{
    req.session.destroy();
    res.send("Logged out");
});

// Start server
app.listen(3000, ()=>console.log('Server running on http://localhost:3000'));