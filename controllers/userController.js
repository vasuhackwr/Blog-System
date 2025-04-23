const User = require('../models/User');
const Post = require('../models/Post');

// Get all users (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.render('users/index', { 
      title: 'All Users', 
      users 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Get all posts (Admin view)
exports.getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await Post.find().populate('createdBy', 'username').sort({ createdAt: -1 });
    res.render('posts/admin-index', { 
      title: 'All Posts (Admin View)', 
      posts 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Admin delete post
exports.adminDeletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      req.flash('error', 'Post not found');
      return res.redirect('/admin/posts');
    }
    
    req.flash('success', 'Post deleted successfully');
    res.redirect('/admin/posts');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};