require("dotenv").config();
const passport = require("../modules/passport");
const { ErrorResponse } = require("../utils/respons");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authenticate = passport.authenticate("jwt", { session: false });

const authorization = (req, res, next) => {
  try {
    const admin = req.user.is_admin;
    if (!admin) {
      const response = new ErrorResponse("You Not Admin", 401);
      return res.status(401).json(response);
    }
    next();
  } catch (error) {
    next(error);
  }
};

const getUserFromToken = (token) => {
  try {
    const splitToken = token.split(" ");
    if (splitToken.length === 2 ) {
      token = splitToken[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      return decoded;
    }
  } catch (error) {
    return null
  }
};

module.exports = { authenticate, authorization, getUserFromToken };
