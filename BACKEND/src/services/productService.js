const { nanoid } = require("nanoid");
const db = require("../models/index");
const productRepo = require("../repositories/productRepository");
const userRepo = require("../repositories/userRepository");
const imageRepo = require("../repositories/imageRepository");
const { uploadImages } = require("./imageService");
const { getCache, setCache, deleteCache } = require("../utils/cache");
const { CACHE_KEYS, CACHE_TTL } = require("../constants/cacheKeys");
const { PRODUCT_POST_STATUS } = require("../constants/productStatus");
const { destroyImagesByReference } = require("../helpers/imageHelper");
const BadRequestError = require("../errors/BadRequestError");
const NotFoundError = require("../errors/NotFoundError");
const AppError = require("../errors/AppError");

const createProduct = async (productData, user_id, images) => {
  const result = await db.sequelize.transaction(async (t) => {
    let productFormat;
    const newProduct = await productRepo.create(
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
    const newProductData = newProduct.get ? newProduct.get({ plain: true }) : newProduct;

    if (images && images.length > 0) {
      const uploadedImages = await uploadImages(images, newProductData.id, "product");
      if (uploadedImages.length === 0) {
        throw new AppError("Failed to upload images", 500);
      }
      productFormat = {
        ...newProductData,
        imagesId: uploadedImages.map((img) => img.id),
      };
    } else {
      productFormat = {
        ...newProductData,
        imagesId: [],
      };
    }

    await setCache(
      CACHE_KEYS.COMMERCE.PRODUCT_BY_ID(newProductData.id),
      productFormat,
      CACHE_TTL.ONE_HOUR,
    );
    await setCache(
      CACHE_KEYS.COMMERCE.PRODUCT_BY_PUBLIC_ID(newProductData.public_id),
      newProductData.id,
      CACHE_TTL.ONE_HOUR,
    );
    const cachedProductIds = await getCache(CACHE_KEYS.COMMERCE.ALL_PRODUCTS);
    if (cachedProductIds) {
      const productIds = cachedProductIds || [];
      productIds.push(newProductData.id);
      await setCache(CACHE_KEYS.COMMERCE.ALL_PRODUCTS, productIds, CACHE_TTL.ONE_HOUR);
    }

    return newProductData;
  });

  return result;
};

const getImagesFromListOfIds = async (imagesId) => {
  let images = [];
  for (const imageId of imagesId) {
    const cacheImage = await getCache(CACHE_KEYS.SYSTEM.IMAGE_BY_ID(imageId));
    if (cacheImage) {
      images.push(cacheImage);
      continue;
    }
    const image = await imageRepo.findById(imageId, { raw: true, nest: true });
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
};

const getSellerFromProduct = async (seller_id) => {
  const cacheUser = await getCache(CACHE_KEYS.IDENTITY.USER_BY_ID(seller_id));
  if (cacheUser) {
    return {
      id: seller_id,
      username: cacheUser.username,
    };
  }

  const user = await userRepo.findById(seller_id, {
    attributes: ["id", "username"],
    raw: true,
    nest: true,
  });
  return user;
};

const getProductFromListOfIds = async (productIds) => {
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

    const product = await productRepo.findById(productId, { raw: true, nest: true });
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    const seller = await getSellerFromProduct(product.seller_id);

    const imagesOfProduct = await imageRepo.findAll(
      {
        where: {
          reference_id: productId,
          reference_type: "product",
        },
      },
      { raw: true, nest: true },
    );

    const imagesByProductId = imagesOfProduct.reduce((acc, image) => {
      if (!acc[image.reference_id]) acc[image.reference_id] = [];
      acc[image.reference_id].push(image.url);
      return acc;
    }, {});

    let productFormat = {
      ...product,
      seller: seller,
      images: imagesByProductId[productId] || [],
    };
    products.push(productFormat);

    let productFormatCache = {
      ...product,
      imagesId: imagesOfProduct.map((img) => img.id),
    };
    await setCache(
      CACHE_KEYS.COMMERCE.PRODUCT_BY_ID(productId),
      productFormatCache,
      CACHE_TTL.ONE_HOUR,
    );
  }

  return products.filter((product) => product !== null);
};

const getAllProducts = async () => {
  const cachedProductIds = await getCache(CACHE_KEYS.COMMERCE.ALL_PRODUCTS);
  if (cachedProductIds) {
    const productIds = cachedProductIds;

    const totalProductsCount = await productRepo
      .findAll({}, { raw: true, nest: true })
      .then((list) => list.length);
    if (productIds.length === totalProductsCount) {
      const products = await getProductFromListOfIds(productIds);
      return products.filter((product) => product !== null);
    }
  }

  const products = await productRepo.findAll(
    {
      include: [
        {
          as: "seller",
          model: db.User,
          attributes: ["id", "username"],
        },
      ],
    },
    { raw: true, nest: true },
  );
  const productIds = products.map((p) => p.id);

  const images = await imageRepo.findAll(
    {
      where: {
        reference_id: productIds,
        reference_type: "product",
      },
    },
    { raw: true, nest: true },
  );

  const imagesByProductId = images.reduce((acc, image) => {
    if (!acc[image.reference_id]) acc[image.reference_id] = [];
    acc[image.reference_id].push(image.url);
    return acc;
  }, {});

  const result = products.map((p) => ({
    ...p,
    images: imagesByProductId[p.id] || [],
  }));

  const productFormat = products.map((p) => ({
    ...p,
    imagesId: images.filter((img) => img.reference_id === p.id).map((img) => img.id),
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
    (product) => product.product_status === PRODUCT_POST_STATUS.PUBLIC,
  );
  return availableProducts;
};

const getProductByIdUser = async (user_id) => {
  if (!user_id) throw new BadRequestError("User ID is required");

  const products = await getAllProducts();
  const userProducts = products.filter(
    (product) => product.seller && product.seller.id === user_id,
  );
  if (userProducts.length === 0) {
    throw new NotFoundError("No products found for this seller");
  }
  return userProducts;
};

const updateProduct = async (product, data, images) => {
  let { name, price, description, post_status, category, product_status } = data;

  if (!product) throw new NotFoundError("Product not found");

  const updateFields = {};
  if (name !== undefined) updateFields.name = name;
  if (price !== undefined) updateFields.price = price;
  if (description !== undefined) updateFields.description = description;
  if (post_status !== undefined) updateFields.post_status = post_status;
  if (category !== undefined) updateFields.category = category;
  if (product_status !== undefined) updateFields.product_status = product_status;

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

  const updatedProduct = await productRepo.updateById(id, updateFields);

  const productFormat = {
    ...updatedProduct,
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
    ...updatedProduct,
    images: uploadedImages.map((img) => img.url),
  };
};

const updateProductById = async (id, data, images) => {
  const product = await productRepo.findById(id, { raw: true, nest: true });
  const result = await updateProduct(product, data, images);
  return result;
};

const deleteProduct = async (product_id) => {
  if (!product_id) throw new BadRequestError("Product ID is required");

  const product = await productRepo.findById(product_id, { raw: true, nest: true });
  if (!product) throw new NotFoundError("Product not found");

  const images = await destroyImagesByReference(product_id, "product");

  await deleteCache(CACHE_KEYS.COMMERCE.PRODUCT_BY_ID(product_id));
  await deleteCache(CACHE_KEYS.COMMERCE.PRODUCT_BY_PUBLIC_ID(product.public_id));
  for (const image of images) {
    await deleteCache(CACHE_KEYS.SYSTEM.IMAGE_BY_ID(image.id));
  }

  await productRepo.destroy(product_id);

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
  const product = await productRepo.findOne({ where: { public_id } }, { raw: true, nest: true });
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
