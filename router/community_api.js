import express from 'express';
import { db } from '../database/database.js';
import { authenticateTokenWeak } from './app.js';

const router = express.Router();

// Use express.json() middleware to parse JSON bodies
router.use(express.json());

router.get('/', authenticateTokenWeak, async (req, res) => {
    //Print api
    res.json({
        status: '200',
        response: "succes"
    });
});

router.get('/background', authenticateTokenWeak, async (req, res) => {  
    const query = "SELECT * FROM background LIMIT 1";

    db.get(query, [], (err, row) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).json({
                status: '500',
                response: 'Internal server error.',
                error: err.message
            });
        }

        if (row) {
            res.json({
                status: '200',
                response: row
            });
        } else {
            res.json({
                status: '404',
                response: null
            });
        }
    });
});

router.post('/posts/report', authenticateTokenWeak, async (req, res) => {

    const { id, reason } = req.body;
    let query = "UPDATE 'posts' SET reported = 1, reported_reason = ? WHERE id = ?";
    db.run(query, [reason, id], (err) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).json({
                status: '500',
                response: 'Internal server error.',
                error: err.message
            });
        }
    });

    res.json({
        status: '200',
        response: 'Post reported successfully'
    });

});

router.post('/posts/new', authenticateTokenWeak, async (req, res) => {
    console.log(req.body);
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            status: '400',
            response: 'Bad Request: title and content are required'
        });
    }

    let query = "INSERT INTO 'posts' (title, content, reported, reported_reason) VALUES (?, ?, ?, ?)";
    db.run(query, [title, content, 0, ""], (err) => {
        if (err) {
            console.error('Database query error:', err.message);
            return res.status(500).json({
                status: '500',
                response: 'Internal server error.',
                error: err.message
            });
        }
    });

    res.json({
        status: '200',
        response: 'Post created successfully'
    });
});

router.get('/posts', authenticateTokenWeak, async (req, res) => {
    const query = "SELECT * FROM 'posts'";

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
            let reversedRows = rows.reverse();
            res.json({
                status: '200',
                response: reversedRows
            });
        } else {
            res.json({
                status: '200',
                response: []
            });
        }
    });
});

export default router;