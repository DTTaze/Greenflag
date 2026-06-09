import axiosClient from "../../services";

const getCommercePrefix = () => {
  const isAdmin =
    typeof window !== "undefined" &&
    window.location.pathname.includes("/admin");
  return isAdmin ? "/admin/commerce" : "/partner/commerce";
};

const getJsonFromFormData = (data: any) => {
  if (typeof window !== "undefined" && data instanceof FormData) {
    const obj: Record<string, any> = {};
    data.forEach((value, key) => {
      obj[key] = value;
    });
    return obj;
  }
  return data;
};

const mapToItemDto = (raw: any) => {
  const data = getJsonFromFormData(raw);
  return {
    name: data.name,
    price: data.price ? parseInt(data.price, 10) : undefined,
    stock: data.stock ? parseInt(data.stock, 10) : undefined,
    description: data.description,
    status: data.status,
    purchase_limit_per_day: data.purchase_limit_per_day
      ? parseInt(data.purchase_limit_per_day, 10)
      : undefined,
    weight: data.weight ? parseInt(data.weight, 10) : undefined,
    length: data.length ? parseInt(data.length, 10) : undefined,
    width: data.width ? parseInt(data.width, 10) : undefined,
    height: data.height ? parseInt(data.height, 10) : undefined,
  };
};

const mapToProductDto = (raw: any) => {
  const data = getJsonFromFormData(raw);
  return {
    name: data.name,
    description: data.description,
    price: data.price ? parseInt(data.price, 10) : undefined,
    category: data.category,
    product_status: data.product_status || data.productStatus || "new",
    post_status: data.post_status || data.postStatus || "pending",
  };
};

export const getAllItems = () => {
  return axiosClient.get("/commerce/items");
};

export const deleteItem = (itemId: string | number) => {
  return axiosClient.delete(`${getCommercePrefix()}/items/${itemId}`);
};

export const createItem = (data: any) => {
  return axiosClient.post(`${getCommercePrefix()}/items`, mapToItemDto(data));
};

export const updateItem = (itemId: string | number, data: any) => {
  return axiosClient.patch(
    `${getCommercePrefix()}/items/${itemId}`,
    mapToItemDto(data),
  );
};

export const createProduct = (formData: any) => {
  return axiosClient.post(
    `${getCommercePrefix()}/products`,
    mapToProductDto(formData),
  );
};

export const getAllAvailableProducts = () => {
  return axiosClient.get("/commerce/products");
};

export const getAllProducts = () => {
  return axiosClient.get("/commerce/products");
};

export const getProductByUserId = async (userId: string | number) => {
  const res: any = await getAllProducts();
  if (res.success && Array.isArray(res.data)) {
    return {
      ...res,
      data: res.data.filter(
        (product: any) => product.sellerId?.toString() === userId.toString(),
      ),
    };
  }
  return res;
};

export const updateProduct = (productId: string | number, formData: any) => {
  return axiosClient.patch(
    `${getCommercePrefix()}/products/${productId}`,
    mapToProductDto(formData),
  );
};

export const deleteProduct = (productId: string | number) => {
  return axiosClient.delete(`${getCommercePrefix()}/products/${productId}`);
};

export const uploadItem = (
  itemFormData: Record<string, any>,
  _images?: File[],
) => {
  // NestJS commerce item creation expects a JSON body.
  // We extract core fields and delegate to createItem.
  return createItem(itemFormData);
};

export const getItemByUserId = async (userId: string | number) => {
  const res: any = await getAllItems();
  if (res.success && Array.isArray(res.data)) {
    return {
      ...res,
      data: res.data.filter(
        (item: any) => item.creatorId?.toString() === userId.toString(),
      ),
    };
  }
  return res;
};

export const updateCustomerItem = (
  itemId: string | number,
  itemFormData: Record<string, any>,
  _images?: File[],
) => {
  return updateItem(itemId, itemFormData);
};

export const deleteCustomerItem = (itemId: string | number) => {
  return deleteItem(itemId);
};
