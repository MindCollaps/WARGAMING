import express from 'express'
import admin from './admin_api.js';
import { db } from '../database/database.js';
import jwt from 'jsonwebtoken';
//import dotenv from 'dotenv';

const router = express.Router();

router.use("/api/admin", admin)

router.get('/api/ping', async(req, res) => {
    res.json({
        status: '200',
        response: "succes"
    });
});

// Benutzerlogin
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Body:', req.body);

    const ACCESS_TOKEN_SECRET = "supersicherlol"

    try {
        const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        //const query = `SELECT * FROM users WHERE username=? AND password=?`;
        console.log('SQL-query:', query);
    
        db.all(query, (err, rows) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({
                    status: '500',
                    response: 'Internal server error.',
                    error: err.message
                });
            }

            if (rows.length > 0) {
                const user = rows[0];

                const token = jwt.sign(
                    { id: user.id, username: user.username, role: user.role },
                    ACCESS_TOKEN_SECRET,
                    { expiresIn: '1h' } 
                );

                return res.status(200).json({ 
                    token: token, 
                    role: user.role,
                    response: 'Login erfolgreich!' });
            } else {
                return res.status(401).json({ response: 'Benutzer nicht gefunden oder falsches Passwort' });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ response: 'Internal server error' });
    }
});

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ response: 'Kein Token' });

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ response: 'Scheiß-Token' });
        req.user = user;
        next();
    });
}

function checkRole(role) {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).json({ response: "Heute nicht."})
        }
    };
}

export { checkRole };
export { authenticateToken };
export default router;