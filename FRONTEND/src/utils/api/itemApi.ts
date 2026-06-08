import axios from "../axios.customize";

export const getAllItemsApi = () => {
  return axios.get("api/items");
};

export const deleteItemApi = (id: string | number) => {
  return axios.delete(`api/items/${id}`);
};

export const createItemApi = (data: any) => {
  return axios.post("api/items/upload", data);
};

export const updateItemApi = (id: string | number, data: any) => {
  return axios.put(`api/items/${id}`, data);
};

export const createProductApi = (formData: FormData) => {
  return axios.post("api/products/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllAvailableProductsApi = () => {
  return axios.get("api/products/available");
};

export const getAllProductsApi = () => {
  return axios.get("api/products");
};

export const getProductByIdUser = (id: string | number) => {
  return axios.get(`api/products/users/${id}`);
};

export const updateProductApi = (id: string | number, formData: FormData) => {
  return axios.put(`api/products/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteProductApi = (id: string | number) => {
  return axios.delete(`api/products/${id}`);
};

export const upLoadItemApi = (
  formItemData: Record<string, any>,
  images?: File[],
) => {
  const formData = new FormData();

  Object.keys(formItemData).forEach((key) => {
    formData.append(key, formItemData[key]);
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

export const getItemByIdUserApi = (id: string | number) => {
  return axios.get(`api/items/users/${id}`);
};

export const updateItemOfCustomerApi = (
  id: string | number,
  formItemData: Record<string, any>,
  images?: File[],
) => {
  const formData = new FormData();

  Object.keys(formItemData).forEach((key) => {
    formData.append(key, formItemData[key]);
  });

  if (images && images.length > 0) {
    images.forEach((image) => {
      formData.append("images", image);
    });
  }

  return axios.put(`api/items/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const deleteItemOfCustomerApi = (id: string | number) => {
  return axios.delete(`api/items/${id}`);
};
