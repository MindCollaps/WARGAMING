import { connect } from './database/database.js'
import express from 'express'
import appRouter from './router/app.js';

const app = express();

app.listen(5000, () => console.log('listening on port ' + 5000));
app.use(express.static('public'));
app.use(express.json({ limit: '2mb' }));
app.use(appRouter);
connect();

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