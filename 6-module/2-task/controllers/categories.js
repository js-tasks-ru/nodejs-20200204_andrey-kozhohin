const Category = require('../models/Category');
module.exports.categoryList = async function categoryList(ctx, next) {
  let categoryListAll = await Category.find({});

  categoryListAll = categoryListAll.map((doc)=> {
    return doc.toObject(); // метод изменен в контроллере чтобы отдавать "id" вместо "_id"
  });

  const listsArr = {categories: categoryListAll};
  ctx.body = listsArr;
};
