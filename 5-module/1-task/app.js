const path = require('path');
const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')(path.join(__dirname, 'public')));
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();

let clients = [];

router.get('/subscribe', async (ctx, next) => { // получение сообщений. запрос подвешивается


    ctx.set('Content-Type', 'text/plain;charset=utf-8');
    ctx.set("Cache-Control", "no-cache, must-revalidate");

    await new Promise((resolve, reject) => {
        // const id = ctx.request.query.r;
        // clients[id] = resolve; // ответ промиса
        clients.push(resolve);

    }).then(message => {
        //console.log(message)
        //ctx.status = 200;
        ctx.body = message;
    });

});

router.post('/publish', async (ctx, next) => { // отправка сообщений
    const message = ctx.request.body.message;

    if (!message) {
        ctx.throw(400);
    }

    clients.forEach((resolve) => {
        resolve(String(message));
        //console.log(resolve);
    });

    clients = [];
    //ctx.status = 200;
    ctx.body = 'done';

});

app.use(router.routes());

module.exports = app;
