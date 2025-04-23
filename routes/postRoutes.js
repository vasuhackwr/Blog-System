const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { isAuthenticated, isAuthor } = require('../utils/middleware');
const methodOverride = require('method-override');

// Method override for PUT/DELETE
router.use(methodOverride('_method'));

// Get all posts
router.get('/', postController.getAllPosts);

// Get single post
router.get('/:id', postController.getPost);

// Create post routes
router.get('/create', isAuthenticated, postController.getCreatePost);
router.post('/create', isAuthenticated, postController.postCreatePost);

// Edit post routes
router.get('/:id/edit', isAuthenticated, isAuthor, postController.getEditPost);
router.put('/:id', isAuthenticated, isAuthor, postController.putEditPost);

// Delete post
router.delete('/:id', isAuthenticated, isAuthor, postController.deletePost);

module.exports = router;