const passport = require("passport");
const directRouter = require("express").Router();

//gets specific list
directRouter.get("/", (req, res) => {
  res.send("/");
});

//gets specific list
directRouter.get("/CreateList", (req, res) => {
  res.send("/");
});

//gets specific list
directRouter.get("/MyLists", (req, res) => {
  res.send("/");
});

module.exports = directRouter;
