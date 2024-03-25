require("dotenv").config();

const { Users, User_Details } = require("../models");
const fs = require("fs");
const bcrypt = require("bcrypt");

const { SuccessResponse, ErrorResponse } = require("../utils/respons");
const { sendEmail } = require("../modules/nodemailer");
const { randomToken } = require("../utils/uuid");
const { formatEmail } = require("../utils/emailValidation");
const { generateJwtToken } = require("../modules/jwt");

//** TEST FILE ONLY TESTING THE REGISTER AND LOGIN FUNCTION */
//view verifyEmail
const viewVerify = fs.readFileSync("view/email/verifyEmail.html", "utf8");

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
            password: hashedPassword,
            token_verify: randomToken(),
        });
        await User_Details.create({
            user_id: user.id,
            address: address || null,
            city: city || null,
            postal_code: postal_code || null,
            country_code: country_code || null,
        });

        //link verification
        const verificationLink = `${process.env.URL_SERVER}/verify/v1?token=${user.token_verify}`;

        //view verifikasi to email
        const htmlContent = viewVerify.replace("{{verificationLink}}", verificationLink);

        //send email
        sendEmail(email, htmlContent);

        return res.status(200).json(
            new SuccessResponse("Cek Your Email For Verify!!", 200, {
                name: first_name,
                email,
            })
        );
    } catch (error) {
        next(error);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        //cekUser
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            const response = new ErrorResponse("Email Not Found!", 404);
            return res.status(404).json(response);
        } else if (user.verify === false) {
            const response = new ErrorResponse("Please Verify Your Email!", 400);
            return res.status(400).json(response);
        }
        // Cek Password
        const cekPassword = await bcrypt.compare(password, user.password);
        if (cekPassword) {
            //create Token Jwt
            const token = generateJwtToken(user);

            const response = new SuccessResponse("Login Succcess! 👏", 200, {
                token: token,
                id: user.id,
            });

            return res.status(200).json(response);
        } else {
            const response = new ErrorResponse("Incorrect Password! 👎", 401);
            return res.status(401).json(response);
        }
    } catch (error) {
        next(error);
    }
}

//** FROM HERE TO BELOW DOESN'T INCLUDED IN TEST FILE */
async function updateAdmin(req, res, next) {
    try {
        const user_id = req.user.id;
        const updateAdmin = await Users.findOne({ where: user_id });

        if (!updateAdmin) {
            return res.status(404).json(new ErrorResponse("ID is not found!", 404));
        } else if (updateAdmin.is_admin == true) {
            return res.status(200).json(
                new SuccessResponse("ID is already an admin.", 200, {
                    is_admin: updateAdmin.is_admin,
                })
            );
        } else {
            updateAdmin.is_admin = true;
            await updateAdmin.save();
            return res.status(200).json(
                new SuccessResponse("ID is now an admin.", 200, {
                    is_admin: updateAdmin.is_admin,
                })
            );
        }
    } catch (error) {
        next(error);
    }
}

async function verifyEmail(req, res, next) {
    try {
        const { token } = req.query;

        const user = await Users.findOne({
            where: {
                token_verify: token,
            },
            attributes: ["id"],
        });

        if (!user) {
            const response = new ErrorResponse("Token Not Valid 👎", 404);
            return res.status(404).json(response);
        }
        user.verify = true;
        user.token_verify = null;
        user.save();

        const response = new SuccessResponse("Email Veerified 🎉🎉🎉", 200, user);
        return res.status(200).json(response);
    } catch (error) {
        next(error);
    }
}

module.exports = { register, login, verifyEmail, updateAdmin };
