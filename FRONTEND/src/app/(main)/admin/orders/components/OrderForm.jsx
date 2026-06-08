"use client";

import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Button } from "@/src/components/ui/button";

export default function OrderForm({
  open,
  handleClose,
  handleSubmit,
  initialData = {},
  mode,
}) {
  const [formData, setFormData] = useState({
    order_code: "",
    status: "",
    total_fee: "",
    shipping_fee: "",
    service_fee: "",
    insurance_fee: "",
    delivery_time: "",
    required_note: "",
    note: "",
    payment_type_id: 1,
    payment_type_name: "",
    cod_amount: "",
    shipping_order_status: "",
    buyer_name: "",
    buyer_phone: "",
    buyer_address: "",
    seller_name: "",
    seller_phone: "",
    seller_address: "",
  });

  useEffect(() => {
    if (mode === "edit" && initialData) {
      setFormData({
        id: initialData?.id || "",
        order_code: initialData?.order_code || "",
        status: initialData?.status || "",
        total_fee: initialData?.total_fee || "",
        shipping_fee: initialData?.shipping_fee || "",
        service_fee: initialData?.service_fee || "",
        insurance_fee: initialData?.insurance_fee || "",
        delivery_time: initialData?.delivery_time || "",
        required_note: initialData?.required_note || "",
        note: initialData?.note || "",
        payment_type_id: initialData?.payment_type_id || 1,
        payment_type_name: initialData?.payment_type_name || "",
        cod_amount: initialData?.cod_amount || "",
        shipping_order_status: initialData?.shipping_order_status || "",
        buyer_name: initialData?.buyer?.name || "",
        buyer_phone: initialData?.buyer?.phone || "",
        buyer_address: initialData?.buyer?.address || "",
        seller_name: initialData?.seller?.name || "",
        seller_phone: initialData?.seller?.phone || "",
        seller_address: initialData?.seller?.address || "",
      });
    }
  }, [initialData, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit(formData, mode);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh] overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-lg font-bold text-gray-900">
            {mode === "add" ? "Thêm đơn hàng mới" : "Chỉnh sửa đơn hàng"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Section 1: Order Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-emerald-700 border-b pb-1">
              Thông tin đơn hàng
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="order_code">Mã đơn hàng</Label>
                <Input
                  id="order_code"
                  name="order_code"
                  value={formData.order_code}
                  disabled
                  className="bg-gray-50 border-gray-200"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <Label htmlFor="shipping_order_status">Trạng thái</Label>
                <select
                  id="shipping_order_status"
                  name="shipping_order_status"
                  value={formData.shipping_order_status}
                  onChange={handleChange}
                  className="w-full h-8 border border-gray-200 rounded-lg px-2.5 py-1 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                >
                  <option value="ready_to_pick">Sẵn sàng lấy hàng</option>
                  <option value="picking">Đang lấy hàng</option>
                  <option value="picked">Đã lấy hàng</option>
                  <option value="delivering">Đang giao hàng</option>
                  <option value="delivered">Đã giao hàng</option>
                  <option value="delivery_failed">Giao hàng thất bại</option>
                  <option value="cancelled">Đã hủy</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="shipping_fee">Phí vận chuyển</Label>
                <Input
                  id="shipping_fee"
                  name="shipping_fee"
                  value={formData.shipping_fee}
                  disabled
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="service_fee">Phí dịch vụ</Label>
                <Input
                  id="service_fee"
                  name="service_fee"
                  value={formData.service_fee}
                  disabled
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="insurance_fee">Phí bảo hiểm</Label>
                <Input
                  id="insurance_fee"
                  name="insurance_fee"
                  value={formData.insurance_fee}
                  disabled
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="total_fee">Tổng phí</Label>
                <Input
                  id="total_fee"
                  name="total_fee"
                  value={formData.total_fee}
                  disabled
                  className="bg-gray-50 border-gray-200 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Buyer Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-emerald-700 border-b pb-1">
              Thông tin người mua
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="buyer_name">Tên người mua</Label>
                <Input
                  id="buyer_name"
                  name="buyer_name"
                  value={formData.buyer_name}
                  disabled
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="buyer_phone">Số điện thoại</Label>
                <Input
                  id="buyer_phone"
                  name="buyer_phone"
                  value={formData.buyer_phone}
                  disabled
                  className="bg-gray-50 border-gray-200"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="buyer_address">Địa chỉ người mua</Label>
              <textarea
                id="buyer_address"
                name="buyer_address"
                value={formData.buyer_address}
                disabled
                rows={2}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 cursor-not-allowed resize-none focus:outline-none"
              />
            </div>
          </div>

          {/* Section 3: Seller Info */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-emerald-700 border-b pb-1">
              Thông tin người bán
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="seller_name">Tên người bán</Label>
                <Input
                  id="seller_name"
                  name="seller_name"
                  value={formData.seller_name}
                  disabled
                  className="bg-gray-50 border-gray-200"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="seller_phone">Số điện thoại</Label>
                <Input
                  id="seller_phone"
                  name="seller_phone"
                  value={formData.seller_phone}
                  disabled
                  className="bg-gray-50 border-gray-200"
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="seller_address">Địa chỉ người bán</Label>
              <textarea
                id="seller_address"
                name="seller_address"
                value={formData.seller_address}
                disabled
                rows={2}
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-gray-50 cursor-not-allowed resize-none focus:outline-none"
              />
            </div>
          </div>

          {/* Section 4: Notes */}
          <div className="space-y-4">
            <h4 className="font-semibold text-sm text-emerald-700 border-b pb-1">
              Ghi chú thêm
            </h4>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="note">Ghi chú</Label>
              <textarea
                id="note"
                name="note"
                value={formData.note || ""}
                onChange={handleChange}
                rows={3}
                placeholder="Ghi chú đơn hàng cho shipper hoặc hệ thống..."
                className="w-full border border-gray-200 rounded-lg p-2.5 text-sm bg-transparent focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 resize-none"
              />
            </div>
          </div>

          <DialogFooter className="mt-6 border-t pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="mr-2"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              variant="default"
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {mode === "add" ? "Thêm" : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
