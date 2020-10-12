const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/userSchema");

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

//https://mohanned-todolistv2.herokuapp.com/auth/google/todolist
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/todolist"
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne(
        {
          googleId: profile.id
        },
        (err, user) => {
          if (user) {
            user.email = profile._json.email;
            user.name = profile._json.name;
            user.save(err => {
              return done(err, user);
            });
          } else if (!user) {
            const newUser = new User({
              googleId: profile.id,
              email: profile._json.email,
              name: profile._json.name
            });
            newUser.save(err => {
              return done(err, newUser);
            });
          }
        }
      );
    }
  )
);
