const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const {protect} = require('../middleWare/authMiddleware');

router.post('/:id',protect ,commentController.createComment);

router.get('/:postId' ,protect,commentController.getComments);

router.delete('/:id' ,protect,commentController.deleteComment);

module.exports = router;  