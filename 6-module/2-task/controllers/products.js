const Product = require('../models/Product');
const mongoose = require('mongoose');


module.exports.productsBySubcategory = async function productsBySubcategory(ctx, next) {

    const subCategory = ctx.request.query.subcategory;
    if (subCategory) {
        let productList = await Product.find({subcategory: subCategory});

        productList = productList.map((doc) => {
            return doc.toObject();
        });

        ctx.body = {products: productList};
    } else {
        await next();
    }
};


module.exports.productList = async function productList(ctx, next) {

    let productListArr = await Product.find({});

    productListArr = productListArr.map((doc) => {
        return doc.toObject();
    });

    ctx.body = {products: productListArr};
};


module.exports.productById = async function productById(ctx, next) {

  if (mongoose.Types.ObjectId.isValid(ctx.params.id)) { // валидация ObjectId
        const prod = await Product.find({_id: ctx.params.id});
        if (prod.length === 0) return ctx.status = 404;
        return ctx.body = {product: prod[0].toObject()};
    }
    ctx.status = 400;
};

