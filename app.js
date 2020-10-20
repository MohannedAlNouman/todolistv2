require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(bodyParser.json());

const db = require("./DB/index");

const passport = require("passport");
require("./Auth/passport");
const session = require("express-session");

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

//serves react frontend at root page
app.use(express.static("client/build"));

//user authentication routes, handles logging in and logging out
const directRouter = require("./routes/direct-routes");
app.use("/", directRouter);

//user authentication routes, handles logging in and logging out
const authRouter = require("./routes/auth-routes");
app.use("/auth", authRouter);

//Database routes, handles get and post list requests
const dbRouter = require("./routes/DB-routes");
app.use("/api", dbRouter);

const port = process.env.PORT || 3001;
app.listen(port, err => {
  console.log("Server started on port " + port);
});
