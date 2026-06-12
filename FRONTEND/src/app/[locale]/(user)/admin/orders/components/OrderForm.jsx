"use client";

import React, { useEffect, useState } from "react";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

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
        order_code: initialData?.order_code || initialData?.orderCode || "",
        status: initialData?.status || "",
        total_fee: initialData?.total_fee || initialData?.totalFee || initialData?.totalAmount || "",
        shipping_fee: initialData?.shipping_fee || initialData?.shippingFee || "",
        service_fee: initialData?.service_fee || initialData?.serviceFee || "",
        insurance_fee: initialData?.insurance_fee || initialData?.insuranceFee || "",
        delivery_time: initialData?.delivery_time || initialData?.deliveryTime || "",
        required_note: initialData?.required_note || initialData?.requiredNote || "",
        note: initialData?.note || "",
        payment_type_id: initialData?.payment_type_id || initialData?.paymentTypeId || 1,
        payment_type_name: initialData?.payment_type_name || initialData?.paymentTypeName || "",
        cod_amount: initialData?.cod_amount || initialData?.codAmount || "",
        shipping_order_status: initialData?.shipping_order_status || initialData?.shippingOrderStatus || initialData?.status || "",
        buyer_name: initialData?.buyer?.name || initialData?.buyer?.username || initialData?.buyer?.fullName || initialData?.buyerName || "",
        buyer_phone: initialData?.buyer?.phone || initialData?.buyer?.phoneNumber || initialData?.buyerPhone || "",
        buyer_address: initialData?.buyer?.address || initialData?.buyerAddress || "",
        seller_name: initialData?.seller?.name || initialData?.seller?.username || initialData?.seller?.fullName || initialData?.sellerName || "",
        seller_phone: initialData?.seller?.phone || initialData?.seller?.phoneNumber || initialData?.sellerPhone || "",
        seller_address: initialData?.seller?.address || initialData?.sellerAddress || "",
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
      <DialogContent className="max-h-[85vh] overflow-y-auto rounded-xl border border-emerald-600/20 bg-white p-6 md:p-8 shadow-lg sm:max-w-[700px] dark:border-zinc-800 dark:bg-slate-900">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-lg font-bold text-gray-900 dark:text-zinc-100">
            {mode === "add" ? "Thêm đơn hàng mới" : "Chỉnh sửa đơn hàng"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-6">
          {/* Section 1: Order Info */}
          <div className="space-y-4">
            <h4 className="border-b border-emerald-600/20 pb-1 text-sm font-semibold text-emerald-700 dark:border-zinc-800/80">
              Thông tin đơn hàng
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="order_code">Mã đơn hàng</Label>
                <Input
                  id="order_code"
                  name="order_code"
                  value={formData.order_code}
                  disabled
                  className="border-gray-200 bg-gray-50/50 text-gray-400 cursor-not-allowed dark:border-zinc-800 dark:bg-slate-800/50 dark:text-zinc-500"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="shipping_order_status">Trạng thái</Label>
                <select
                  id="shipping_order_status"
                  name="shipping_order_status"
                  value={formData.shipping_order_status}
                  onChange={handleChange}
                  className="h-8 w-full rounded-lg border border-emerald-600/20 bg-transparent px-2.5 py-1 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 focus:outline-none dark:border-zinc-800 dark:bg-slate-800 dark:focus:border-emerald-500"
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

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div className="flex flex-col gap-2">
                <Label htmlFor="shipping_fee">Phí vận chuyển</Label>
                <Input
                  id="shipping_fee"
                  name="shipping_fee"
                  value={formData.shipping_fee}
                  disabled
                  className="border-gray-200 bg-gray-50/50 text-gray-400 cursor-not-allowed dark:border-zinc-800 dark:bg-slate-800/50 dark:text-zinc-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="service_fee">Phí dịch vụ</Label>
                <Input
                  id="service_fee"
                  name="service_fee"
                  value={formData.service_fee}
                  disabled
                  className="border-gray-200 bg-gray-50/50 text-gray-400 cursor-not-allowed dark:border-zinc-800 dark:bg-slate-800/50 dark:text-zinc-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="insurance_fee">Phí bảo hiểm</Label>
                <Input
                  id="insurance_fee"
                  name="insurance_fee"
                  value={formData.insurance_fee}
                  disabled
                  className="border-gray-200 bg-gray-50/50 text-gray-400 cursor-not-allowed dark:border-zinc-800 dark:bg-slate-800/50 dark:text-zinc-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="total_fee">Tổng phí</Label>
                <Input
                  id="total_fee"
                  name="total_fee"
                  value={formData.total_fee}
                  disabled
                  className="border-gray-200 bg-gray-50/50 text-gray-400 cursor-not-allowed dark:border-zinc-800 dark:bg-slate-800/50 dark:text-zinc-500 font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Buyer Info */}
          <div className="space-y-4">
            <h4 className="border-b border-emerald-600/20 pb-1 text-sm font-semibold text-emerald-700 dark:border-zinc-800/80">
              Thông tin người mua
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="buyer_name">Tên người mua</Label>
                <Input
                  id="buyer_name"
                  name="buyer_name"
                  value={formData.buyer_name}
                  disabled
                  className="border-gray-200 bg-gray-50/50 text-gray-400 cursor-not-allowed dark:border-zinc-800 dark:bg-slate-800/50 dark:text-zinc-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="buyer_phone">Số điện thoại</Label>
                <Input
                  id="buyer_phone"
                  name="buyer_phone"
                  value={formData.buyer_phone}
                  disabled
                  className="border-gray-200 bg-gray-50/50 text-gray-400 cursor-not-allowed dark:border-zinc-800 dark:bg-slate-800/50 dark:text-zinc-500"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="buyer_address">Địa chỉ người mua</Label>
              <textarea
                id="buyer_address"
                name="buyer_address"
                value={formData.buyer_address}
                disabled
                rows={2}
                className="w-full cursor-not-allowed resize-none rounded-lg border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-400 focus:outline-none dark:border-zinc-800 dark:bg-slate-800/50 dark:text-zinc-500"
              />
            </div>
          </div>

          {/* Section 3: Seller Info */}
          <div className="space-y-4">
            <h4 className="border-b border-emerald-600/20 pb-1 text-sm font-semibold text-emerald-700 dark:border-zinc-800/80">
              Thông tin người bán
            </h4>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="seller_name">Tên người bán</Label>
                <Input
                  id="seller_name"
                  name="seller_name"
                  value={formData.seller_name}
                  disabled
                  className="border-gray-200 bg-gray-50/50 text-gray-400 cursor-not-allowed dark:border-zinc-800 dark:bg-slate-800/50 dark:text-zinc-500"
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="seller_phone">Số điện thoại</Label>
                <Input
                  id="seller_phone"
                  name="seller_phone"
                  value={formData.seller_phone}
                  disabled
                  className="border-gray-200 bg-gray-50/50 text-gray-400 cursor-not-allowed dark:border-zinc-800 dark:bg-slate-800/50 dark:text-zinc-500"
                />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="seller_address">Địa chỉ người bán</Label>
              <textarea
                id="seller_address"
                name="seller_address"
                value={formData.seller_address}
                disabled
                rows={2}
                className="w-full cursor-not-allowed resize-none rounded-lg border border-gray-200 bg-gray-50/50 p-2.5 text-sm text-gray-400 focus:outline-none dark:border-zinc-800 dark:bg-slate-800/50 dark:text-zinc-500"
              />
            </div>
          </div>

          {/* Section 4: Notes */}
          <div className="space-y-4">
            <h4 className="border-b border-emerald-600/20 pb-1 text-sm font-semibold text-emerald-700 dark:border-zinc-800/80">
              Ghi chú thêm
            </h4>
            <div className="flex flex-col gap-2">
              <Label htmlFor="note">Ghi chú</Label>
              <textarea
                id="note"
                name="note"
                value={formData.note || ""}
                onChange={handleChange}
                rows={3}
                placeholder="Ghi chú đơn hàng cho shipper hoặc hệ thống..."
                className="w-full resize-none rounded-lg border border-emerald-600/20 bg-transparent p-2.5 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600/20 focus:outline-none dark:border-zinc-800 dark:bg-slate-800 dark:focus:border-emerald-500"
              />
            </div>
          </div>

          <DialogFooter className="mt-6 border-t border-emerald-600/20 pt-4 dark:border-zinc-800/80">
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
              className="bg-emerald-600 text-white hover:bg-emerald-700"
            >
              {mode === "add" ? "Thêm" : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
