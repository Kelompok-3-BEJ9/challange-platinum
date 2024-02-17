const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || "INI RAHASIA"

function generateJwtToken(user) {
  const payload = {
    id: user.id,
    email: user.email,
    is_admin: user.is_admin
  };

  const expiredIn = 30 * 24 * 60 * 60;
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: expiredIn });

  return token;
}

module.exports = { generateJwtToken };
