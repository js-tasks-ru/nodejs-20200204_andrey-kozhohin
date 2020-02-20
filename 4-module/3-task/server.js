const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {
        const pathname = url.parse(req.url).pathname.slice(1);
        const filepath = path.join(__dirname, 'files', pathname);

        switch (req.method) {
            case 'DELETE':

                const urlArr = pathname.split('/');

                if (urlArr.length >= 2) { // возвращаем ошибку 400 если путь к файлу вложенный
                    res.statusCode = 400;
                    res.end();

                } else {
                    fs.access(filepath, (err) => {
                        if (err) {
                            res.statusCode = 404;
                            res.end();
                        } else {
                            fs.unlink(filepath, () => {
                                res.statusCode = 200;
                                res.end();
                            });
                        }
                    });
                }

                break;

            default:
                res.statusCode = 501;
                res.end('Not implemented');
        }
    }
);

module.exports = server;
