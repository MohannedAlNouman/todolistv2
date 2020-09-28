require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json())

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true // allow session cookie from browser to pass through
  })
);

const db = require('./DB/index');
const User = require('./models/userSchema');

const passport = require('passport');
require('./Auth/passport');
const session = require('express-session');

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//serves react frontend
app.use(express.static('client/build'));

//user authentication
const authRouter = require('./routes/auth-routes');
app.use("/auth", authRouter);

//handles list updates
const dbRouter = require('./routes/DB-routes');
app.use("/api", dbRouter);

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log("Server started on port " + port);
});
