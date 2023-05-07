import userRoute from './users.js';
import postRoute from './posts.js';
import auth from '../middlewares/auth.js';
import { loginValidation, signupValidation } from '../middlewares/validation.js';
import { createUser, login, logout } from '../controllers/users.js';
import ResourceUnavalableError from '../errors/ResourceUnavailableError.js';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger/output.json' assert { type: 'json' };

const router = express.Router();

router.use('/api-docs', swaggerUi.serve);
router.get('/api-docs', swaggerUi.setup(swaggerDocument));
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
