import express from 'express'
import admin from './admin_api.js';
import login from './login.js';
import { authenticateToken  } from '../middleware/auth.js';

const router = express.Router();

router.use("/api/admin", admin)

router.use("/", login)

router.get('/api/ping', authenticateToken,  async(req, res) => {
    res.json({
        status: '200',
        response: "succes"
    });
});

export default router;