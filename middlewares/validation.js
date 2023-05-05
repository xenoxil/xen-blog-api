const { celebrate, Joi } = require('celebrate');
const validator = require('validator');
const { ObjectId } = require('mongoose').Types;

const date = new Date();
const currentYear = date.getFullYear();

/* const russianLanguage = /^[А-Яа-я0-9]+$/;

const englishLanguage = /^[\w:]+$/; */

// валидация данных при логине
module.exports.loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isEmail(value)) {
          return value;
        }
        return helpers.message('Поле "email" должно быть валидным email-адресом');
      })
      .messages({
        'string.required': 'Поле "email" должно быть заполнено',
      }),
    password: Joi.string().required().min(8).messages({
      'string.required': 'Поле "Password" должно быть заполнено',
      'string.min': 'Поле пароль должно быть не меньше 8 символов',
    }),
  }),
});

// валидация данных при регистрации
module.exports.signupValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.required': 'Поле "name" должно быть заполнено',
    }),
    email: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isEmail(value)) {
          return value;
        }
        return helpers.message('Поле "email" должно быть валидным email-адресом');
      })
      .messages({
        'string.required': 'Поле "email" должно быть заполнено',
      }),
    password: Joi.string().required().min(8).messages({
      'string.required': 'Поле "Password" должно быть заполнено',
      'string.min': 'Поле пароль должно быть не меньше 8 символов',
    }),
  }),
});

// валидация данных пользователя
module.exports.userValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30).messages({
      'string.required': 'Поле "name" должно быть заполнено',
    }),
    email: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isEmail(value)) {
          return value;
        }
        return helpers.message('Поле "email" должно быть валидным email-адресом');
      })
      .messages({
        'string.required': 'Поле "email" должно быть заполнено',
      }),
  }),
});

module.exports.movieIdValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string()
      .alphanum()
      .custom((value, helpers) => {
        if (ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message('Невалидный id');
      }),
  }),
});

module.exports.postValidation = celebrate({
  body: Joi.object().keys({
    date: Joi.date().required().messages({
      'number.required': 'Поле "date" обязательно',
    }),
    message: Joi.string().required().min(2).max(4000).messages({
      'string.required': 'Поле "сообщение" обязательно',
    }),
    image: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value, { require_protocol: true })) {
          return value;
        }
        return helpers.message('Поле "Постер" должно быть валидным url-адресом');
      })
      .messages({
        'string.required': 'Поле "Постер" должно быть заполнено',
      }),
    movieId: Joi.number().required().integer().positive().messages({
      'number.integer': 'Поле "movieId" должно быть целочисленным',
      'number.required': 'Поле "movieId" должно быть заполнено',
      'number.positive': 'Поле "movieId" должно быть положительным',
    }),
    trailer: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value, { require_protocol: true })) {
          return value;
        }
        return helpers.message('Поле "Трейлер" должно быть валидным url-адресом');
      })
      .messages({
        'string.required': 'Поле "Трейлер" должно быть заполнено',
      }),
    thumbnail: Joi.string()
      .required()
      .custom((value, helpers) => {
        if (validator.isURL(value, { require_protocol: true })) {
          return value;
        }
        return helpers.message(
          'Поле "Миниатюрное изображение постера" должно быть валидным url-адресом',
        );
      })
      .messages({
        'string.required': 'Поле "Миниатюрное изображение постера" должно быть заполнено',
      }),
    nameRU: Joi.string().required().min(2).max(100).messages({
      'string.min': 'Поле "Русское название" должно быть длиннее 2 символов',
      'string.required': 'Поле "Русское название" обязательно',
      'string.max': 'Поле "Русское название" должно быть не длиннее 100 символов',
    }),
    nameEN: Joi.string().required().min(2).max(100).messages({
      'string.min': 'Поле "Английское название" должно быть длиннее 2 символов',
      'string.required': 'Поле "Английское название" обязательно',
      'string.max': 'Поле "Английское название" должно состоять только из английских букв и цифр',
    }),
  }),
});
