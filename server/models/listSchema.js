const mongoose = require('../DB/index');
const Item = require('./itemSchema');
const findOrCreate = require('mongoose-findorcreate'); //wont need this after login is implemented

const listSchema = new mongoose.Schema({
  name: String,
  items: [Item.schema]
});
listSchema.plugin(findOrCreate);
const List = new mongoose.model('List', listSchema);

module.exports = List;
