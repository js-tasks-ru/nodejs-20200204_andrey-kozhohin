const Product = require('../models/Product');

module.exports.productsByQuery = async function productsByQuery(ctx, next) {

  let productListArr = await Product.find({$text: {$search: ctx.request.query.query}});

  productListArr = productListArr.map((doc) => {
    return doc.toObject();
  });

  ctx.body = {products: productListArr};
};
