import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {exec} from 'child_process'

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

// /api/admin
router.get('/ping', async (req, res) => {
    res.json({
        status: '200',
        response: "succes"
    });
});

// /api/admin
router.get('/', async (req, res) => {
    res.json({
        status: '200',
        response: "succes"
    });
});

// /api/admin
router.post('/upload_background_image', upload.single('image'), async (req, res) => {
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

export default router;