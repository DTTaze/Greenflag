/* eslint-disable max-lines */
import { Coins, Upload, X } from "lucide-react";
import { useEffect, useState } from "react";

export default function CreateItemModal({ isOpen, item, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    image: "",
    name: "",
    price: "",
    stock: "",
    description: "",
    category: "other",
    product_status: "new",
  });

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData({
        name: item.name || "",
        description: item.description || "",
        price: item.price || "",
        stock: item.stock || "",
        image: item.image || "",
        category: item.category || "other",
        product_status: item.product_status || "new",
      });
      setIsEditing(true);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        stock: "",
        image: "",
        category: "other",
        product_status: "new",
      });
      setIsEditing(false);
    }
  }, [item]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setFormData((prev) => ({
        ...prev,
        image: imageUrl,
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Tên sản phẩm là bắt buộc";
    if (!formData.description.trim())
      newErrors.description = "Mô tả sản phẩm là bắt buộc";
    if (!formData.price) newErrors.price = "Giá sản phẩm là bắt buộc";
    else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = "Giá phải là số dương";
    }

    if (!formData.stock) newErrors.stock = "Số lượng sản phẩm là bắt buộc";
    else if (
      isNaN(formData.stock) ||
      Number(formData.stock) <= 0 ||
      !Number.isInteger(Number(formData.stock))
    ) {
      newErrors.stock = "Số lượng phải là số nguyên dương";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      const formattedData = {
        ...formData,
        price: Number(formData.price),
        stock: Number(formData.stock),
      };
      onSubmit(formattedData, isEditing);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onCancel}
      ></div>
      <div className="relative z-10 mx-4 w-full max-w-2xl transform rounded-lg bg-white p-6 shadow-2xl transition-all">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">
            {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Image upload */}
          <div className="mb-5">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Hình ảnh sản phẩm
            </label>
            <div className="flex items-center gap-4">
              {formData.image ? (
                <div className="relative h-24 w-24 overflow-hidden rounded-lg border border-gray-200">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, image: "" }))
                    }
                    className="bg-opacity-50 absolute top-1 right-1 rounded-full bg-black p-1 text-white"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 text-gray-400">
                  <Upload className="mb-1 h-6 w-6" />
                  <span className="text-xs">Tải ảnh</span>
                </div>
              )}
              <div className="flex-grow">
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="inline-block cursor-pointer rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
                >
                  Chọn ảnh
                </label>
                <p className="mt-1 text-xs text-gray-500">
                  PNG, JPG lên tới 5MB
                </p>
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="mb-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full border px-3 py-2 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none`}
                placeholder="Nhập tên sản phẩm"
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="price"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Giá <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full border py-2 pr-3 pl-7 ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    } rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none`}
                    placeholder="100"
                    min="1"
                  />
                  <Coins className="absolute top-2.5 left-2 h-4 w-4 text-gray-400" />
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Số lượng <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className={`w-full border px-3 py-2 ${
                    errors.stock ? "border-red-500" : "border-gray-300"
                  } rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none`}
                  placeholder="1"
                  min="1"
                />
                {errors.stock && (
                  <p className="mt-1 text-xs text-red-500">{errors.stock}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mb-5">
            <label
              htmlFor="description"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Mô tả sản phẩm <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`w-full border px-3 py-2 ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-emerald-600 focus:outline-none`}
              placeholder="Mô tả chi tiết về sản phẩm của bạn"
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Additional Information */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Danh mục
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="handicraft">Đồ thủ công</option>
                <option value="recycled">Đồ tái chế</option>
                <option value="organic">Sản phẩm hữu cơ</option>
                <option value="plants">Cây trồng</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="product_status"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Tình trạng
              </label>
              <select
                id="product_status"
                name="product_status"
                value={formData.product_status}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="new">Mới</option>
                <option value="like-new">Như mới</option>
                <option value="used">Đã qua sử dụng</option>
                <option value="refurbished">Tân trang</option>
              </select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white transition-colors hover:bg-emerald-700"
            >
              {isEditing ? "Cập nhật sản phẩm" : "Đăng sản phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
