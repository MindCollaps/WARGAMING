import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import admin from './admin_api.js';

import jwt from 'jsonwebtoken';

import { authenticateToken, authorizeRole } from '../middleware/auth.js';
const router = express.Router();

router.use("/api/admin", admin)

router.get('/api/ping', authenticateToken, authorizeRole('Admin'),  async(req, res) => {
    res.json({
        status: '200',
        response: "succes"
    });
});

router.post('/api/login', (req, res) => {
    const { username, role } = req.body;
    const token = jwt.sign({ username, role }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
});

export default router;