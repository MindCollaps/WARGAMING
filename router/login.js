import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { db } from '../database/database.js';

dotenv.config();
const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;
    console.log('Body:', req.body);

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
                    process.env.JWT_SECRET,
                    { expiresIn: '1h' } 
                );

                return res.status(200).json({ 
                    token: token, 
                    username: user.username,
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

export default router;