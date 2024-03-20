const { Users, User_Details } = require("../models");
const fs = require("fs");
const bcrypt = require("bcrypt");

const { SuccessResponse, ErrorResponse } = require("../utils/respons");
// const { sendEmail } = require("../modules/sendinblue");
const { randomToken } = require("../utils/uuid");
const { formatEmail } = require("../utils/emailValidation");
const { sign, decode } = require("../lib/jwt");

//login
async function login (req, res, next) {
  try {
    const { email, password } = req.body;

    //cekUser
    const user = await Users.findOne({ where: { email } });
    let userData = {
      id: user.dataValues.id,
      email: user.dataValues.email,
      verify: user.dataValues.verify,

    }
    const token = sign (userData)
    if (!user) {
      const response = new ErrorResponse("Email Not Found!", 404);
      return res.status(404).json(response);
    } else if(user) {
      return res.status(200).json({ message: "Success", token: token })
    }

    // else if (user.verify === false) {
    //   const response = new ErrorResponse("Please Verify Your Email!", 400);
    //   return res.status(400).json(response);
    // }

    //cek password
    const cekPassword = await bcrypt.compare(password, user.password);
    if (cekPassword) {

      const response = new SuccessResponse("Login Succcess! 👏", 200,)

      return res.status(200).json(response);
    } else {
      const response = new ErrorResponse("Incorrect Password! 👎", 401);
      return res.status(401).json(response);
    }

  } catch (error) {
    next(error);
  }
}




// //view verifyEmail
// const viewVerify = fs.readFileSync("view/email/verifyEmail.html", "utf8");

async function register(req, res, next) {
  try {
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      address,
      city,
      postal_code,
      country_code,
      verify,
    } = req.body;

    if (!email || !password) {
      return res.status(400).json(new ErrorResponse("Input Email & Password", 400));
    }

    //ceking format email 
    if (formatEmail(email) === false) {
      return res.status(400).json(new ErrorResponse("Invalid email format", 400));
    }

    //find email
    const cekEmail = await Users.findOne({ where: { email } });
    if (cekEmail) {
      return res.status(409).json(new ErrorResponse("Email Already Exist!", 409));
    }
    //hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = await Users.create({
      first_name,
      last_name,
      email,
      phone,
      verify,
      password: hashedPassword,
      token_verify: randomToken(),
    });
    await User_Details.create({
      user_id: user.id,
      address: address || null,
      city: city || null,
      postal_code: postal_code || null,
      country_code: country_code || null,
    }).then(response => {
      console.log(response)
      // return res.redirect('/login')
      return res.json({succes: true, message: "Registrasi Berhasil"})
  })

    // //link verification
    // const verificationLink = `http://localhost:1990/verify/v1?token=${user.token_verify}`;

    // //view verifikasi to email
    // const htmlContent = viewVerify.replace(
    //   "{{verificationLink}}",
    //   verificationLink
    // );

    // //send email
    // await sendEmail(email, {
    //   subject: "Verification Link ✔︎",
    //   htmlContent: htmlContent,
    // });

    // return res
    //   .status(200)
    //   .json(
    //     new SuccessResponse("Cek Your Email For Verify!!", 200, {
    //       name: first_name,
    //       email,
    //     })
    //   );
  } catch (error) {
    console.log(error)
        return res.status(500).json({succes: false, error: error.message, message: "Terjadi kesalahan saat register"})
    // next(error);
  }
}

// async function verifyEmail(req, res, next) {
//   try {
//     const { token } = req.query;

//     const user = await Users.findOne({
//       where: {
//         token_verify: token,
//       },
//       attributes: ["id"],
//     });

//     if (!user) {
//       const response = new ErrorResponse("Token Not Valid 👎", 404);
//       return res.status(404).json(response);
//     }
//     user.verify = true;
//     user.token_verify = null;
//     user.save();

//     const response = new SuccessResponse("Email Veerified 🎉🎉🎉", 200, user);
//     return res.status(200).json(response);
//   } catch (error) {
//     next(error);
//   }
// }

// module.exports = { register, login, verifyEmail };
module.exports = { login, register };
