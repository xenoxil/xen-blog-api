import mongoose from 'mongoose';
import validator from 'validator';

const userSchema = new mongoose.Schema({
  name: {
    type: String, // имя — это строка
    minlength: 2, // минимальная длина имени — 2 символа
    maxlength: 30, // а максимальная — 30 символов
  },
  email: {
    type: String,
    required: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: 'Поле email должно быть валидным email-адресом',
    },
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
});

export default mongoose.model('user', userSchema);
