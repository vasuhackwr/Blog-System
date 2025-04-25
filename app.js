require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');
const morgan = require('morgan');
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

// Initialize app
const app = express();

// Database connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connected Successfully!'))
.catch(err => {
  console.error('MongoDB Connection Error:', err.message);
  process.exit(1);
});

// Session configuration
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));  // Body parser for form data
app.use(express.json());  // Body parser for JSON data
app.use(cookieParser()); // Optional, not strictly required for CSRF without cookies
app.use(session({
  secret: process.env.SESSION_SECRET || 'fallback_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600000, secure: false, httpOnly: true }
}));
app.use(flash());  // Flash must be after session middleware

// Passport initialization
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Global variables
app.use((req, res, next) => {
  res.locals.user = req.user;
  res.locals.messages = req.flash();
  try {
    res.locals.csrfToken = req.csrfToken(); // Try to set csrfToken
  } catch (err) {
    res.locals.csrfToken = null; // If error (like CSRF failure), set to null
  }
  next();
});

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/posts', require('./routes/postRoutes'));
app.use('/', require('./routes/userRoutes'));

// Home route
app.get('/', (req, res) => res.redirect('/posts'));

// Error handlers
app.use((req, res) => {
  res.status(404).render('404', { 
    title: 'Page Not Found',
    user: req.user
  });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('500', {
    title: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err : null,
    user: req.user
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});