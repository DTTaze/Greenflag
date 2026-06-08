const QRCode = require("qrcode");
const AppError = require("../errors/AppError");

const createQR = async (text) => {
  try {
    const qrImage = await QRCode.toDataURL(text);
    return qrImage;
  } catch (error) {
    throw new AppError("Failed to generate QR code: " + error.message, 500);
  }
};
module.exports = { createQR };
