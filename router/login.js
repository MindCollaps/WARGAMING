import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import db from '../database/database.js';

dotenv.config();
const router = express.Router();

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
        if (err) {
            return res.status(500).json({ message: "Database error" });
        }
        if (!user || user.password !== password) {
            return res.status(403).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    });
});

export default router;
