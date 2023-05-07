import userRoute from './users.js';
import postRoute from './posts.js';
import auth from '../middlewares/auth.js';
import { loginValidation, signupValidation } from '../middlewares/validation.js';
import { createUser, login, logout } from '../controllers/users.js';
import ResourceUnavalableError from '../errors/ResourceUnavailableError.js';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
// import swaggerDocument from '../swagger/output.json' assert { type: 'json' };
import fs from 'fs';
const router = express.Router();

// const swaggerFile = JSON.parse(fs.readFileSync('./swagger/output.json'));

// router.use('/api-doc', swaggerUi.serve);
// router.get('/api-doc', swaggerUi.setup(swaggerFile));
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
