// Import the Post model
const Post = require('../models/Post');  // Adjust the path if necessary

// Check if user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please log in to access this page');
  res.redirect('/auth/login');
};

// Check if user is the author of the post
const isAuthor = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      req.flash('error', 'Post not found');
      return res.redirect('/posts');
    }

    // Check if the user is the author of the post
    if (post.createdBy.equals(req.user._id)) {
      return next();  // Proceed to the next middleware or route handler
    }

    req.flash('error', 'You are not authorized to perform this action');
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Check if user is admin
const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next();
  }
  req.flash('error', 'Admin access required');
  res.redirect('/posts');
};

module.exports = {
  isAuthenticated,
  isAuthor,
  isAdmin
};