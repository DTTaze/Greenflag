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
  } = useAddressForm({ isOpen, onClose, editingAddress, userId, onSuccess });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div className="w-full max-w-lg transform rounded-lg bg-white p-6 shadow-2xl transition-all">
        <h4 className="mb-4 text-lg font-semibold">
          {editingAddress ? "Cập nhật địa chỉ" : "Thêm địa chỉ mới"}
        </h4>
        {isLoading && <p className="text-gray-500">Đang tải...</p>}
        {errorMessage && <p className="mb-4 text-red-500">{errorMessage}</p>}
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
            className="mb-2 block text-sm font-semibold"
          >
            Tỉnh/Thành phố
          </label>
          <select
            id="province"
            name="province"
            value={newAddress.province}
            onChange={handleInputChange}
            className="w-full rounded-md border p-2"
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
            <p className="text-sm text-red-500">{errors.province}</p>
          )}
        </div>
        <div className="mb-4">
          <label
            htmlFor="district"
            className="mb-2 block text-sm font-semibold"
          >
            Quận/Huyện
          </label>
          <select
            id="district"
            name="district"
            value={newAddress.district}
            onChange={handleInputChange}
            className="w-full rounded-md border p-2"
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
            <p className="text-sm text-red-500">{errors.district}</p>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="ward" className="mb-2 block text-sm font-semibold">
            Phường/Xã
          </label>
          <select
            id="ward"
            name="ward"
            value={newAddress.ward}
            onChange={handleInputChange}
            className="w-full rounded-md border p-2"
            disabled={!newAddress.district || isLoading}
          >
            <option value="">Chọn Phường/Xã</option>
            {wards.map((ward) => (
              <option key={ward.WardCode} value={ward.WardCode}>
                {ward.WardName}
              </option>
            ))}
          </select>
          {errors.ward && <p className="text-sm text-red-500">{errors.ward}</p>}
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
          <label className="mt-2 mb-2 block text-sm font-semibold">
            Loại địa chỉ
          </label>
          <div className="flex space-x-4">
            <button
              type="button"
              value="home"
              onClick={handleTypeChange}
              className={`rounded-md border px-4 py-2 font-medium ${
                newAddress.type === "home"
                  ? "border-emerald-800"
                  : "border-gray-300"
              }`}
            >
              Nhà riêng
            </button>
            <button
              type="button"
              value="office"
              onClick={handleTypeChange}
              className={`rounded-md border px-4 py-2 font-medium ${
                newAddress.type === "office"
                  ? "border-emerald-800"
                  : "border-gray-300"
              }`}
            >
              Văn phòng
            </button>
          </div>
        </div>
        <div className="mb-4 flex items-center">
          <input
            type="checkbox"
            id="isDefault"
            checked={newAddress.isDefault}
            onChange={handleDefaultChange}
            className="mr-2 h-5 w-5"
          />
          <label htmlFor="isDefault" className="text-sm">
            Đặt làm địa chỉ mặc định
          </label>
        </div>
        <div className="flex justify-end space-x-2">
          <Button text="Trở lại" onClick={onClose} padding="15px" />
          <Button
            text={editingAddress ? "Cập nhật" : "Hoàn thành"}
            onClick={handleAddOrUpdateAddress}
            padding="15px"
            disabled={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default AddressFormDialog;
