const jwt = require('jsonwebtoken');

function createToken(user_id, maxAge = 60 * 60 * 1) { //1일 후 만료 토큰 발급
    return jwt.sign(user_id, process.env.JWT_SECRET || "MyJWT", {
        expiresIn: maxAge,
    });
}

function verifyToken(_token) {
    if (!_token) {
        return null;
    }
    try {
        return jwt.verify(_token, process.env.JWT_SECRET || "MyJWT");
    } catch (err) {
        console.error('Token verification error:', err);
        return null; // 토큰이 유효하지 않은 경우 null 반환
    }
}

async function authenticate(req, res, next) {
    try {
        let token = req.cookies['auth-token'];
        let headerToken = req.headers.authorization;
        if (!token && headerToken) {
            token = headerToken.split(" ")[1];
        }
        if (!token) {
            const error = new Error("Authorization Null");
            error.status = 403;
            return next(error);
        }
        const user = verifyToken(token);
        req.user = user;
        if (!user) {
            const error = new Error("Authorization Failed");
            error.status = 403;
            return next(error);
        }
        next();
    } catch (err) {
        console.error(err);
    }
}

module.exports = { createToken, verifyToken, authenticate };