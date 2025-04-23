const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../utils/middleware');

// Admin routes
router.get('/admin/users', isAuthenticated, isAdmin, userController.getAllUsers);
router.get('/admin/posts', isAuthenticated, isAdmin, userController.getAllPostsAdmin);
router.delete('/admin/posts/:id', isAuthenticated, isAdmin, userController.adminDeletePost);

module.exports = router;