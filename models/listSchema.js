const mongoose = require('../DB/index');
const Item = require('./itemSchema');

const listSchema = new mongoose.Schema({
  name: String,
  items: [Item.schema]
});
const List = new mongoose.model('List', listSchema);

module.exports = List;
