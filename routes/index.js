const router = require('express').Router();
const userRoute = require('./users');
const postRoute = require('./posts');
const auth = require('../middlewares/auth');
const { loginValidation, signupValidation } = require('../middlewares/validation');
const { createUser, login, logout } = require('../controllers/users');
const ResourceUnavalableError = require('../errors/ResourceUnavailableError');

router.post('/signin', loginValidation, login);
router.post('/signup', signupValidation, createUser);
router.delete('/signout', auth, logout);
router.use('/users', auth, userRoute);
router.use('/posts', auth, postRoute);
router.use('/', auth);
router.use('*', (req, res, next) => {
  next(new ResourceUnavalableError('Запрашиваемый ресурс не найден'));
});

module.exports = router;
