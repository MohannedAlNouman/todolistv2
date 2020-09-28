const passport = require('passport');

const authRouter = require("express").Router();

//checks if user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    console.log("you're not currently logged in");
    res.sendStatus(401);
  }
};

//route used to login
authRouter.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  }));

//redirect route after auth
authRouter.get('/google/todolist',
  passport.authenticate('google', {
    failureRedirect: '/auth/failure'
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  });

//check to see if you're logged in
authRouter.get('/success', isLoggedIn, (req, res) => {
  res.send("Hello " + req.user.name);
});

//pulls user data to client side
authRouter.get('/pullUser', isLoggedIn, (req, res) => {
  res.send(req.user);
});

//redirect here after unsuccessful login
authRouter.get('/failure', (req, res) => {
  res.send("You failed to log in");
});

//logs you out and destroys the session
authRouter.get('/logout', isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy((err) => {
    res.send('Successfully logged out');
  });
});

module.exports = authRouter;
