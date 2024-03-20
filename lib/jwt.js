const jwt = require("jsonwebtoken");
const privateKey = process.env.JWT_SECRET_KEY;

const expireIn = 60 * 60 * 1

function sign(payload) {
    return jwt.sign(payload, privateKey, {expiresIn: expireIn});
}

function decode(token) {
    return jwt.verify(token, privateKey);
}

module.exports = { sign, privateKey, decode };