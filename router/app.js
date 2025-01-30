import express from 'express'
import admin from './admin_api.js';
import { db } from '../database/database.js';

const router = express.Router();

router.use("/api/admin", admin)

router.get('/api/ping', async(req, res) => {
    res.json({
        status: '200',
        response: "succes"
    });
});

/* 
router.post('/register', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({
            status: '400',
            response: 'Username and password are required.'
        });
    }


    const query = `INSERT INTO users (username, password) VALUES (?, ?)`;
    db.run(query, [username, password], (err) => {
        if (err) {
            if (err.code === 'SQLITE_CONSTRAINT') {
                return res.status(400).json({
                    status: '400',
                    response: 'Username already exists.'
                });
            }
            return res.status(500).json({
                status: '500',
                response: 'Database error.',
                error: err.message
            });
        }

        res.status(201).json({
            status: '201',
            response: 'User registered successfully.'
        });
    });
});
*/

// Benutzerlogin
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Body:', req.body);

    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    //const query = `SELECT * FROM users WHERE username=? AND password=?`;
    console.log('SQL-query:', query);

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).json({
                status: '500',
                response: 'Internal server error.',
                error: err.message
            });
        }
        if (rows.length > 0) {
            return res.json({ 
                status: 'success', 
                response: 'Login successful! Hello ' + rows[0].username 
            });
        } else {
            return res.status(401).json({ 
                status: 'error', 
                response: 'Invalid login credentials' 
            });
        }
    });
});

export default router;