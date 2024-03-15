require('dotenv').config();
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Data pengguna yang akan dienkripsi dalam token
const userData = {
  email: "ksuryasedana@gmail.com",
  is_admin: true,
};

// Membuat token dengan menggunakan secret key (harus sama dengan yang digunakan dalam aplikasi Anda)
const dummyToken = jwt.sign(userData, JWT_SECRET, { expiresIn: '30d' });

module.exports = { dummyToken };
