import express from 'express';
const router = express.Router();

import {
  getPostsWithPagination,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/posts.js';
import { postIdValidation, postValidation } from '../middlewares/validation.js';

router.get('/:page', getPostsWithPagination);
router.post('/', postValidation, createPost);
router.patch('/:postId', postValidation, updatePost);
router.delete('/:postId', postIdValidation, deletePost);
export default router;
