import express from 'express';
import { db } from '../database/database.js';

const router = express.Router();

// Use express.json() middleware to parse JSON bodies
router.use(express.json());

router.get('/', async (req, res) => {
    //Print api
    res.json({
        status: '200',
        response: "succes"
    });
});

router.post('/posts/report', async (req, res) => {

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

router.post('/posts/new', async (req, res) => {
    console.log(req.body);
    const { title, content } = req.body;

    if (!title || !content) {
        return res.status(400).json({
            status: '400',
            response: 'Bad Request: title and content are required'
        });
    }

    let query = "INSERT INTO 'posts' (title, content, reported) VALUES (?, ?, ?)";
    db.run(query, [title, content, 0], (err) => {
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

router.get('/posts', async (req, res) => {
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