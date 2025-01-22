import sqlite3 from 'sqlite3'

export function connect() {
    const db = new sqlite3.Database('./db/database.db');
    console.log("Database Ready")
}
