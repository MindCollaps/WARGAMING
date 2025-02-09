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
        password TEXT
    )`, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        }
    });

    db.run("INSERT OR IGNORE INTO users (id, username, password) VALUES (1, 'admin', 'secret')");
    db.run("INSERT OR IGNORE INTO users (id, username, password) VALUES (2, 'user', '1234')");

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

    db.run(`INSERT OR IGNORE INTO files (id, filename, filepath) VALUES (1, 'test', 'test')`);
    db.run(`INSERT OR IGNORE INTO files (id, filename, filepath) VALUES (2, 'schatzsuche.txt', 'blabla')`);

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