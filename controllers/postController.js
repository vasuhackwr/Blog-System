const Post = require('../models/Post');
const { postValidation } = require('../utils/validators');

// Get all posts with optional search
exports.getAllPosts = async (req, res) => {
  try {
    const searchTerm = req.query.search;
    let query = {};
    
    if (searchTerm) {
      query = {
        $or: [
          { title: { $regex: searchTerm, $options: 'i' } },
          { tags: { $in: [searchTerm] } }
        ]
      };
    }
    
    const posts = await Post.find(query).populate('createdBy', 'username').sort({ createdAt: -1 });
    res.render('posts/index', { 
      title: 'All Posts', 
      posts,
      searchTerm 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Get single post
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('createdBy', 'username');
    if (!post) {
      req.flash('error', 'Post not found');
      return res.redirect('/posts');
    }
    
    res.render('posts/show', { 
      title: post.title, 
      post 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Render create post form
exports.getCreatePost = (req, res) => {
  res.render('posts/create', { title: 'Create Post' });
};

// Create new post
exports.postCreatePost = async (req, res) => {
  const { error } = postValidation(req.body);
  if (error) {
    req.flash('error', error.details[0].message);
    return res.redirect('/posts/create');
  }

  try {
    const { title, content, tags } = req.body;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
    
    const newPost = new Post({
      title,
      content,
      tags: tagsArray,
      createdBy: req.user._id
    });
    
    await newPost.save();
    req.flash('success', 'Post created successfully');
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Render edit post form
exports.getEditPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      req.flash('error', 'Post not found');
      return res.redirect('/posts');
    }
    
    res.render('posts/edit', { 
      title: 'Edit Post', 
      post 
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Update post
exports.putEditPost = async (req, res) => {
  const { error } = postValidation(req.body);
  if (error) {
    req.flash('error', error.details[0].message);
    return res.redirect(`/posts/${req.params.id}/edit`);
  }

  try {
    const { title, content, tags } = req.body;
    const tagsArray = tags ? tags.split(',').map(tag => tag.trim()) : [];
    
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { title, content, tags: tagsArray },
      { new: true }
    );
    
    if (!post) {
      req.flash('error', 'Post not found');
      return res.redirect('/posts');
    }
    
    req.flash('success', 'Post updated successfully');
    res.redirect(`/posts/${post._id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// Delete post
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) {
      req.flash('error', 'Post not found');
      return res.redirect('/posts');
    }
    
    req.flash('success', 'Post deleted successfully');
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};