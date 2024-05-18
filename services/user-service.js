const bcrypt = require('bcrypt');
const db = require('../db.js');
const UserModel = require('../models/user-model.js');
const tokenService = require('./token-service.js');
const userDto = require('../userDto/user-dto.js');
const ApiError = require('../exceptions/api-error.js');

class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({ where: { email } });
        if (candidate) {
            throw ApiError.BadRequest('Пользователь уже зарегистрирован');
        }

        const hashPassword = await bcrypt.hash(password, 4);

        await db.query(
            'INSERT INTO users(email,password) values ($1,$2) RETURNING *',
            [email, hashPassword]
        );

        return { ...tokenService, user: userDto };
    }

    async login(email, password) {
        const user = await UserModel.findOne({ where: { email } });
        if (!user) {
            throw ApiError.BadRequest(
                'Пользователь по такому email не зарегистрирован'
            );
        }

        const passEquals = await bcrypt.compare(password, user.password);
        if (!passEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }

        const token = tokenService.generateToken({ ...userDto });
        return token;
    }

    async logout(accessToken) {
        const token = await TokenModel.destroy({
            where: { accessToken: accessToken },
        });
        return token;
    }

    async getProfileInfo(email) {
        const userProfile = await UserModel.findOne({ where: { email } });
        if (!userProfile) {
            throw ApiError.UnauthorizedError();
        }

        return { id: userProfile.id, email: email };
    }

    async uploadPhoto(userPhoto) {
        if (userPhoto) {
            const fileName = userPhoto.filename;
            await db.query(
                `INSERT INTO images(image_name) values ($1) RETURNING *`,
                [fileName]
            );
        } else {
            throw ApiError.BadRequest('Ошибка с файлом');
        }
    }
}

module.exports = new UserService();
