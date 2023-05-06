import jwt from 'jsonwebtoken';
import AuthorizationError from '../errors/AuthorizationError.js';

const { NODE_ENV, JWT_SECRET } = process.env;

export default (req, res, next) => {
  const token = req.cookies.xenBlogApiToken;
  if (!token) {
    next(new AuthorizationError('Необходима авторизация'));
  } else {
    let payload;

    try {
      payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
    } catch (err) {
      next(new AuthorizationError('Необходима авторизация'));
    }
    req.user = payload; // записываем пейлоуд в объект запроса
  }
  // пропускаем запрос дальше
  return next();
};
