import dotenv from 'dotenv';
dotenv.config();
import express from 'express'
import admin from './admin_api.js';

import jwt from 'jsonwebtoken';
const router = express.Router();

router.use("/api/admin", admin)

router.get('/api/ping',  async(req, res) => {
    res.json({
        status: '200',
        response: "succes"
    });
});



export default router;