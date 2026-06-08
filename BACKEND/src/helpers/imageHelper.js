const db = require("../models/index");
const Image = db.Image;
const cloudinary = require("../config/cloudinary");

const destroyImagesByReference = async (referenceId, referenceType) => {
  const images = await Image.findAll({
    where: { reference_id: referenceId, reference_type: referenceType },
  });
  for (const image of images) {
    if (image.url) {
      const publicId = image.url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`images/${publicId}`);
    }
    await image.destroy();
  }
  return images;
};

module.exports = {
  destroyImagesByReference,
};
