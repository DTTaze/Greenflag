const db = require("../models/index");
const Image = db.Image;
const cloudinary = require("../config/cloudinary");
const { getCache, setCache, deleteCache } = require("../utils/cache");
const { CACHE_KEYS } = require("../constants/cacheKeys");
const NotFoundError = require("../errors/NotFoundError");
const BadRequestError = require("../errors/BadRequestError");

const cacheImageId = (id) => CACHE_KEYS.SYSTEM.IMAGE_BY_ID(id);
const cacheImageAll = CACHE_KEYS.SYSTEM.ALL_IMAGES;

const uploadImages = async (files, reference_id, reference_type) => {
  if (!files || files.length === 0) throw new BadRequestError("No files provided");

  const uploadedImages = [];

  for (const file of files) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: "images",
    });

    const image = await Image.create({
      url: result.secure_url,
      reference_id,
      reference_type,
    });

    uploadedImages.push(image);
    await setCache(cacheImageId(image.id), image);
  }

  return uploadedImages;
};

const getImageById = async (id) => {
  const cached = await getCache(cacheImageId(id));
  if (cached) return cached;

  const image = await Image.findByPk(id);
  if (!image) throw new NotFoundError("Image not found");

  await setCache(cacheImageId(id), image);
  return image;
};

const getAllImages = async () => {
  const cached = await getCache(cacheImageAll);
  if (cached) return cached;

  const images = await Image.findAll();
  await setCache(cacheImageAll, images);
  return images;
};

const updateImage = async (id, file) => {
  const image = await Image.findByPk(id);
  if (!image) throw new NotFoundError("Image not found");

  if (image.url) {
    const publicId = image.url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`images/${publicId}`);
  }

  const result = await cloudinary.uploader.upload(file.path, {
    folder: "images",
  });

  image.url = result.secure_url;
  await image.save();
  await deleteCache(cacheImageId(image.id));
  await deleteCache(cacheImageAll);

  return image;
};

const deleteImage = async (id) => {
  const image = await Image.findByPk(id);
  if (!image) throw new NotFoundError("Image not found");

  if (image.url) {
    const publicId = image.url.split("/").pop().split(".")[0];
    await cloudinary.uploader.destroy(`images/${publicId}`);
  }

  await image.destroy();

  await deleteCache(cacheImageId(id));
  await deleteCache(cacheImageAll);

  return { message: "Image deleted successfully" };
};

const deleteImages = async (reference_id, reference_type) => {
  const images = await Image.findAll({
    where: { reference_id, reference_type },
  });

  const deletedUrls = [];

  for (const image of images) {
    if (image.url) {
      deletedUrls.push(image.url);
      const publicId = image.url.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`images/${publicId}`);
    }

    await deleteCache(cacheImageId(image.id));
    await image.destroy();
  }

  await deleteCache(cacheImageAll);

  return deletedUrls;
};

module.exports = {
  uploadImages,
  getImageById,
  getAllImages,
  updateImage,
  deleteImage,
  deleteImages,
};
