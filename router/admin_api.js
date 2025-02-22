import { db } from '../database/database.js';
import { checkRole } from './app.js';
import { authenticateToken } from './app.js';
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';


const router = express.Router();

fs.mkdirSync("./public/assets/background", { recursive: true });
fs.mkdirSync("./public/uploads", { recursive: true });

const backgroundStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/assets/background');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const uploadBackground = multer({ storage: backgroundStorage });


const uploadStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads'); 
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: uploadStorage });


router.get('/ping', async (req, res) => {
    res.json({ status: '200', response: "success" });
});


router.get('/', async (req, res) => {
    res.json({ status: '200', response: "success" });
});


router.post('/upload_background_image', uploadBackground.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: '400', response: "No file uploaded" });
    }
    res.json({ status: '200', response: "success", filename: req.file.filename });
});

router.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ status: '400', response: "No file uploaded" });
    }

    db.run("INSERT INTO files (filename, filepath) VALUES (?, ?)", [req.file.filename, req.file.filename], function (err) {
        if (err) {
            return res.status(500).json({ status: '500', response: "Database error", error: err.message });
        }

        res.json({
            status: '200',
            response: 'Datei wurde gespeichert',
            filename: req.file.filename,
            url: `/uploads/${req.file.filename}`,
            fileId: this.lastID
        });
    });
});

router.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));

router.get('/file/:id', (req, res) => {
    const fileId = req.params.id;
    db.get("SELECT * FROM files WHERE id = ?", [fileId], (err, file) => {
        if (err) {
            return res.status(500).json({ status: '500', response: "Database error", error: err.message });
        }
        if (!file) {
            return res.status(404).json({ status: '404', response: "File not found" });
        }
        res.json(file);
    });
});

router.get('/search', (req, res) => {
    const searchTerm = req.query.q;

    const query = `SELECT * FROM files WHERE filename LIKE '%${searchTerm}%'`; 

    db.all(query, (err, rows) => {
        if (err) {
            let errorMsg = `Fehler: No file found at /uploads/${searchTerm}. SQL Error: ${err.message}`;
            console.error(errorMsg);
            return res.status(500).json({ status: '500', response: errorMsg });
        }

        if (rows.length === 0) {
            let notFoundMsg = `Kein Treffer für '${searchTerm}' in /uploads/`;
            console.warn(notFoundMsg);
            return res.status(404).json({ status: '404', response: notFoundMsg });
        }

        res.json(rows);
    });
});


export default router;