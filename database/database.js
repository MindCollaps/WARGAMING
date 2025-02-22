import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('./db/database.db', (err) => {
    if (err) {
        console.error("Error connecting to database:", err);
    } else {
        console.log("Database Ready");
        db.serialize(() => {
            db.run(`
                CREATE TABLE IF NOT EXISTS users (
                                                     id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                     username TEXT UNIQUE NOT NULL,
                                                     password TEXT NOT NULL,
                                                     role TEXT CHECK(role IN ('User', 'Admin')) NOT NULL
                    )
            `, (err) => {
                if (err) {
                    console.error("Error creating users table:", err);
                } else {
                    console.log("Users table created or already exists");
                }
            });

            db.run("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (1, 'admin', 'admin123', 'Admin')", (err) => {
                if (err) console.error("Error inserting admin user:", err);
                else console.log("Admin user inserted or already exists");
            });

            db.run("INSERT OR IGNORE INTO users (id, username, password, role) VALUES (2, 'user', 'user123', 'User')", (err) => {
                if (err) console.error("Error inserting regular user:", err);
                else console.log("Regular user inserted or already exists");
            });
        });
    }
});

export default db;
