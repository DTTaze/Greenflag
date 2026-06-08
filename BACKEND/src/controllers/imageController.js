const imageService = require("../services/imageService.js");

const handleUploadImage = async (req, res) => {
  const files = req.files;
  const { reference_id, reference_type } = req.body;

  if (!files || files.length === 0) {
    return res.error(400, "No files uploaded");
  }

  if (!reference_id || !reference_type) {
    return res.error(400, "Missing reference_id or reference_type");
  }

  const validTypes = ["avatar", "taskSubmit"];
  if (!validTypes.includes(reference_type)) {
    return res.error(400, "Invalid reference_type");
  }

  const images = await imageService.uploadImages(files, reference_id, reference_type);
  return res.success("Images uploaded successfully", images);
};

const handleGetImageById = async (req, res) => {
  const id = req.params.id;
  const image = await imageService.getImageById(id);
  return res.success("Image found", image);
};

const handleGetAllImages = async (req, res) => {
  const images = await imageService.getAllImages();
  return res.success("Images found", images);
};

const handleUpdateImage = async (req, res) => {
  const id = req.params.id;
  const { file } = req;

  if (!file) {
    return res.error(400, "No file uploaded");
  }

  const image = await imageService.updateImage(id, file);
  return res.success("Image updated successfully", image);
};

const handleDeleteImage = async (req, res) => {
  const id = req.params.id;
  const result = await imageService.deleteImage(id);
  return res.success("Image deleted successfully", result);
};

module.exports = {
  handleUploadImage,
  handleGetImageById,
  handleGetAllImages,
  handleUpdateImage,
  handleDeleteImage,
};
