const router = require('express').Router();
const { deleteMovie, saveMovie, getMyMovies } = require('../controllers/movies');
const { movieIdValidation, movieValidation } = require('../middlewares/validation');

router.get('/', getMyMovies);
router.post('/', movieValidation, saveMovie);
router.delete('/:movieId', movieIdValidation, deleteMovie);
module.exports = router;
