const qrService = require("../services/qrService");

const handleCreateQR = async (req, res) => {
  const { text } = req.query;
  if (!text) return res.error(400, "Missing text query!");
  const result = await qrService.createQR(text);
  return res.success("Created QR successfully!", result);
};

module.exports = { handleCreateQR };
