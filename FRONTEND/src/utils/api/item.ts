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
    price: (data.price !== undefined && data.price !== null && data.price !== "") ? parseInt(data.price, 10) : undefined,
    stock: (data.status === "sold_out" || data.status === "SOLD_OUT")
      ? 0
      : ((data.stock !== undefined && data.stock !== null && data.stock !== "") ? parseInt(data.stock, 10) : undefined),
    description: data.description,
    status: data.status,
    purchase_limit_per_day: (data.purchase_limit_per_day !== null && data.purchase_limit_per_day !== undefined && data.purchase_limit_per_day !== "")
      ? parseInt(data.purchase_limit_per_day, 10)
      : null,
    weight: data.weight ? parseInt(data.weight, 10) : undefined,
    length: data.length ? parseInt(data.length, 10) : undefined,
    width: data.width ? parseInt(data.width, 10) : undefined,
    height: data.height ? parseInt(data.height, 10) : undefined,
    images: data.images || (data.image ? [data.image] : []),
  };
};

const mapToProductDto = (raw: any) => {
  const data = getJsonFromFormData(raw);
  return {
    name: data.name,
    description: data.description,
    price: (data.price !== undefined && data.price !== null && data.price !== "") ? parseInt(data.price, 10) : undefined,
    stock: (data.stock !== undefined && data.stock !== null && data.stock !== "") ? parseInt(data.stock, 10) : undefined,
    category: data.category,
    product_status: data.product_status || data.productStatus || "new",
    post_status: data.post_status || data.postStatus || "pending",
    images: data.images || (data.image ? [data.image] : []),
  };
};

export const getAllItems = (showDeleted?: boolean) => {
  return axiosClient.get("/commerce/items", { params: { showDeleted } });
};

export const deleteItem = (itemId: string | number) => {
  return axiosClient.delete(`${getCommercePrefix()}/items/${itemId}`);
};

export const createItem = (data: any) => {
  return axiosClient.post("/partner/commerce/items", mapToItemDto(data));
};

export const updateItem = (itemId: string | number, data: any) => {
  return axiosClient.patch(
    `${getCommercePrefix()}/items/${itemId}`,
    mapToItemDto(data),
  );
};

export const createProduct = (formData: any) => {
  return axiosClient.post(
    "/partner/commerce/products",
    mapToProductDto(formData),
  );
};

export const normalizeProduct = (product: any) => {
  if (!product) return product;
  const sellerObj = product.seller || product.creator || {};
  return {
    ...product,
    sellerId: product.sellerId || product.seller_id,
    postStatus: product.postStatus || product.post_status,
    productStatus: product.productStatus || product.product_status,
    createdAt: product.createdAt || product.created_at,
    updatedAt: product.updatedAt || product.updated_at,
    deletedAt: product.deletedAt || product.deleted_at,
    creator: {
      username: sellerObj.username || sellerObj.email || "",
      profile: sellerObj.profile || {},
    },
    seller: sellerObj,
  };
};

export const getAllAvailableProducts = async () => {
  const res: any = await axiosClient.get("/commerce/products", {
    params: { postStatus: "public" },
  });
  if (res.success && Array.isArray(res.data)) {
    return {
      ...res,
      data: res.data.map(normalizeProduct),
    };
  }
  return res;
};

export const getAllProducts = async (showDeleted?: boolean) => {
  const res: any = await axiosClient.get("/commerce/products", { params: { showDeleted } });
  if (res.success && Array.isArray(res.data)) {
    return {
      ...res,
      data: res.data.map(normalizeProduct),
    };
  }
  return res;
};

export const getProductByUserId = async (userId: string | number) => {
  const res: any = await axiosClient.get("/commerce/products", {
    params: { sellerId: userId },
  });
  if (res.success && Array.isArray(res.data)) {
    return {
      ...res,
      data: res.data.map(normalizeProduct),
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
