const url = require('url');
const http = require('http');
const path = require('path');
const {pipeline} = require('stream');
const LimitSizeStream = require('./LimitSizeStream');
const fs = require('fs');

const server = new http.Server();

let filepath;

server.on('clientError', () => { // при обрыве соединения удаляем файл
    fs.unlink(filepath, () => {
    });
});

server.on('request', (req, res) => {
    const pathname = url.parse(req.url).pathname.slice(1);
    filepath = path.join(__dirname, 'files', pathname);

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

                        /*
                        req.on('data', (data) => {
                          limitStream.write(data).pipe(writeStream).on('error', (err) => {
                               console.log(err.code);
                           });
                        });
                        */

                        pipeline(
                            req,
                            limitStream,
                            writeStream,
                            (err, data) => {
                                if (err) {
                                    console.log(err.code);
                                    res.statusCode = 413;
                                    console.log(res.statusCode);
                                    res.end();
                                } else {
                                    res.statusCode = 201;
                                    console.log(res.statusCode);
                                    res.end();
                                }
                            });

                        /*
                        limitStream.on('error', (err) => { // при превышении лимита
                            limitStream.destroy();
                            res.statusCode = 413;
                            console.log(res.statusCode);
                            console.log(err.code);
                            fs.unlinkSync(filepath, () => {
                            });
                            res.end();
                        });

                        req.pipe(limitStream).pipe(writeStream); // передаем файл из запроса в поток на запись
                        //req.pipe(writeStream); // передаем файл из запроса в поток на запись

                        res.statusCode = 201;
                        console.log(res.statusCode);
                        req.on('end', () => res.end());
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
