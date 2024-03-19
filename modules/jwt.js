require("dotenv").config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET

function generateJwtToken(user) {
  const payload = {
    id: user.id,
    name: user.first_name,
    email: user.email,
    is_admin: user.is_admin
  };

  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1d" });

  return token;
}

module.exports = { generateJwtToken };
