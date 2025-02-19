import express from 'express'
import admin from './admin_api.js';
import forum from './forum_api.js';

const router = express.Router();

router.use("/api/admin", admin)
router.use("/api/forum", forum)

router.get('/api/ping', async(req, res) => {
    res.json({
        status: '200',
        response: "succes"
    });
});

export default router;