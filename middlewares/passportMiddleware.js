const passport = require("passport");
const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");
const { privateKey } = require("../lib/jwt");

const options = {
    secretOrKey: privateKey,
    // jwtFromRequest: ExtractJwt.fromHeader("authorization")
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
};

function decode(payload, done) {
    done(null, payload)
}

passport.use(new JWTStrategy(options, decode));

module.exports = passport;
