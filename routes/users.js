const router = require('express').Router();
const { userValidation } = require('../middlewares/validation');
const { getMyInfo, updateUser } = require('../controllers/users');

router.get('/me', getMyInfo);
router.patch('/me', userValidation, updateUser);

module.exports = router;
