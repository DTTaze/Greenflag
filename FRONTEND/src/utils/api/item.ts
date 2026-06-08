import axios from "../axios.customize";

export const getAllItems = () => {
  return axios.get("api/items");
};

export const deleteItem = (itemId: string | number) => {
  return axios.delete(`api/items/${itemId}`);
};

export const createItem = (data: any) => {
  return axios.post("api/items/upload", data);
};

export const updateItem = (itemId: string | number, data: any) => {
  return axios.put(`api/items/${itemId}`, data);
};

export const createProduct = (formData: FormData) => {
  return axios.post("api/products/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllAvailableProducts = () => {
  return axios.get("api/products/available");
};

export const getAllProducts = () => {
  return axios.get("api/products");
};

export const getProductByUserId = (userId: string | number) => {
  return axios.get(`api/products/users/${userId}`);
};

export const updateProduct = (productId: string | number, formData: FormData) => {
  return axios.put(`api/products/${productId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProduct = (productId: string | number) => {
  return axios.delete(`api/products/${productId}`);
};

export const uploadItem = (
  itemFormData: Record<string, any>,
  images?: File[],
) => {
  const formData = new FormData();

  Object.keys(itemFormData).forEach((key) => {
    formData.append(key, itemFormData[key]);
  });

  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }

  return axios.post("api/items/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getItemByUserId = (userId: string | number) => {
  return axios.get(`api/items/users/${userId}`);
};

export const updateCustomerItem = (
  itemId: string | number,
  itemFormData: Record<string, any>,
  images?: File[],
) => {
  const formData = new FormData();

  Object.keys(itemFormData).forEach((key) => {
    formData.append(key, itemFormData[key]);
  });

  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }

  return axios.put(`api/items/${itemId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteCustomerItem = (itemId: string | number) => {
  return axios.delete(`api/items/${itemId}`);
};
