const passport = require("passport");
const authRouter = require("express").Router();

//checks if a user is logged in
const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    //user not logged in, send status code 401 (unauthorized access)
    res.sendStatus(401);
  }
};

//route used to login
authRouter.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"]
  })
);

///
//redirect route after authentication
authRouter.get(
  "/google/todolist",
  passport.authenticate("google", {
    failureRedirect: "/"
  }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect("http://localhost:3000");
  }
);

//pulls user data to client side
authRouter.get("/pullUser", isLoggedIn, (req, res) => {
  res.send(req.user);
});

//logs you out and destroys the session
authRouter.get("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session.destroy(err => {
    res.send("Successfully logged out");
  });
});

module.exports = authRouter;
