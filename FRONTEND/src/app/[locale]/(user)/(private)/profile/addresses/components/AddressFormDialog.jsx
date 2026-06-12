import Button from "@/src/components/ui/button";
import InputField from "@/src/components/ui/InputField.jsx";

import useAddressForm from "./useAddressForm";

function AddressFormDialog({
  isOpen,
  onClose,
  editingAddress,
  userId,
  onSuccess,
}) {
  const {
    newAddress,
    errors,
    provinces,
    districts,
    wards,
    isLoading,
    errorMessage,
    handleInputChange,
    handleTypeChange,
    handleDefaultChange,
    handleAddOrUpdateAddress,
    handleCancel,
  } = useAddressForm({ isOpen, onClose, editingAddress, userId, onSuccess });

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-xs p-4"
      onMouseDown={(e) => e.stopPropagation()}
    >
      <div className="w-full max-w-lg transform rounded-3xl border border-emerald-200/60 bg-white p-6 shadow-2xl transition-all dark:border-emerald-500/15 dark:bg-zinc-950">
        <h4 className="mb-5 text-xl font-bold text-zinc-900 dark:text-zinc-100">
          {editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
        </h4>
        {errorMessage && <p className="mb-4 text-sm text-rose-500 dark:text-rose-450">{errorMessage}</p>}
        
        <div className="mb-4 grid grid-cols-2 gap-4">
          <InputField
            id="fullName"
            label="Họ và tên"
            name="fullName"
            value={newAddress.fullName}
            onChange={handleInputChange}
            error={errors.fullName}
          />
          <InputField
            id="phoneNumber"
            label="Số điện thoại"
            name="phoneNumber"
            value={newAddress.phoneNumber}
            onChange={handleInputChange}
            error={errors.phoneNumber}
          />
        </div>
        
        <div className="mb-4">
          <label
            htmlFor="province"
            className="mb-2 block text-xs font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase"
          >
            Tỉnh/Thành phố
          </label>
          <select
            id="province"
            name="province"
            value={newAddress.province}
            onChange={handleInputChange}
            className="w-full rounded-2xl border border-emerald-200/60 bg-white p-3 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none dark:border-emerald-500/15 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-emerald-500"
            disabled={isLoading}
          >
            <option value="">Chọn Tỉnh/Thành phố</option>
            {provinces
              .filter((province) => province.Status === 1)
              .sort((a, b) => a.ProvinceName.localeCompare(b.ProvinceName))
              .map((province) => (
                <option key={province.ProvinceID} value={province.ProvinceID}>
                  {province.ProvinceName}
                </option>
              ))}
          </select>
          {errors.province && (
            <p className="text-xs text-rose-500 mt-1">{errors.province}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label
            htmlFor="district"
            className="mb-2 block text-xs font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase"
          >
            Quận/Huyện
          </label>
          <select
            id="district"
            name="district"
            value={newAddress.district}
            onChange={handleInputChange}
            className="w-full rounded-2xl border border-emerald-200/60 bg-white p-3 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none dark:border-emerald-500/15 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-emerald-500"
            disabled={!newAddress.province || isLoading}
          >
            <option value="">Chọn Quận/Huyện</option>
            {districts.map((district) => (
              <option key={district.DistrictID} value={district.DistrictID}>
                {district.DistrictName}
              </option>
            ))}
          </select>
          {errors.district && (
            <p className="text-xs text-rose-500 mt-1">{errors.district}</p>
          )}
        </div>
        
        <div className="mb-4">
          <label htmlFor="ward" className="mb-2 block text-xs font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
            Phường/Xã
          </label>
          <select
            id="ward"
            name="ward"
            value={newAddress.ward}
            onChange={handleInputChange}
            className="w-full rounded-2xl border border-emerald-200/60 bg-white p-3 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-none dark:border-emerald-500/15 dark:bg-zinc-900 dark:text-zinc-100 dark:focus:ring-emerald-500"
            disabled={!newAddress.district || isLoading}
          >
            <option value="">Chọn Phường/Xã</option>
            {wards.map((ward) => (
              <option key={ward.WardCode} value={ward.WardCode}>
                {ward.WardName}
              </option>
            ))}
          </select>
          {errors.ward && <p className="text-xs text-rose-500 mt-1">{errors.ward}</p>}
        </div>
        
        <InputField
          id="specificAddress"
          label="Địa chỉ cụ thể"
          name="specificAddress"
          value={newAddress.specificAddress}
          onChange={handleInputChange}
          error={errors.specificAddress}
        />
        
        <div className="mb-4">
          <label className="mb-2 block text-xs font-bold tracking-wider text-zinc-500 dark:text-zinc-400 uppercase">
            Loại địa chỉ
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              value="home"
              onClick={handleTypeChange}
              className={`rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-all ${
                newAddress.type === "home"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950/20 dark:text-emerald-300"
                  : "border-emerald-200/60 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-emerald-500/10 dark:bg-zinc-900 dark:text-zinc-350 dark:hover:bg-zinc-800/50"
              }`}
            >
              Nhà riêng
            </button>
            <button
              type="button"
              value="office"
              onClick={handleTypeChange}
              className={`rounded-2xl border px-5 py-2.5 text-sm font-semibold transition-all ${
                newAddress.type === "office"
                  ? "border-emerald-600 bg-emerald-50 text-emerald-800 dark:border-emerald-500 dark:bg-emerald-950/20 dark:text-emerald-300"
                  : "border-emerald-200/60 bg-white text-zinc-700 hover:bg-zinc-50 dark:border-emerald-500/10 dark:bg-zinc-900 dark:text-zinc-350 dark:hover:bg-zinc-800/50"
              }`}
            >
              Văn phòng
            </button>
          </div>
        </div>
        
        <div className="mb-5 flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            checked={!!newAddress.isDefault}
            onChange={handleDefaultChange}
            className="mr-2.5 h-5 w-5 rounded border-emerald-200 text-emerald-600 focus:ring-emerald-500/30 focus:ring-offset-0 dark:border-emerald-500/20 dark:bg-zinc-900 cursor-pointer"
          />
          <label htmlFor="isDefault" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer select-none">
            Đặt làm địa chỉ mặc định
          </label>
        </div>
        
        <div className="flex justify-end space-x-2">
          <Button text="Trở lại" onClick={handleCancel} padding="15px" />
          <Button
            onClick={handleAddOrUpdateAddress}
            padding="15px"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {editingAddress ? "Đang lưu..." : "Đang xử lý..."}
              </span>
            ) : (
              editingAddress ? "Cập nhật" : "Hoàn thành"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default AddressFormDialog;
