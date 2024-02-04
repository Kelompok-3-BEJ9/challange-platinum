const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "INI RAHASIA";

async function verifyAccesToken(req, res, next) {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({
        status: 401,
        error: "TOKEN NOT FOUND!!",
      });
    }
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // di bawa ke api lainnya
    next();
  } catch (err) {
    next(err);
  }
}


module.exports = { verifyAccesToken };
