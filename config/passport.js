const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const User = require('../models/User');

module.exports = function() {
  passport.use(new LocalStrategy(
    async (username, password, done) => {
      try {
        console.log('Login attempt:', username); // Debug log
        const user = await User.findOne({ username });
        if (!user) {
          console.log('User not found'); // Debug log
          return done(null, false, { message: 'Incorrect username.' });
        }
        // ... rest of your strategy code
      } catch (err) {
        console.error('Auth error:', err); // Debug log
        return done(err);
      }
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};