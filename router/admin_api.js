import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { url } from 'inspector';
import {exec} from 'child_process'

const router = express.Router();

// Setup temporary storage
const tmpStorage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tmpDir = './tmp';
        fs.mkdirSync(tmpDir, { recursive: true });
        cb(null, tmpDir);
    },
    filename: function (req, file, cb) {
        // Use the original filename
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
    //Print api
    res.json({
        status: '200',
        response: "succes"
    });
});

// /api/admin
router.post('/upload_background_image', upload.single('image'), async (req, res) => {
    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({
            status: '400',
            response: "No file uploaded"
        });
    }

    // create temp dir
    const backgroundDir = './public/assets/background';
    fs.mkdirSync(backgroundDir, { recursive: true });
    
    // change the extension to .png
    const parsedPath = path.parse(req.file.originalname);
    const newFilename = parsedPath.name + '.png';

    // set the output dir to /assets/background
    const outputPath = path.join(backgroundDir, newFilename);
    
    const command = `convert ${req.file.path} "${outputPath}"`;
    
    exec(command, (err, stdout, stderr) => {
        if (err) {
            console.error("Fehler bei der Verarbeitung:", err);
            return res.status(500).send("Fehler bei der Verarbeitung");
        }
    
        console.log("stdout:", stdout);
        // console.log("stderr:", stderr);

        // Check if converted file exists
        fs.access(outputPath, fs.constants.F_OK, (err) => {
            // Clean up tmp file
            fs.unlink(req.file.path, (unlinkErr) => {
                if (unlinkErr) console.error('Error deleting tmp file:', unlinkErr);
            });

            if (err) {
                return res.status(500).json({
                    status: '500',
                    response: "Conversion failed - output file not found",
                    error: stdout
                });
            } else {
                // Respond with success and the file pathof the uploaded image
                res.json({
                    status: '200',
                    response: "success",
                    msg: "File uploaded and converted",
                    path: "/assets/background/" + newFilename
                });
            }
        });
    });
});

export default router;