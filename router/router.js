const Router = require('express').Router;
const router = new Router();
const { body } = require('express-validator');
const userController = require('../controllers/user-controller.js');
const authMiddleware = require('../middlewares/auth-middleware.js');
const fileMiddleware = require('../middlewares/file-middleware.js');

router.post(
    '/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 8, max: 32 }),
    userController.registration
);
router.post(
    '/login',
    body('email').isEmail(),
    body('password').isLength({ min: 8, max: 32 }),
    userController.login
);
router.get('/profile', authMiddleware, userController.getProfileInfo);
router.post(
    '/profile',
    authMiddleware,
    fileMiddleware.single('avatar'),
    userController.uploadPhoto
);
router.get('/uploads/:filename', authMiddleware, userController.getAvatar);
router.post('/logout', authMiddleware, userController.logout);

module.exports = router;
