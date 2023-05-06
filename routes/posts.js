const router = require('express').Router();

const {
  getPostsWithPagination,
  createPost,
  updatePost,
  deletePost,
} = require('../controllers/posts');
const { postIdValidation, postValidation } = require('../middlewares/validation');

router.get('/', getPostsWithPagination);
router.post('/', postValidation, createPost);
router.patch('/:postId', postValidation, updatePost);
router.delete('/:postId', postIdValidation, deletePost);
module.exports = router;
