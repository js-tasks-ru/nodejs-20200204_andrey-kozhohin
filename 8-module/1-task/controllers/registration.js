const uuid = require('uuid/v4');
const User = require('../models/User');
const sendMail = require('../libs/sendMail');

module.exports.register = async (ctx, next) => {
  function convertErrors(errors) {
    let returnErrs = {};
    for (key in errors) {
      returnErrs = {...returnErrs, ...{[key]: errors[key].properties.message}};
    }
    return returnErrs;
  }

  const regUser = new User({
    email: ctx.request.body.email,
    displayName: ctx.request.body.displayName,
    verificationToken: uuid(),
    passwordHash: '',
    salt: '',
  });

  regUser.setPassword(ctx.request.body.password);

  let isError = false;

  try {
    await regUser.save();
  } catch (e) {
    isError = true;
    ctx.status = 400;
    ctx.body = {errors: convertErrors(e.errors)};
  }

  if (!isError) {
    const mailOptions = {
      template: 'confirmation',
      locals: {token: token},
      to: ctx.request.body.email,
      subject: 'Подтвердите почту',
    };

    await sendMail(mailOptions);
    ctx.body = {status: 'ok'};
  }
}
;

module.exports.confirm = async (ctx, next) => {
  const user = await User.findOneAndUpdate(
      {verificationToken: ctx.request.body.verificationToken},
      {$unset: {verificationToken: ''}});

  if (user) {
    ctx.body = {token: uuid()};
  } else {
    ctx.status = 400;
    ctx.body = {error: 'Ссылка подтверждения недействительна или устарела'};
  }
};
