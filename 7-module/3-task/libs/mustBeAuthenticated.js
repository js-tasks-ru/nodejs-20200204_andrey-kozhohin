module.exports = function mustBeAuthenticated(ctx, next) {
  if (!ctx.user) {
    ctx.throw(401, 'Пользователь не залогинен');
    // ctx.status = 401;
    // ctx.body = 'Пользователь не залогинен';
  }

  return next();
};
