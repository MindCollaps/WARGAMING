import express from 'express';
import {authenticateToken, authenticateTokenWeak, authorizeRole, authorizeRoleWeak} from '../middleware/auth.js';

const router = express.Router();

router.get('/api/welcome', authenticateToken, (req, res) => {
    const response = {
        message: `Willkommen, ${req.user.username}!`,
        posts: [
            { author: 'user1', content: 'Das ist ein Test-Post.' },
            { author: 'user2', content: 'Noch ein Dummy-Post.' }
        ],
        canChangeBackground: req.user.role === 'Admin'
    };

    res.json(response);
});

router.post('/api/change-background', authenticateToken, authorizeRole('Admin'), (req, res) => {
    const { backgroundUrl } = req.body;

    if (!backgroundUrl) {
        return res.status(400).json({ message: 'Kein Hintergrundbild angegeben' });
    }

    res.json({ message: 'Hintergrundbild geändert', backgroundUrl });
});

export default router;
