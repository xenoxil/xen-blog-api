const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Users = require('../models/user');

const { NODE_ENV, JWT_SECRET } = process.env;

const ResourceUnavailableError = require('../errors/ResourceUnavailableError');
const AuthorizationError = require('../errors/AuthorizationError');
const BadRequestError = require('../errors/BadRequestError');
const NotUniqueEmailError = require('../errors/NotUniqueEmailError');

// получаем информацию о текущем пользователе
module.exports.getMyInfo = (req, res, next) => {
  Users.findById(req.user._id)
    .orFail(() => {
      next(new ResourceUnavailableError('Запрашиваемый пользователь не найден'));
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
};

// логин пользователя
module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  Users.findOne({ email })
    .select('+password')
    .then((user) => {
      req.body = user;
      if (user) {
        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            next(new AuthorizationError('Неправильные почта или пароль'));
          } else {
            const token = jwt.sign(
              { _id: user._id },
              NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret',
              {
                expiresIn: '7d',
              },
            );
            res
              .cookie('xenBlogApiToken', token, {
                maxAge: 604800000,
                httpOnly: true,
                sameSite: 'none',
                secure: true,
              })
              .send({ _id: req.body._id });
          }
        });
      }
      return next(new AuthorizationError('Неправильные почта или пароль'));
    })
    .catch((err) => {
      if (err.kind === 'ObjectId') {
        next(new BadRequestError('Не корректный id пользователя'));
      } else {
        next(err);
      }
    });
};

// логаут пользователя
module.exports.logout = (req, res) => {
  res
    .clearCookie('xenBlogApiToken', { httpOnly: true, sameSite: 'none', secure: true })
    .status(200)
    .send({ message: 'Куки токен удалён' });
};

// создать пользователя
module.exports.createUser = (req, res, next) => {
  const { name, email, password } = req.body;
  Users.findOne({ email })
    .then((user) => {
      if (user) {
        next(new NotUniqueEmailError('Такой email уже зарегистрирован'));
      } else {
        bcrypt
          .hash(password, 10)
          .then((hash) => Users.create({ name, email, password: hash }))
          .then((newUser) => {
            res.send({
              data: { name: newUser.name, email: newUser.email },
            });
          });
      }
    })
    .catch((err) => {
      if (err._message === 'user validation failed') {
        next(new BadRequestError('Данные пользователя не валидны'));
      } else {
        next(err);
      }
    });
};
