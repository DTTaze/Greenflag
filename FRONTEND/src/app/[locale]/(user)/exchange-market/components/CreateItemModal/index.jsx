import { Coins, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { Dialog, DialogContent, DialogTitle } from "@/src/components/ui/dialog";

import ImageUpload from "../ImageUpload";

export default function CreateItemModal({ isOpen, item, onSubmit, onCancel }) {
  const t = useTranslations("exchangeMarket");

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

    if (!formData.name.trim())
      newErrors.name = t("createModal.errorNameRequired");
    if (!formData.description.trim())
      newErrors.description = t("createModal.errorDescRequired");
    if (!formData.price) newErrors.price = t("createModal.errorPriceRequired");
    else if (isNaN(formData.price) || Number(formData.price) <= 0) {
      newErrors.price = t("createModal.errorPricePositive");
    }

    if (!formData.stock) newErrors.stock = t("createModal.errorStockRequired");
    else if (
      isNaN(formData.stock) ||
      Number(formData.stock) <= 0 ||
      !Number.isInteger(Number(formData.stock))
    ) {
      newErrors.stock = t("createModal.errorStockInteger");
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

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent
        showCloseButton={false}
        className="z-50 flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-zinc-800 dark:bg-zinc-900"
      >
        {/* Decorative Glow */}
        <div className="pointer-events-none absolute -top-20 -left-20 h-40 w-40 rounded-full bg-emerald-500/5 blur-3xl dark:bg-emerald-500/10" />
        <div className="pointer-events-none absolute -right-20 -bottom-20 h-40 w-40 rounded-full bg-blue-500/5 blur-3xl dark:bg-blue-500/10" />

        {/* Close Button */}
        <button
          onClick={onCancel}
          className="dark:hover:bg-zinc-805 absolute top-4 right-4 rounded-full p-1.5 text-slate-400 transition-all duration-200 hover:bg-slate-100 hover:text-slate-800 dark:hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Header */}
        <div className="mb-5 shrink-0">
          <DialogTitle className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-xl font-bold text-transparent dark:from-emerald-400 dark:to-teal-300">
            {isEditing
              ? t("createModal.titleEdit")
              : t("createModal.titleCreate")}
          </DialogTitle>
          <p className="text-slate-450 mt-1 text-xs dark:text-zinc-400">
            {t("createModal.desc")}
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex-1 space-y-4 overflow-y-auto pr-1"
        >
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
                className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-zinc-300"
              >
                {t("createModal.fieldName")}{" "}
                <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`text-slate-850 mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm placeholder-slate-400 transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-white dark:placeholder-zinc-600 ${
                  errors.name ? "border-red-500 dark:border-red-500" : ""
                }`}
                placeholder={t("createModal.placeholderName")}
              />
              {errors.name && (
                <p className="mt-1 text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label
                  htmlFor="price"
                  className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-zinc-300"
                >
                  {t("createModal.fieldPrice")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <div className="relative mt-1.5">
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className={`text-slate-850 placeholder-slate-450 dark:placeholder-zinc-650 w-full rounded-lg border border-slate-200 bg-slate-50/50 py-2 pr-3 pl-8 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-white ${
                      errors.price ? "border-red-500 dark:border-red-500" : ""
                    }`}
                    placeholder="100"
                    min="1"
                  />
                  <Coins className="absolute top-2.5 left-2.5 h-4 w-4 text-slate-400 dark:text-zinc-500" />
                </div>
                {errors.price && (
                  <p className="mt-1 text-xs text-red-500">{errors.price}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-zinc-300"
                >
                  {t("createModal.fieldStock")}{" "}
                  <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className={`text-slate-850 placeholder-slate-450 dark:placeholder-zinc-655 mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-white ${
                    errors.stock ? "border-red-500 dark:border-red-500" : ""
                  }`}
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
              className="flex items-center gap-1 text-sm font-semibold text-slate-700 dark:text-zinc-300"
            >
              {t("createModal.fieldDesc")}{" "}
              <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              className={`text-slate-850 mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm placeholder-slate-400 transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950/40 dark:text-white dark:placeholder-zinc-600 ${
                errors.description ? "border-red-500 dark:border-red-500" : ""
              }`}
              placeholder={t("createModal.placeholderDesc")}
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
                className="text-sm font-semibold text-slate-700 dark:text-zinc-300"
              >
                {t("createModal.fieldCategory")}
              </label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="text-slate-750 mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
              >
                <option value="handicraft">{t("categories.handicraft")}</option>
                <option value="recycled">{t("categories.recycled")}</option>
                <option value="organic">{t("categories.organic")}</option>
                <option value="plants">{t("categories.plants")}</option>
                <option value="other">{t("categories.other")}</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="product_status"
                className="text-sm font-semibold text-slate-700 dark:text-zinc-300"
              >
                {t("createModal.fieldCondition")}
              </label>
              <select
                id="product_status"
                name="product_status"
                value={formData.product_status}
                onChange={handleChange}
                className="text-slate-750 mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm transition-all focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
              >
                <option value="new">{t("conditions.new")}</option>
                <option value="like-new">{t("conditions.like-new")}</option>
                <option value="used">{t("conditions.used")}</option>
                <option value="refurbished">
                  {t("conditions.refurbished")}
                </option>
              </select>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="mt-2 flex shrink-0 justify-end gap-3 border-t border-slate-100 pt-5 dark:border-zinc-800/80">
            <button
              type="button"
              onClick={onCancel}
              className="text-slate-650 dark:hover:bg-zinc-850 cursor-pointer rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold transition-all duration-200 hover:bg-slate-50 active:scale-95 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-300"
            >
              {t("common.cancel")}
            </button>
            <button
              type="submit"
              className="cursor-pointer rounded-xl bg-emerald-600 px-5.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/15 transition-all duration-200 hover:bg-emerald-500 active:scale-95"
            >
              {isEditing
                ? t("createModal.btnUpdate")
                : t("createModal.btnCreate")}
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
