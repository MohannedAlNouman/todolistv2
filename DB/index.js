require("dotenv").config();

const mongoose = require("mongoose");
mongoose.connect(process.env.TODOLIST_MONGODB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

mongoose.set("useCreateIndex", true);

module.exports = mongoose;
