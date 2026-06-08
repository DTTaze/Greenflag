const multer = require("multer");
const CloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cấu hình lưu ảnh vào Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "avatars",
    allowed_formats: ["jpg", "png", "jpeg", "gif"],
  },
});

const middlewareAvatar = multer({ storage });

module.exports = middlewareAvatar;
