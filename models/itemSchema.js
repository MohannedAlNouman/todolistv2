const mongoose = require('../DB/index');

const itemSchema = new mongoose.Schema({
  item: String,
  items: [this],
  strikeThrough: Boolean
});
const Item = new mongoose.model('Item', itemSchema);

module.exports = Item;
