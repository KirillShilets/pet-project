const userService = require('../services/user-service.js');
const { validationResult } = require('express-validator');
const ApiError = require('../exceptions/api-error.js');
const path = require('path');
const fs = require('fs');

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest('Ошибка валидации', errors.array())
                );
            }

            const { email, password } = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('accessToken', userData.accessToken, {
                maxAge: 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            return res.status(201).json({ message: 'Created' });
        } catch (err) {
            next(err);
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('accessToken', userData.accessToken, {
                maxAge: 1 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            });
            console.log(userData);
            return res.status(200).json({
                message: 'Пользователь успешно вошел в личный кабинет',
            });
        } catch (err) {
            next(err);
        }
    }

    async logout(req, res, next) {
        try {
            res.clearCookie('accessToken');
            return res.status(200).json({
                message: 'Пользователь успешно вышел из личного кабинета',
            });
        } catch (err) {
            next(err);
        }
    }

    async getProfileInfo(req, res, next) {
        try {
            const id = req.user.id;
            const userProfile = await userService.getProfileInfo(id);
            return res.json(userProfile);
        } catch (err) {
            next(err);
        }
    }

    async uploadPhoto(req, res, next) {
        try {
            await userService.uploadPhoto(req.file, req.user.id);
            res.send(req.file);
        } catch (err) {
            next(err);
        }
    }

    async getAvatar(req, res, next) {
        try {
            const imagesDirectory = path.join(__dirname, '../uploads');
            const filename = req.params.filename;

            const filePath = path.join(imagesDirectory, filename);

            if (!fs.existsSync(filePath)) {
                return res.status(404).json({ message: 'Файл не найден' });
            }

            res.sendFile(filePath);
        } catch (err) {
            next(err);
        }
    }
}

module.exports = new UserController();
