import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./db/database.db', sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE, (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        console.log("Database connected.");
    }
});

db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT,
        role TEXT
    )`, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        }
    });

    db.run("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (1, 'admin', 'secret', 'admin')");
    db.run("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (3, 'lara', 'passwort123', 'user')");
    db.run("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (3, 'max', 'passwort123', 'user')");
    db.run("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (4, 'lisa', '1234abcd', 'user')");
    db.run("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (5, 'paul', 'meinPasswort1', 'user')");
    db.run("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (6, 'sara', 'geheim456', 'user')");
    db.run("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (7, 'anna', 'password789', 'user')");
    db.run("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (8, 'hans', '12345hans', 'user')");
    db.run("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (9, 'maria', 'maria2023', 'user')");
    db.run("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (10, 'julian', 'sicheresPasswort', 'user')");
    db.run("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (11, 'kim', 'meinpasswort2023', 'user')");
    db.run("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (12, 'julia', 'juliapass123', 'user')");

/*
    // Testausgabe
    db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
            console.error("Error fetching data:", err.message);
        } else {
            console.log("Database contents:");
            console.log(rows);
        }
    });
*/

    // Table für Files
    db.run(`CREATE TABLE IF NOT EXISTS files (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        filepath TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error("Error creating files table:", err.message);
        }
    });

    db.run(`INSERT OR IGNORE INTO files (id, filename, filepath) VALUES (1, 'meisterwerk.txt', '/uploads/meisterwerk.txt')`);
    db.run(`INSERT OR IGNORE INTO files (id, filename, filepath) VALUES (2, 'pentest.png', '/uploads/pentest.png')`);
    db.run(`INSERT OR IGNORE INTO files (id, filename, filepath) VALUES (3, 'goethev2.txt', '/uploads/goethev2.txt')`);
    db.run(`INSERT OR IGNORE INTO files (id, filename, filepath) VALUES (4, 'tinte.txt', '/uploads/tinte.txt')`);
    db.run(`INSERT OR IGNORE INTO files (id, filename, filepath) VALUES (5, 'monalisa.png', '/uploads/monalisa.png')`);
    db.run(`INSERT OR IGNORE INTO files (id, filename, filepath) VALUES (6, 'sketch.png', '/uploads/sketch.png')`);
    db.run(`INSERT OR IGNORE INTO files (id, filename, filepath) VALUES (7, 'kugelschreiber.txt', '/uploads/kugelschreiber.txt')`);
    db.run(`INSERT OR IGNORE INTO files (id, filename, filepath) VALUES (8, 'bild.png', '/uploads/bild.png')`);
    db.run(`INSERT OR IGNORE INTO files (id, filename, filepath) VALUES (9, 'hilfeschrei.txt', '/uploads/hilfeschrei.txt')`);
    db.run(`INSERT OR IGNORE INTO files (id, filename, filepath) VALUES (10, 'lol.txt', '/uploads/lol.txt')`);
    db.run(`INSERT OR IGNORE INTO files (id, filename, filepath) VALUES (11, 'derschrei.png', '/uploads/derschrei.png')`);
    db.run(`INSERT OR IGNORE INTO files (id, filename, filepath) VALUES (12, 'sketchv2.png', '/uploads/sketchv2.png')`);

/*  // Testausgabe
    db.all("SELECT * FROM files", (err, rows) => {
        if (err) {
            console.error("Error fetching data:", err.message);
        } else {
            console.log("Database contents:");
            console.log(rows);
        }
    });

    console.log("Tables initialized.");
*/
});


export { db };