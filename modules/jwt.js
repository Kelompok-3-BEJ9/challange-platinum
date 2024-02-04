const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "INI RAHASIA"

function generateJwtToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
  };

  const expiredIn = 60 * 60 * 1;
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: expiredIn });

  return token;
}

module.exports = { generateJwtToken };
