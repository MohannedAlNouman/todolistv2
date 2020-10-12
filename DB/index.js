require('dotenv').config();

//process.env.TODOLIST_MONGODB
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/todolistDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set('useCreateIndex', true);

module.exports = mongoose;
