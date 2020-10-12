const mongoose = require('../DB/index');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
  googleId: String,
  email: String,
  name: String,
  lists: [{
    listName: String,
    listId: String
  }]
});
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

module.exports = User;
