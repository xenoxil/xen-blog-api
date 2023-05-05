const Posts = require('../models/post');
const Users = require('../models/user');
const ResourceUnavailableError = require('../errors/ResourceUnavailableError');
const BadRequestError = require('../errors/BadRequestError');
const PermissionError = require('../errors/PermissionError');

//  получаем список всех фильмов сохранённых пользователем
module.exports.getPostsWithPagination = (req, res, next) => {
  const myCustomLabels = {
    totalDocs: 'postsCount',
    limit: 'perPage',
    page: 'currentPage',
    totalPages: 'totalPages',
  };
  const { page = Math.max(req.query.page || 1, 1) } = req.query;
  Posts.paginate({}, { page, limit: 20, customLabels: myCustomLabels })
    .then((posts) => {
      res.send({ posts: posts });
    })
    .catch(next);
};

// создаём пост
module.exports.createBlogPost = (req, res, next) => {
  const { date, message } = req.body;
  Users.findById(req.user._id)
    .then((user) => {
      Posts.create({
        date,
        message,
        owner: user,
      }).then((record) => {
        res.send(record);
      });
    })
    .catch((err) => {
      console.log(err);
      if (err._message === 'post validation failed') {
        next(new BadRequestError('Данные поста не валидны'));
      } else {
        next(err);
      }
    });
};

// обновляем пост
module.exports.updatePost = (req, res, next) => {
  const { date, message, authorId, postId } = req.body;
  if (req.user._id !== authorId) {
    next(new PermissionError('Ошибка. Пользователь не является автором данного поста'));
  }
  Users.findById(req.user._id)
    .then((user) => {
      Posts.findByIdAndUpdate(postId, {
        date,
        message,
        author: user,
      }).then((record) => {
        res.send(record);
      });
    })
    .catch((err) => {
      console.log(err);
      if (err._message === 'post validation failed') {
        next(new BadRequestError('Данные поста не валидны'));
      } else {
        next(err);
      }
    });
};

module.exports.deletePost = (req, res, next) => {
  const { authorId, postId } = req.body;
  Posts.findById(postId)
    .orFail(() => {
      next(new ResourceUnavailableError('Пост не найден'));
    })
    .then((post) => {
      if (post.owner.id === authorId) {
        Posts.findByIdAndRemove(req.params.postId)

          .then((deletedPost) => res.send({ data: deletedPost }))
          .catch((err) => {
            if (err.kind === 'ObjectId') {
              next(new BadRequestError('Не корректный id поста'));
            } else {
              next(err);
            }
          });
      } else {
        next(new PermissionError('Ошибка. Пользователь не является автором данного поста'));
      }
    });
};
