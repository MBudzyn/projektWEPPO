var fs = require('fs');
var http = require('http');



(async function () {
    var pfx = await fs.promises.readFile('cert.pfx');
    var server = http.createServer({
        pfx: pfx,
        passphrase: 'pass'
    },
    (req, res) => {
        res.setHeader('Content-type', 'text/html; charset=utf-8');
        res.end(`hello world ${new Date()}`);
    });
    server.listen(process.env.PORT || 10000);
    console.log('started');
})();