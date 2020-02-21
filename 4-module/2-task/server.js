const url = require('url');
const http = require('http');
const path = require('path');
const {pipeline} = require('stream');
const LimitSizeStream = require('./LimitSizeStream');
const fs = require('fs');

const server = new http.Server();

server.on('request', (req, res) => {

    const pathname = url.parse(req.url).pathname.slice(1);
    const filepath = path.join(__dirname, 'files', pathname);

    server.on('clientError', () => { // при обрыве соединения удаляем файл
        fs.unlink(filepath, () => {
            res.end();
        });
    });

    const urlArr = pathname.split('/');

    if (urlArr.length >= 2) { // возвращаем ошибку 400 если путь к файлу вложенный
        res.statusCode = 400;
        res.end();

    } else {
        switch (req.method) {
            case 'POST':
                fs.access(filepath, (err) => {
                    if (err) { // нет такого файла

                        const LIMIT = 1024 * 1024; // 1mb
                        const writeStream = fs.createWriteStream(filepath);
                        const limitStream = new LimitSizeStream({limit: LIMIT});

                        req.pipe(limitStream).on('error', (err) => { // файл больше заданного лимита
                            fs.unlink(filepath, () => {
                                res.statusCode = 413;
                                // console.log(err.code);
                                // console.log(res.statusCode);
                                res.end('done');
                            });

                        }).pipe(writeStream).on('finish', () => {
                            res.statusCode = 201;
                            res.end();
                        });

                        /*
                        pipeline(
                            req,
                            limitStream,
                            writeStream,
                            (err, data) => {
                                if (err) { // превышен максимальный размер файла
                                    res.statusCode = 413;
                                    console.log(err.code);
                                    console.log(res.statusCode);
                                    res.end();
                                } else {
                                    res.statusCode = 201;
                                    console.log(res.statusCode);
                                    res.end();
                                }
                            });
                        */

                    } else { // ошибка если файл уже существует или запрос пустой
                        res.statusCode = 409;
                        res.end();
                    }
                });

                break;

            default:
                res.statusCode = 501;
                res.end('Not implemented');
        }
    }
});

module.exports = server;
