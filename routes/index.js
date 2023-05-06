import userRoute from './users.js';
import postRoute from './posts.js';
import auth from '../middlewares/auth.js';
import { loginValidation, signupValidation } from '../middlewares/validation.js';
import { createUser, login, logout } from '../controllers/users.js';
import ResourceUnavalableError from '../errors/ResourceUnavailableError.js';
import express from 'express';

const router = express.Router();

router.post('/signin', loginValidation, login);
router.post('/signup', signupValidation, createUser);
router.delete('/signout', auth, logout);
router.use('/users', auth, userRoute);
router.use('/posts', auth, postRoute);
router.use('/', auth);
router.use('*', (req, res, next) => {
  next(new ResourceUnavalableError('Запрашиваемый ресурс не найден'));
});

export default router;
