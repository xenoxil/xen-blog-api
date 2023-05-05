const mongoose = require('mongoose');
const validator = require('validator');
const mongoosePaginate = require('mongoose-paginate-v2');

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
  postId: {
    type: Number,
    required: true, // обязательное поле
  },
});
postSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('post', postSchema);

postSchema.paginate().then({});
