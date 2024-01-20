var fs = require('fs');
var https = require('https');
var express = require('express');
var app = express();


(async function () {
    var pfx = await fs.promises.readFile('cert.pfx');
    var server = https.createServer({
        pfx: pfx,
        passphrase: 'pass'
    },
    (req, res) => {
        res.setHeader('Content-type', 'text/html; charset=utf-8');
        res.end(`hello world ${new Date()}`);
    });
    server.listen(process.env.PORT || 3030);
    console.log('started');
})();