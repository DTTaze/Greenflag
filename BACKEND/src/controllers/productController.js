const productService = require("../services/productService");

const handleUploadProduct = async (req, res) => {
  const user_id = Number(req.user.id);
  const productData = req.body;
  const images = req.files;

  const product = await productService.createProduct(productData, user_id, images);

  return res.success("Product uploaded successfully", product);
};

const handleGetAllProducts = async (req, res) => {
  const products = await productService.getAllProducts();
  return res.success("Products retrieved successfully", products);
};

const handleGetAllAvailableProducts = async (req, res) => {
  const products = await productService.getAllAvailableProducts();
  return res.success("Available products retrieved successfully", products);
};

const handleGetProductByIdUser = async (req, res) => {
  const user_id = Number(req.params.user_id);
  const products = await productService.getProductByIdUser(user_id);
  return res.success("Your products retrieved successfully", products);
};

const handleUpdateProductById = async (req, res) => {
  const product_id = Number(req.params.id);
  const productData = req.body;
  const images = req.files;

  const updatedProduct = await productService.updateProductById(product_id, productData, images);

  return res.success("Product updated successfully", updatedProduct);
};

const handleDeleteProduct = async (req, res) => {
  const product_id = Number(req.params.id);
  const message = await productService.deleteProduct(product_id);
  return res.success("Product deleted successfully", message);
};

const handleUpdateProductByPublicId = async (req, res) => {
  const public_id = req.params.public_id;
  const productData = req.body;
  const images = req.files;

  const updatedProduct = await productService.updateProductByPublicId(
    public_id,
    productData,
    images,
  );

  return res.success("Product updated successfully", updatedProduct);
};

module.exports = {
  handleUploadProduct,
  handleGetAllProducts,
  handleGetProductByIdUser,
  handleGetAllAvailableProducts,
  handleUpdateProductById,
  handleUpdateProductByPublicId,
  handleDeleteProduct,
};
