require("dotenv").config();
const nodemailer = require("nodemailer");

const transort = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.USER_NODEMAILER,
    pass: process.env.PASS_NODEMAILER
  },
})

function sendEmail(to, html) {
  return transort.sendMail({
    from: {
      name: "Bingle_Shop",
      address: process.env.USER_NODEMAILER
    },
    to: to,
    subject: "Verify Email ✔︎",
    html: html
  })
}

module.exports = { sendEmail };