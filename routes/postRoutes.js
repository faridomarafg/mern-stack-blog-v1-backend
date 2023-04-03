const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const {protect} = require('../middleWare/authMiddleware');

router.post('/',protect , postController.createPost);

router.get('/', postController.getPosts);

router.get('/:id', postController.getPost);

router.get('/userPosts/:id',protect, postController.getPostByUser);

router.delete('/:id',protect, postController.deletePost);

router.put('/:id',protect, postController.updatePost);

router.patch('/like/:id', protect, postController.likePosts);

module.exports = router;  