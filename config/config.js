require("dotenv").config();


module.exports = {
  development: {
    username: process.env.user_name,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    host: process.env.HOST,
    dialect: process.env.DIALECT,
  },
};

console.log(process.env.user_name)