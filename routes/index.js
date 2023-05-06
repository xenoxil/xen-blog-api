const router = require('express').Router();
const userRoute = require('./users');
const postRoute = require('./posts');
const auth = require('../middlewares/auth');
const { loginValidation, signupValidation } = require('../middlewares/validation');
const { createUser, login, logout } = require('../controllers/users');
const ResourceUnavalableError = require('../errors/ResourceUnavailableError');

router.post(
  // описание роута
  // #swagger.description = 'Get all todos'
  // возвращаемый ответ
  /* #swagger.responses[200] = {
     // описание ответа
     description: 'Array of all todos',
     // схема ответа - ссылка на модель
     schema: { $ref: '#/definitions/Todos' }
 } */
  '/signin',
  loginValidation,
  login,
);
router.post('/signup', signupValidation, createUser);
router.delete('/signout', auth, logout);
router.use('/users', auth, userRoute);
router.use('/posts', auth, postRoute);
router.use('/', auth);
router.use('*', (req, res, next) => {
  next(new ResourceUnavalableError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
