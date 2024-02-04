const { SuccessResponse, ErrorResponse } = require("../utils/respons");
const { Users, User_Details } = require("../models");
const bcrypt = require("bcrypt");

async function getAll(req, res, next) {
  try {
    const data = await Users.findAll({
      include: [
        {
          model: User_Details,
          as: "user_detail",
        },
      ],
    });
    res.status(200).json(new SuccessResponse("Get All Data Success!",200,data));
  } catch (error) {
    next(error);
  }
}
async function getOne(req, res, next) {
  try {
    // Find User
    const id = +req.params.id;

    //Include User Detail To User
    const user = await Users.findOne({
      where: { id },
      include: [{ model: User_Details, as: "user_detail" }],
    });
    if (!user) {
      res.status(404).json(new ErrorResponse("User Not Found",404))
    }
    res.status(200).json(new SuccessResponse("Get User Success",200,user))
  } catch (error) {
    next(error)
  }
}


async function update(req, res, next) {
  try {
    const id = +req.params.id;
    const {
      first_name,
      last_name,
      email,
      password,
      phone,
      address,
    } = req.body;

    const user = await Users.findOne({ where: { id } });

    if (!user) {
      const response = new ErrorResponse("USER NOT FOUND!",404)
      return res.status(404).json(response);
    }

    user.first_name = first_name || user.first_name;
    user.last_name = last_name || user.last_name;
    user.email = email || user.email;
    user.password = password ? await bcrypt.hash(password, 10) : user.password;
    user.phone = phone || user.phone;
    user.address = address || user.address;

    await user.save(); // Save the changes to the database

    const responseData = new SuccessResponse("USER UPDATE SUCCESS.", 200, user);

    res.status(200).json(responseData);
  } catch (error) {
    next(error);
  }
}

async function updateDetail(req, res, next) {
  try {
    const user_id = +req.params.user_id;

    const user = await User_Details.findOne({ where: { user_id } });

    if (!user) {
      const response = new ErrorResponse("USER NOT FOUND!", 404);
      return res.status(404).json(response);
    }

    const { address, city, postal_code, country_code } = req.body;

    // Update user details if provided in the request body
    user.address = address || user.address;
    user.city = city || user.city;
    user.postal_code = postal_code || user.postal_code;
    user.country_code = country_code || user.country_code;

    // Save the updated user details
    await user.save();

    const responseData = new SuccessResponse(
      "USER DETAILS UPDATE SUCCESS.",
      201,
      user
    );

    res.status(201).json(responseData);
  } catch (error) {
    next(error);
  }
}


async function deleted(req, res, next) {
  try {
    const id = +req.params.id;
    const user = await Users.findOne({
      where: {
        id,
      },
    });

    if (!user) {
      const response = new ErrorResponse("USER NOT FOUND or ALREADY DELETED.", 404)
      return res.status(404).json(response);
    }

    await Users.destroy({
      where: {
        id,
      },
    });

    const responses = new SuccessResponse("DELETE SUCCESS!", 200, null);
    res.status(200).json(responses);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAll,
  getOne,
  update,
  deleted,
  updateDetail,
};
