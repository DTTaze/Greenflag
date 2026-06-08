const multer = require("multer");
const CloudinaryStorage = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Cấu hình lưu ảnh vào Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "images", // Thư mục lưu ảnh
    resource_type: "image", // Chỉ nhận ảnh
    allowed_formats: ["jpg", "png", "jpeg", "gif"], // Định dạng ảnh hợp lệ
  },
});

const uploadImage = multer({ storage });

module.exports = uploadImage;
