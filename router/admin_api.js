import express from 'express';
import multer from 'multer';
import fs from 'fs';

const router = express.Router();


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dir = './public/assets/background';
        // Create the directory if it doesn't exist
        fs.mkdirSync(dir, { recursive: true });
        cb(null, dir);
    },
    filename: function (req, file, cb) {
        // Set the filename to "background" with the original file extension
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

// /api/admin
router.get('/ping', async (req, res) => {
    res.json({
        status: '200',
        response: "succes"
    });
});

router.get('/', async (req, res) => {
    //Print api
    res.json({
        status: '200',
        response: "succes"
    });
});

router.post('/upload_background_image', upload.single('image'), async (req, res) => {
    // Check if a file was uploaded
    if (!req.file) {
        return res.status(400).json({
            status: '400',
            response: "No file uploaded"
        });
    }

    // Respond with success and the filename of the uploaded image
    res.json({
        status: '200',
        response: "success",
        filename: req.file.filename
    });
});

export default router;