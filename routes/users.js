import { getMyInfo } from '../controllers/users.js';
import express from 'express';
const router = express.Router();

router.get('/me', getMyInfo);

export default router;
