require("dotenv").config();
const passport = require("passport");
const { Strategy: JWTStrategy, ExtractJwt } = require("passport-jwt");
const JWT_SECRET = process.env.JWT_SECRET;


//JWT Auth
const options = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

function payloads(payload, done) {
  try {
    return done(null, payload);
  } catch (error) {
    done(error);
  }
}


// JWT Auth
passport.use(new JWTStrategy(options, payloads));

module.exports = passport;
