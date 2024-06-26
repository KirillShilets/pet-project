const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const jwt = require('jsonwebtoken');

class TokenService {
    generateToken(payload, userId, email) {
        const accessToken = jwt.sign(
            { ...payload, id: userId, email: email },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn: '24h',
            }
        );
        return { accessToken };
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            console.log('Мой userData', userData);
            return userData;
        } catch (err) {
            return null;
        }
    }
}

module.exports = new TokenService();
