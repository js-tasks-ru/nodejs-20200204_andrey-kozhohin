const passport = require('../libs/passport');
const config = require('../config');
const uuid = require('uuid/v4');


// Фронт отправляет запрос сюда,
// мы делаем запрос провайдеру, получаем от него ссылку куда перейти
// для аутентификации и подтверждения. Возвращаем ее фронту
module.exports.oauth = async function oauth(ctx, next) {
  const provider = ctx.params.provider;

  await passport.authenticate(
      provider,
      config.providers[provider].options,
  )(ctx, next);

  ctx.status = 200;
  ctx.body = {status: 'ok', location: ctx.response.get('location')};
  ctx.response.remove('location');
};


// Фронтэнд сам переходит на страницу, куда должен быть перенаправлен пользователь
// и далее пользователь авторизуется и разрешает доступ в соц сети.

// После успеха провайдер перенаправляет запрос на наше приложение (callback url который
// мы вводим при регистрации приложения), но при этом обработкой
// этого запроса вначале занимается фронтэнд (url без префикса /api/)


// после этого фронт отправляет нам запрос с секретным
// кодом полученным от провайдера который паспорт обменивает на токен и профиль пользователя
module.exports.oauthCallback = async function oauthCallback(ctx, next) {
  const provider = ctx.request.body.provider;

  await passport.authenticate(provider, async (err, user, info) => {
    if (err) throw err;

    if (!user) {
      ctx.status = 400;
      ctx.body = {error: info};
      return;
    }

    const token = uuid();

    ctx.body = {token};
  })(ctx, next);
};
