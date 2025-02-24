import { db } from '../database/database.js';
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { exec } from 'child_process'

const router = express.Router();

const tmpStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tmpDir = './tmp';
        fs.mkdirSync(tmpDir, { recursive: true });
        cb(null, tmpDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: tmpStorage });

router.get('/ping', async (req, res) => {
    res.json({ status: '200', response: "success" });
});

// /api/admin
router.get('/', async (req, res) => {
    res.json({
        status: '200',
        response: "succes"
    });
});

// /api/admin
router.post('/api/admin/upload/background', upload.single('image'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({
            status: '400',
            message: "No file uploaded"
        });
    }

    const backgroundDir = './public/assets/background';
    fs.mkdirSync(backgroundDir, { recursive: true });

    const parsedPath = path.parse(req.file.originalname);
    const newFilename = parsedPath.name + '.png';

    const outputPath = path.join(backgroundDir, newFilename);
    const command = `convert "${req.file.path}" "${outputPath}"`;

    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error("Fehler bei der Verarbeitung:", err);
            return res.status(500).json(
                {
                    status: '500',
                    message: "Fehler bei der Verarbeitung",
                    error: stderr.trim().split('\n'),
                }
            )
        }

        fs.access(outputPath, fs.constants.F_OK, (err) => {
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting tmp file:', unlinkErr);
            });

            if (err) {
                return res.status(500).json({
                    status: '500',
                    message: "Conversion failed - output file not found",
                    error: stdout.trim().split('\n'),
                });
            } else {
                res.json({
                    status: '200',
                    message: "File uploaded and converted",
                    path: "/assets/background/" + newFilename
                });
            }
        });
    });
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