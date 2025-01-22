const express = require('express');
const app = express();
const appRouter = require('./router/app.js');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
    db.run("CREATE TABLE users (id INT, username TEXT, password TEXT)");
    db.run("INSERT INTO users (id, username, password) VALUES (1, 'admin', 'secret')");
    db.run("INSERT INTO users (id, username, password) VALUES (2, 'user', '1234')");
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

    db.all(query, [], (err, rows) => {
        if (err) {
            return res.status(500).send('Internal Server Error');
        }

        if (rows.length > 0) {
            res.send(`Welcome, ${username}!`);
        } else {
            res.send('Invalid credentials.');
        }
    });
});

var visitedUsers = 0;

app.listen(5000, () => console.log('listening on port ' + 5000));
app.use(express.static('public'));
app.use(express.json({ limit: '2mb' }));
app.use(appRouter);
console.log("Ready")

process.on('unhandledRejection', (reason, p) => {
    console.log("Unhandled Rejection at: Promise ", p, " reason: ", reason);
});
process.on('uncaughtException', (error) => {
    console.log('Shit hit the fan (uncaughtException): ', error);
    //process.exit(1);
})

app.use(function(req, res, next) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    let seconds = date_ob.getSeconds();
    var time = year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds
    console.log(time + " " + req.method + " " + req.originalUrl + ' request from: ' + ip + " -> 404");
    res.status(404);
    // respond with html page
    // respond with json
    if (req.accepts('json')) {
        res.send({ status: 404, response: 'Not found' });
        return;
    }
    // default to plain-text. send()
    res.type('txt').send('Not found');
});