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

    db.all("SELECT * FROM users", (err, rows) => {
        if (err) {
            console.error("Error fetching data:", err.message);
        } else {
            console.log("Database contents:");
            console.log(rows);
        }
    });
});

export { db };