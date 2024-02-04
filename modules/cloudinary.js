require('dotenv').config()
const cloudinary = require('cloudinary')
const fs = require("fs");
const {CLOUDINARY_NAME, CLOUDINARY_API_KEY ,CLOUDINARY_API_SECRET} = process.env


cloudinary.config({
  cloud_name: CLOUDINARY_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

async function uploadCloudinary(filePath) {
  let result;
  try {
    result = await cloudinary.uploader.upload(filePath, {
      use_filename: true,
    });
    fs.unlinkSync(filePath)
    return result.url;
  } catch (err) {
    fs.unlinkSync(filePath)
    return null;
  }
}

module.exports = { uploadCloudinary };