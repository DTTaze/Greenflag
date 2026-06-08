const { z } = require("zod");
const {
  PRODUCT_CATEGORY,
  PRODUCT_CONDITION,
  PRODUCT_POST_STATUS,
} = require("../constants/productStatus");
const { emptyToUndefined } = require("./zodHelpers");

/**
 * @typedef {z.infer<typeof createProductDto>} CreateProductDto
 * @typedef {z.infer<typeof updateProductDto>} UpdateProductDto
 */

const createProductDto = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.coerce.number().min(1, "Price must be at least 1"),
  stock: z.coerce.number().min(1, "Stock must be at least 1"),
  description: emptyToUndefined(z.string()).optional(),
  category: z.enum(Object.values(PRODUCT_CATEGORY), {
    errorMap: () => ({
      message: `Category must be one of: ${Object.values(PRODUCT_CATEGORY).join(", ")}`,
    }),
  }),
  product_status: z.enum(Object.values(PRODUCT_CONDITION), {
    errorMap: () => ({
      message: `Product condition must be one of: ${Object.values(PRODUCT_CONDITION).join(", ")}`,
    }),
  }),
  post_status: emptyToUndefined(z.enum(Object.values(PRODUCT_POST_STATUS))).optional(),
});

const updateProductDto = createProductDto.partial();

module.exports = {
  createProductDto,
  updateProductDto,
};
