const mongoose = require('mongoose');
const connection = require('../libs/connection');

const subCategorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
}, {versionKey: false, toObject: {virtuals: true}});

const categorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  subcategories: [subCategorySchema],
}, {versionKey: false, toObject: {virtuals: true}});

/*
categorySchema.virtual('id')
    .get(function() {
      return this._id;
    });

subCategorySchema.virtual('id')
    .get(function() {
      return this._id;
    });
*/

if (!categorySchema.options.toObject) categorySchema.options.toObject = {};
categorySchema.options.toObject.transform = function(doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  return ret;
};

if (!subCategorySchema.options.toObject) subCategorySchema.options.toObject = {};
subCategorySchema.options.toObject.transform = function(doc, ret, options) {
  ret.id = ret._id;
  delete ret._id;
  return ret;
};

module.exports = connection.model('Category', categorySchema);
