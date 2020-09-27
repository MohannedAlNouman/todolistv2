const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/userSchema');

passport.use(User.createStrategy());

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/todolist'
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({
      googleId: profile.id,
      email: profile._json.email,
      name: profile._json.name
    }, function(err, user) {
      return done(err, user);
    });
  }
));
