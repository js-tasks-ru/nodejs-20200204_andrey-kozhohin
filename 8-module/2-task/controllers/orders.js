const Order = require('../models/Order');
const sendMail = require('../libs/sendMail');

module.exports.checkout = async function checkout(ctx, next) {
  function convertErrors(errors) {
    let returnErrs = {};
    for (key in errors) {
      returnErrs = {...returnErrs, ...{[key]: errors[key].properties.message}};
    }
    return returnErrs;
  }

  if (ctx.user) { // пользователь авторизован
    const order = new Order({
      user: ctx.user, // пользователь записан в контекст после аутентификации
      product: ctx.request.body.product,
      phone: ctx.request.body.phone,
      address: ctx.request.body.address,
    });

    let orderSaved = null;

    try {
      orderSaved = await order.save();
    } catch (e) {
      ctx.status = 400;
      ctx.body = {errors: convertErrors(e.errors)};
    }

    if (orderSaved) {
      const mailOptions = {
        template: 'order-confirmation',
        locals: {id: orderSaved._id, product: {title: ctx.request.body.product}},
        to: ctx.user.email,
        subject: 'Ваш заказ успешно принят',
      };

      await sendMail(mailOptions);
      ctx.body = {order: orderSaved._id};
    }
  } else {
    ctx.status = 401; // пользователь не авторизован
  }
};

module.exports.getOrdersList = async function ordersList(ctx, next) {
  if (ctx.user) {
    const order = await Order.find({user: ctx.user});

    orderArr = order.map((doc) => {
      return doc.toObject();
    });

    ctx.body = {orders: orderArr};
  } else {
    ctx.status = 401; // пользователь не авторизован
  }
};
