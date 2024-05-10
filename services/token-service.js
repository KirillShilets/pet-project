const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model.js');
const userModel = require('../models/user-model.js');

class TokenService {
    generateToken(payload) {
        const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, {
            expiresIn: '24h',
        });
        return { accessToken };
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (err) {
            return null;
        }
    }

    async saveToken(userId, accessToken) {
        const tokenData = await tokenModel.findOne({
            where: { user_id: userId },
        });

        if (tokenData) {
            tokenData.accessToken = accessToken;
            await tokenData.save();
            return tokenData;
        }

        const token = await tokenModel.create({ user_id: userId, accessToken });
        return token;
    }
}

module.exports = new TokenService();
