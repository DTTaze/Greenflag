import { Coins, X } from "lucide-react";
import { useEffect, useState } from "react";

import ImageUpload from "../ImageUpload";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-md"
        onClick={onCancel}
      ></div>

      {/* Modal Container */}
      <div className="relative z-10 w-full max-w-2xl transform rounded-2xl bg-slate-900/95 border border-slate-800/80 p-6 shadow-2xl transition-all">
        {/* Decorative Glow */}
        <div className="absolute -top-20 -left-20 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl" />
        <div className="absolute -bottom-20 -right-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

        {/* Close Button */}
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 rounded-full p-1.5 text-slate-400 hover:text-white hover:bg-slate-800/80 transition-all duration-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
            {isEditing ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}
          </h2>
          <p className="text-xs text-slate-400 mt-1">Điền đầy đủ thông tin để đăng sản phẩm lên thị trường trao đổi.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 relative">
          <ImageUpload
            image={formData.image}
            onImageChange={(imageUrl) =>
              setFormData((prev) => ({ ...prev, image: imageUrl }))
            }
            onRemoveImage={() =>
              setFormData((prev) => ({ ...prev, image: "" }))
            }
          />

          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="name"
                className="text-sm font-semibold text-slate-300 flex items-center gap-1"
              >
                Tên sản phẩm <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`mt-1.5 w-full bg-slate-950/40 border ${
                  errors.name ? "border-red-500" : "border-slate-800"
                } rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-600 transition-all`}
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
                  className="text-sm font-semibold text-slate-300 flex items-center gap-1"
                >
                  Giá <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full bg-slate-950/40 border ${
                      errors.price ? "border-red-500" : "border-slate-800"
                    } rounded-lg py-2 pr-3 pl-8 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-600 transition-all`}
                    placeholder="100"
                    min="1"
                  />
                  <Coins className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-500" />
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="text-sm font-semibold text-slate-300 flex items-center gap-1"
                >
                  Số lượng <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className={`mt-1.5 w-full bg-slate-950/40 border ${
                    errors.stock ? "border-red-500" : "border-slate-800"
                  } rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-600 transition-all`}
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
          <div>
            <label
              htmlFor="description"
              className="text-sm font-semibold text-slate-300 flex items-center gap-1"
            >
              Mô tả sản phẩm <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`mt-1.5 w-full bg-slate-950/40 border ${
                errors.description ? "border-red-500" : "border-slate-800"
              } rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 placeholder-slate-600 transition-all`}
              placeholder="Mô tả chi tiết về sản phẩm của bạn"
            ></textarea>
            {errors.description && (
              <p className="mt-1 text-xs text-red-500">{errors.description}</p>
            )}
          </div>

          {/* Additional Information */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="category"
                className="text-sm font-semibold text-slate-300"
              >
                Danh mục
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
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
                className="text-sm font-semibold text-slate-300"
              >
                Tình trạng
              </label>
              <select
                id="product_status"
                name="product_status"
                value={formData.product_status}
                onChange={handleChange}
                className="mt-1.5 w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-slate-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
              >
                <option value="new">Mới</option>
                <option value="like-new">Như mới</option>
                <option value="used">Đã qua sử dụng</option>
                <option value="refurbished">Tân trang</option>
              </select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 border-t border-slate-800/60 pt-5 mt-2">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-slate-800 bg-slate-950/80 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 hover:bg-emerald-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-600/10 active:scale-95 transition-all duration-200"
            >
              {isEditing ? "Cập nhật sản phẩm" : "Đăng sản phẩm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
