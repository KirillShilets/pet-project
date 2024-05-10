const Router = require('express').Router;
const router = new Router();
const { body } = require('express-validator');
const userController = require('../controllers/user-controller.js');
const authMiddleware = require('../middlewares/auth-middleware.js');

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
router.post('/logout', authMiddleware, userController.logout);

module.exports = router;
