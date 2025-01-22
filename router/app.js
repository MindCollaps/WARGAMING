const express = require('express');
const router = express.Router();

var clickedUsers = 0;

router.get('/api/ping', async(req, res) => {
    res.json({
        status: '200',
        response: "succes"
    });
});

module.exports = router;