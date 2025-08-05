const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const { isAuthenticated } = require('../middleware/auth');

router.get('/', isAuthenticated, postController.getAllPosts);
router.get('/my', isAuthenticated, postController.getMyPosts);
router.get('/create', isAuthenticated, postController.getCreatePost);
router.post('/create', isAuthenticated, postController.postCreatePost);

module.exports = router;
