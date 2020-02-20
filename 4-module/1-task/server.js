const url = require('url');
const http = require('http');
const path = require('path');

const fs = require('fs');


const server = new http.Server();

server.on('request', (req, res) => {
    const pathname = url.parse(req.url).pathname.slice(1);
    const filepath = path.join(__dirname, 'files', pathname);

    const urlArr = pathname.split('/');
    if (urlArr.length >= 2) {
        res.statusCode = 400;
        res.end();
    }

    switch (req.method) {
        case 'GET':

            /*
                const stream = fs.createReadStream(filepath);

                //let file = '';
                stream.on('readable', (chunk) => {
                    while (null !== (chunk = stream.read())) {
                        res.send(chunk);
                        console.log(chunk);
                    }
                });
                */

            fs.access(filepath, err => {
                if (err) {
                    res.statusCode = 404;
                    res.end();
                } else {
                    fs.createReadStream(filepath).pipe(res);
                }
            })

            break;

        default:
            res.statusCode = 501;
            res.end('Not implemented');
    }
});

module.exports = server;
