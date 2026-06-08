const { nanoid } = require("nanoid");
const db = require("../models/index");
const Product = db.Product;
const User = db.User;
const Image = db.Image;
const { uploadImages } = require("../services/imageService");
const { sequelize } = require("../models");
const { getCache, setCache, deleteCache } = require("../utils/cache");
const { CACHE_KEYS, CACHE_TTL } = require("../constants/cacheKeys");
const { PRODUCT_POST_STATUS } = require("../constants/productStatus");
const { destroyImagesByReference } = require("../helpers/imageHelper");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const AppError = require("../errors/AppError");

const createProduct = async (productData, user_id, images) => {
  try {
    if (
      !productData.name ||
      !productData.price ||
      !productData.stock ||
      !productData.category ||
      !productData.product_status
    ) {
      throw new BadRequestError(
        "Missing required fields (name, price, stock, category, product_status)",
      );
    }

    if (Number(productData.price) < 1) {
      throw new BadRequestError("Price must be at least 1");
    }

    if (Number(productData.stock) < 1) {
      throw new BadRequestError("Stock must be at least 1");
    }

    const result = await sequelize.transaction(async (t) => {
      let productFormat;
      const newProduct = await Product.create(
        {
          public_id: nanoid(),
          name: productData.name,
          price: productData.price,
          stock: productData.stock,
          description: productData.description,
          seller_id: user_id,
          category: productData.category,
          product_status: productData.product_status,
        },
        { transaction: t },
      );

      if (images && images.length > 0) {
        const uploadedImages = await uploadImages(images, newProduct.id, "product");
        if (uploadedImages.length === 0) {
          throw new AppError("Failed to upload images", 500);
        }
        productFormat = {
          ...newProduct.toJSON(),
          imagesId: uploadedImages.map((img) => img.id),
        };
      } else {
        productFormat = {
          ...newProduct.toJSON(),
          imagesId: [],
        };
      }

      await setCache(
        CACHE_KEYS.COMMERCE.PRODUCT_BY_ID(newProduct.id),
        productFormat,
        CACHE_TTL.ONE_HOUR,
      );
      await setCache(
        CACHE_KEYS.COMMERCE.PRODUCT_BY_PUBLIC_ID(newProduct.public_id),
        newProduct.id,
        CACHE_TTL.ONE_HOUR,
      );
      const cachedProductIds = await getCache(CACHE_KEYS.COMMERCE.ALL_PRODUCTS);
      if (cachedProductIds) {
        const productIds = cachedProductIds || [];
        productIds.push(newProduct.id);
        await setCache(CACHE_KEYS.COMMERCE.ALL_PRODUCTS, productIds, CACHE_TTL.ONE_HOUR);
      }

      return newProduct;
    });

    return result;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

const getImagesFromListOfIds = async (imagesId) => {
  try {
    let images = [];
    for (const imageId of imagesId) {
      const cacheImage = await getCache(CACHE_KEYS.SYSTEM.IMAGE_BY_ID(imageId));
      if (cacheImage) {
        images.push(cacheImage);
        continue;
      }
      const image = await Image.findByPk(imageId);
      if (image) {
        images.push(image);
        await setCache(CACHE_KEYS.SYSTEM.IMAGE_BY_ID(imageId), image, CACHE_TTL.ONE_HOUR);
      }
    }
    const imagesByProductId = images.reduce((acc, image) => {
      if (!acc[image.reference_id]) acc[image.reference_id] = [];
      acc[image.reference_id].push(image.url);
      return acc;
    }, {});

    return imagesByProductId;
  } catch (error) {
    console.error("Error getting images from list of IDs:", error);
    throw error;
  }
};

const getSellerFromProduct = async (seller_id) => {
  try {
    const cacheUser = await getCache(CACHE_KEYS.IDENTITY.USER_BY_ID(seller_id));
    if (cacheUser) {
      const user = cacheUser;
      const userFormat = {
        id: seller_id,
        username: user.username,
      };
      return userFormat;
    }

    const user = await User.findByPk(seller_id, {
      attributes: ["id", "username"],
    });
    return user;
  } catch (error) {
    console.error("Error getting seller from product:", error);
    throw error;
  }
};

const getProductFromListOfIds = async (productIds) => {
  try {
    let products = [];
    for (const productId of productIds) {
      const cacheProduct = await getCache(CACHE_KEYS.COMMERCE.PRODUCT_BY_ID(productId));
      if (cacheProduct) {
        const product = cacheProduct;
        let imagesOfProduct;
        if (product.imagesId && product.imagesId.length > 0) {
          imagesOfProduct = await getImagesFromListOfIds(product.imagesId);
        }

        const user = await getSellerFromProduct(product.seller_id);
        let productFormat = {
          ...product,
          seller: user,
          images: (imagesOfProduct && imagesOfProduct[productId]) || [],
        };
        delete productFormat.imagesId;
        products.push(productFormat);
        continue;
      }

      const product = await Product.findByPk(productId);
      if (!product) {
        throw new NotFoundError("Product not found");
      }

      const seller = await getSellerFromProduct(product.seller_id);

      const imagesOfProduct = await Image.findAll({
        where: {
          reference_id: productId,
          reference_type: "product",
        },
      });

      const imagesByProductId = imagesOfProduct.reduce((acc, image) => {
        if (!acc[image.reference_id]) acc[image.reference_id] = [];
        acc[image.reference_id].push(image.url);
        return acc;
      }, {});

      let productFormat = {
        ...product.toJSON(),
        seller: seller,
        images: imagesByProductId[productId] || [],
      };
      products.push(productFormat);

      // Cache the product for future use
      let productFormatCache = {
        ...product.toJSON(),
        imagesId: imagesOfProduct.map((img) => img.id),
      };
      await setCache(
        CACHE_KEYS.COMMERCE.PRODUCT_BY_ID(productId),
        productFormatCache,
        CACHE_TTL.ONE_HOUR,
      );
    }

    return products.filter((product) => product !== null);
  } catch (error) {
    console.error("Error getting products from list of IDs:", error);
    throw error;
  }
};

const getAllProducts = async () => {
  const cachedProductIds = await getCache(CACHE_KEYS.COMMERCE.ALL_PRODUCTS);
  if (cachedProductIds) {
    const productIds = cachedProductIds;

    const totalProductsCount = await Product.count();
    if (productIds.length === totalProductsCount) {
      const products = await getProductFromListOfIds(productIds);
      return products.filter((product) => product !== null);
    } else {
      throw new AppError("Product IDs in cache do not match database count", 500);
    }
  }

  const products = await Product.findAll({
    include: [
      {
        as: "seller",
        model: User,
        attributes: ["id", "username"],
      },
    ],
  });
  const productIds = products.map((p) => p.id);

  const images = await Image.findAll({
    where: {
      reference_id: productIds,
      reference_type: "product",
    },
  });

  const imagesByProductId = images.reduce((acc, image) => {
    if (!acc[image.reference_id]) acc[image.reference_id] = [];
    acc[image.reference_id].push(image.url);
    return acc;
  }, {});

  const result = products.map((p) => ({
    ...p.toJSON(),
    images: imagesByProductId[p.id] || [],
  }));

  const productFormat = products.map((p) => ({
    ...p.toJSON(),
    imagesId: images.map((img) => img.id),
  }));

  await setCache(CACHE_KEYS.COMMERCE.ALL_PRODUCTS, productIds, CACHE_TTL.ONE_HOUR);
  await Promise.all(
    productFormat.map((product) =>
      setCache(CACHE_KEYS.COMMERCE.PRODUCT_BY_ID(product.id), product, CACHE_TTL.ONE_HOUR),
    ),
  );

  return result;
};

const getAllAvailableProducts = async () => {
  const products = await getAllProducts();
  const availableProducts = products.filter(
    (product) => product.post_status === PRODUCT_POST_STATUS.PUBLIC,
  );
  return availableProducts;
};

const getProductByIdUser = async (user_id) => {
  if (!user_id) throw new BadRequestError("User ID is required");

  const products = await getAllProducts();
  const userProducts = products.filter((product) => product.seller.id === user_id);
  if (userProducts.length === 0) {
    throw new NotFoundError("No products found for this seller");
  }
  return userProducts;
};

const updateProduct = async (product, data, images) => {
  let { name, price, description, post_status, category, product_status } = data;

  if (!product) throw new NotFoundError("Product not found");

  if (name) product.name = name;
  if (price !== undefined) product.price = price;
  if (description !== undefined) product.description = description;
  if (post_status) product.post_status = post_status;
  if (category) product.category = category;
  if (product_status) product.product_status = product_status;

  let uploadedImages = [];
  const id = product.id;
  if (images && images.length > 0) {
    await destroyImagesByReference(product.id, "product");

    const cacheProduct = await getCache(CACHE_KEYS.COMMERCE.PRODUCT_BY_ID(id));
    if (cacheProduct && cacheProduct.imagesId) {
      for (const imageId of cacheProduct.imagesId) {
        await deleteCache(CACHE_KEYS.SYSTEM.IMAGE_BY_ID(imageId));
      }
    }

    uploadedImages = await uploadImages(images, id, "product");
    if (!uploadedImages || uploadedImages.length === 0) {
      throw new AppError("Failed to upload images", 500);
    }
  }

  await product.save();

  const productFormat = {
    ...product.toJSON(),
    imagesId: uploadedImages.map((img) => img.id),
  };
  await setCache(CACHE_KEYS.COMMERCE.PRODUCT_BY_ID(id), productFormat, CACHE_TTL.ONE_HOUR);
  await setCache(
    CACHE_KEYS.COMMERCE.PRODUCT_BY_PUBLIC_ID(product.public_id),
    id,
    CACHE_TTL.ONE_HOUR,
  );

  const cachedProductIds = await getCache(CACHE_KEYS.COMMERCE.ALL_PRODUCTS);
  if (cachedProductIds) {
    const productIds = cachedProductIds;
    const index = productIds.indexOf(id);
    if (index !== -1) {
      productIds[index] = id;
      await setCache(CACHE_KEYS.COMMERCE.ALL_PRODUCTS, productIds, CACHE_TTL.ONE_HOUR);
    }
  }

  return {
    ...product.toJSON(),
    images: uploadedImages.map((img) => img.url),
  };
};

const updateProductById = async (id, data, images) => {
  const product = await Product.findByPk(id);
  const result = await updateProduct(product, data, images);
  return result;
};

const deleteProduct = async (product_id) => {
  if (!product_id) throw new BadRequestError("Product ID is required");

  const product = await Product.findByPk(product_id);
  if (!product) throw new NotFoundError("Product not found");

  const images = await destroyImagesByReference(product_id, "product");

  await deleteCache(CACHE_KEYS.COMMERCE.PRODUCT_BY_ID(product_id));
  await deleteCache(CACHE_KEYS.COMMERCE.PRODUCT_BY_PUBLIC_ID(product.public_id));
  for (const image of images) {
    await deleteCache(CACHE_KEYS.SYSTEM.IMAGE_BY_ID(image.id));
  }

  await product.destroy();

  const cachedProductIds = await getCache(CACHE_KEYS.COMMERCE.ALL_PRODUCTS);
  if (cachedProductIds) {
    const productIds = cachedProductIds;
    const index = productIds.indexOf(product_id);
    if (index !== -1) {
      productIds.splice(index, 1);
      await setCache(CACHE_KEYS.COMMERCE.ALL_PRODUCTS, productIds, CACHE_TTL.ONE_HOUR);
    }
  }

  return { message: "Product and associated images deleted successfully" };
};

const updateProductByPublicId = async (public_id, data, images) => {
  const product = await Product.findOne({ where: { public_id } });
  if (!product) throw new NotFoundError("Product not found");
  const result = await updateProduct(product, data, images);
  return result;
};

module.exports = {
  createProduct,
  getAllProducts,
  getProductByIdUser,
  updateProductById,
  updateProductByPublicId,
  deleteProduct,
  getAllAvailableProducts,
};
