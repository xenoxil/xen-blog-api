// import { Schema, model } from 'mongoose';
import validator from 'validator';
import mongoosePaginate from 'mongoose-paginate-v2';
import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  message: {
    type: String, // имя — это строка
    required: true,
    minlength: 2, // минимальная длина имени — 2 символа
  },
  date: {
    type: Date,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true, // обязательное поле
    ref: 'user',
  },
});

postSchema.plugin(mongoosePaginate);

export default mongoose.model('post', postSchema);

// postSchema.paginate().then({});
