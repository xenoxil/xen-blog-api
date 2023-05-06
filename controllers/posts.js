import Posts from '../models/post.js';
import Users from '../models/user.js';
import ResourceUnavailableError from '../errors/ResourceUnavailableError.js';
import BadRequestError from '../errors/BadRequestError.js';
import PermissionError from '../errors/PermissionError.js';

//  получаем список всех фильмов сохранённых пользователем
export function getPostsWithPagination(req, res, next) {
  const myCustomLabels = {
    totalDocs: 'totalPosts',
    limit: 'postsPerPage',
    page: 'currentPage',
    totalPages: 'totalPages',
  };
  const { page = Math.max(req.params.page || 1, 1) } = req.query;
  Posts.paginate({}, { page, limit: 20, customLabels: myCustomLabels })
    .then((posts) => {
      res.send({ posts: posts });
    })
    .catch(next);
}

// создаём пост
export function createPost(req, res, next) {
  const { message } = req.body;
  Users.findById(req.user._id)
    .then((user) => {
      Posts.create({
        date: new Date(),
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
}

// обновляем пост
export function updatePost(req, res, next) {
  const { message } = req.body;
  Users.findById(req.user._id)
    .then((user) => {
      Posts.findById(req.params.postId)
        .orFail(() => {
          next(new ResourceUnavailableError('Пост не найден'));
        })
        .then((record) => {
          if (req.user._id != record.owner) {
            next(new PermissionError('Ошибка. Пользователь не является автором данного поста'));
          } else {
            Posts.findByIdAndUpdate(
              req.params.postId,
              {
                date: record.date,
                message,
                owner: user,
              },
              { returnDocument: 'after' },
            ).then((newRecord) => {
              res.send(newRecord);
            });
          }
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
}

export function deletePost(req, res, next) {
  Posts.findById(req.params.postId)
    .orFail(() => {
      next(new ResourceUnavailableError('Пост не найден'));
    })
    .then((post) => {
      if (post.owner == req.user._id) {
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
}
