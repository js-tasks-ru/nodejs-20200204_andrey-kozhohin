const Message = require('../models/Message');

module.exports.messageList = async function messages(ctx, next) {
  // сортировка по дате в порядке убывания + ограничение выборки
  let mesgArr = await Message.find().sort({'date': -1}).limit(1);

  mesgArr = mesgArr.map((doc) => {
    return doc.toObject();
  });

  ctx.body = {messages: mesgArr};
};
