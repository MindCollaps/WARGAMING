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

    db.run(`CREATE TABLE IF NOT EXISTS posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        content TEXT NOT NULL
    )`, (err) => {
        if (err) {
            console.error("Error creating table:", err.message);
        }
    });

    db.run("INSERT OR IGNORE INTO posts (id, title, content) VALUES (1, 'Stift mit Root-Zugriff gefunden!', 'Gerade von Pentest Pepe gehört, dass sie einen Kugelschreiber gefunden haben, der Root-Zugriff auf meinen Einkaufszettel hat. Anscheinend schreibt er von alleine EISCREME. Die Bedrohung ist real, Leute!')");
    db.run("INSERT OR IGNORE INTO posts (id, title, content) VALUES (2, 'Stift-Firewall benötigt!', 'Ich brauche dringend eine Stift-Firewall! Dieser Pentest Pepe Hype macht mich paranoid. Was, wenn meine Stifte mich ausspionieren und meine Geheimnisse an die Konkurrenz verkaufen?!')");
    db.run("INSERT OR IGNORE INTO posts (id, title, content) VALUES (3, 'Haben die schon Radiergummis gehackt?', 'Ok, Pentest Pepe testet jetzt Stifte. Aber wann fangen sie an, Radiergummis zu hacken? Nicht, dass ich etwas zu verbergen hätte... außer vielleicht meine miserablen Zeichenkünste.')");
    db.run("INSERT OR IGNORE INTO posts (id, title, content) VALUES (4, 'Stift-DDOS? Danke, Pentest Pepe!', 'Pentest Pepe hat meinen Schreibtisch analysiert und festgestellt, dass ich Opfer eines Stift-DDOS bin. 37 Kugelschreiber greifen gleichzeitig an, und keiner schreibt richtig. Ich brauche dringend eine Stift-Quarantäne!')");
    db.run("INSERT OR IGNORE INTO posts (id, title, content) VALUES (5, 'Der Bleistift mit DoS-Attacke', 'Mein Bleistift wurde von Pentest Pepe getestet. Ergebnis? Er bricht absichtlich ab, sobald ich anfangen will zu schreiben. Klassische Denial-of-Service-Attacke!')");

    db.run("INSERT OR IGNORE INTO users (id, username, password) VALUES (1, 'admin', 'secret')");
    db.run("INSERT OR IGNORE INTO users (id, username, password) VALUES (2, 'user', '1234')");

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

});


export { db };