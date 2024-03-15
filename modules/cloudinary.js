require("dotenv").config();
const cloudinary = require("cloudinary");
const fs = require("fs");
const { CLOUDINARY_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

cloudinary.config({
    cloud_name: CLOUDINARY_NAME,
    api_key: CLOUDINARY_API_KEY,
    api_secret: CLOUDINARY_API_SECRET,
});

async function uploadCloudinary(filePath) {
    let result;
    try {
        result = await cloudinary.uploader.upload(filePath, {
            use_fileName: true,
        });
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log(err);
            }
            console.log("File deleted successfully");
        });
        return result.url;
    } catch (err) {
        fs.unlink(filePath, (err) => {
            if (err) {
                console.log(err);
            }
            console.log("File deleted successfully");
        });
        console.log(err);
        return null;
    }
}

module.exports = { uploadCloudinary };
