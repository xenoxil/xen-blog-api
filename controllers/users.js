import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Users from '../models/user.js';
import ResourceUnavailableError from '../errors/ResourceUnavailableError.js';
import AuthorizationError from '../errors/AuthorizationError.js';
import BadRequestError from '../errors/BadRequestError.js';
import NotUniqueEmailError from '../errors/NotUniqueEmailError.js';

const { NODE_ENV, JWT_SECRET } = process.env;

// const { sign } = jsonwebtoken;

// получаем информацию о текущем пользователе
export function getMyInfo(req, res, next) {
  Users.findById(req.user._id)
    .orFail(() => {
      next(new ResourceUnavailableError('Запрашиваемый пользователь не найден'));
    })
    .then((user) => {
      res.send({ data: user });
    })
    .catch(next);
}

// логин пользователя
export function login(req, res, next) {
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
}

// логаут пользователя
export function logout(req, res) {
  res
    .clearCookie('xenBlogApiToken', { httpOnly: true, sameSite: 'none', secure: true })
    .status(200)
    .send({ message: 'Куки токен удалён' });
}

// создать пользователя
export function createUser(req, res, next) {
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
}
