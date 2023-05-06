import { celebrate, Joi } from 'celebrate';
import validator from 'validator';
import mongoose from 'mongoose';
const { ObjectId } = mongoose.Types;

const date = new Date();
const currentYear = date.getFullYear();

export const loginValidation = celebrate({
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

export const signupValidation = celebrate({
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

export const userValidation = celebrate({
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

export const postIdValidation = celebrate({
  params: Joi.object().keys({
    postId: Joi.string()
      .alphanum()
      .custom((value, helpers) => {
        if (ObjectId.isValid(value)) {
          return value;
        }
        return helpers.message('Невалидный id');
      }),
  }),
});

export const postValidation = celebrate({
  body: Joi.object().keys({
    date: Joi.date().required().messages({
      'number.required': 'Поле "date" обязательно',
    }),
    message: Joi.string().required().min(2).max(4000).messages({
      'string.required': 'Поле "сообщение" обязательно',
    }),
    postId: Joi.number().required().integer().positive().messages({
      'number.integer': 'Поле "postId" должно быть целочисленным',
      'number.required': 'Поле "postId" должно быть заполнено',
      'number.positive': 'Поле "postId" должно быть положительным',
    }),
  }),
});
