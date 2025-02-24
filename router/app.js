import express from 'express'
import admin from './admin_api.js';
import community from './community_api.js';
import { db } from '../database/database.js';
import jwt from 'jsonwebtoken';
import puppeteer from 'puppeteer';

const ACCESS_TOKEN_SECRET = "LAbyZljkfHH2fCOwcoUi8LKsGKCgcDax2b7ghYUVkATABsB4WFt4M8WjVQgjjoGP"

const router = express.Router();

router.use("/api/admin", admin)
router.use("/api/community", community)

router.get('/api/ping', authenticateToken,  async(req, res) => {
    res.json({
        status: '200',
        response: "succes"
    });
});

// Benutzerlogin
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    console.log('Body:', req.body);

    try {
        const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
        //const query = `SELECT * FROM users WHERE username=? AND password=?`;
        console.log('SQL-query:', query);
    
        db.all(query, (err, rows) => {
            if (err) {
                console.error('Database query error:', err.message);
                return res.status(500).json({
                    status: '500',
                    response: 'Internal server error.',
                    error: err.message
                });
            }

            if (rows.length > 0) {
                const user = rows[0];

                const token = jwt.sign(
                    { id: user.id, username: user.username, role: user.role },
                    ACCESS_TOKEN_SECRET,
                    { expiresIn: '1h' } 
                );

                return res.status(200).json({ 
                    token: token, 
                    username: user.username,
                    role: user.role,
                    response: 'Login erfolgreich!' });
            } else {
                return res.status(401).json({ response: 'Benutzer nicht gefunden oder falsches Passwort' });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ response: 'Internal server error' });
    }
});

function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).json({ response: 'Kein Token' });

    jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ response: 'Scheiß-Token' });
        req.user = user;
        next();
    });
}

function authorizeRole(role) {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next();
        } else {
            res.status(403).json({ response: "Heute nicht."})
        }
    };
}

router.get('/api/welcome', authenticateToken, (req, res) => {
    const response = {
        message: `Willkommen, ${req.user.username}!`,
        posts: [
            { author: 'user1', content: 'Das ist ein Test-Post.' },
            { author: 'user2', content: 'Noch ein Dummy-Post.' }
        ],
        canChangeBackground: req.user.role === 'admin'
    };

    res.json(response);
});

router.post('/api/change-background', authenticateToken, authorizeRole('admin'), (req, res) => {
    const { backgroundUrl } = req.body;

    if (!backgroundUrl) {
        return res.status(400).json({ message: 'Kein Hintergrundbild angegeben' });
    }

    res.json({ message: 'Hintergrundbild geändert', backgroundUrl });
});

process.argv.forEach(function (val, index, array) {
    let admin = false;
    if (val == "admin"){
        console.log("Running admin scheduler!!!");
        admin = true;
    }

    if (admin){
        setInterval(async () => {
            console.log("Admin is checking reports");
        
            const query = "SELECT * FROM 'posts' WHERE reported = 1";
            db.all(query, async (err, rows) => {
                if (err) {
                    console.error('Database query error:', err.message);
                    return res.status(500).json({
                        status: '500',
                        response: 'Internal server error.',
                        error: err.message
                    });
                }
                if (rows.length > 0) {
                    let query = "UPDATE 'posts' SET reported = 0, reported_reason = '' WHERE reported = 1";
                    db.run(query, (err) => {
                        if (err) {
                            console.error('Database query error:', err.message);
                            return res.status(500).json({
                                status: '500',
                                response: 'Internal server error.',
                                error: err.message
                            });
                        }
                    });
        
                    for (const r of rows) {
                        await visit(r.id);
                    }
                } else {
                    console.log("No new reports to check");
                }
            });
        }, 1000 * 40);
    }
  });

const AUTH = jwt.sign(
    { id: 0, username: "admin", role: "admin" },
    ACCESS_TOKEN_SECRET,
    { expiresIn: '1h' } 
);

async function visit(post) {
    try {
        console.log("Admin is checking report " + post);
        const url = new URL("http://127.0.0.1:5000");
        const url2 = new URL("http://127.0.0.1:500/community.html")

        const browser = await puppeteer.launch({
            args: [ '--no-sandbox' ],
            headless: 'old',
        });
        
        const page = await browser.newPage();
        await page.goto(url.toString());
        await page.evaluate((auth) => localStorage.setItem('jwt', auth), AUTH);
        await page.evaluate(() => localStorage.setItem('role', "admin"));
        await page.close();
    
        url2.searchParams.set('post', post);
        console.log(`Visiting ` + url2);
        const playerPage = await browser.newPage();
        setTimeout(() => browser.close(), 20 * 1000);
        await playerPage.goto(url2.toString());
    } catch (error) {
        console.error(error);
    }
}



export { authorizeRole };
export { authenticateToken };
export default router;