const User = require('../models/User');
const { registerValidation, loginValidation } = require('../utils/validators');

// Render login page
exports.getLogin = (req, res) => {
  res.render('auth/login', { title: 'Login' });
};

// Handle login
exports.postLogin = (req, res, next) => {
  const { error } = loginValidation(req.body);
  if (error) {
    req.flash('error', error.details[0].message);
    return res.redirect('/auth/login');
  }
  
  passport.authenticate('local', {
    successRedirect: '/posts',
    failureRedirect: '/auth/login',
    failureFlash: true
  })(req, res, next);
};

// Render register page
exports.getRegister = (req, res) => {
  res.render('auth/register', { title: 'Register' });
};

// Handle registration
exports.postRegister = async (req, res) => {
  const { error } = registerValidation(req.body);
  if (error) {
    req.flash('error', error.details[0].message);
    return res.redirect('/auth/register');
  }

  try {
    const { username, password } = req.body;
    
    // Check if user exists
    let user = await User.findOne({ username });
    if (user) {
      req.flash('error', 'Username already exists');
      return res.redirect('/auth/register');
    }

    // Create new user
    user = new User({ username, password });
    await user.save();
    
    req.flash('success', 'Registration successful. Please log in.');
    res.redirect('/auth/login');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Handle logout
exports.logout = (req, res) => {
  req.logout();
  req.flash('success', 'You have been logged out');
  res.redirect('/auth/login');
};