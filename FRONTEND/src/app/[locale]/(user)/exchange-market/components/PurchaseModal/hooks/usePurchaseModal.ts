import { useEffect, useRef, useState } from "react";

import { useAuthStore } from "@/src/store/auth/authStore";
import {
  getReceiverInfoByUserId,
  previewOrderWithoutOrderCode,
} from "@/src/utils/api";

interface UsePurchaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: any;
  userCoins: number;
  onConfirm: (quantity: number, shippingData: any) => void;
}

export default function usePurchaseModal({
  isOpen,
  onClose,
  item,
  userCoins,
  onConfirm,
}: UsePurchaseModalProps) {
  const [quantity, setQuantity] = useState<number>(1);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [shippingInfo, setShippingInfo] = useState<any>(null);
  const [shippingFee, setShippingFee] = useState<number>(0);
  const [isShippingModalOpen, setIsShippingModalOpen] =
    useState<boolean>(false);
  const [isLoadingShipping, setIsLoadingShipping] = useState<boolean>(false);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const shippingModalRef = useRef<HTMLDivElement | null>(null);
  const { user } = useAuthStore();
  const token = "c3f24415-29b9-11f0-9b81-222185cb68c8";
  const shop_id = 196506;
  const [currentStock, setCurrentStock] = useState<number>(item.stock);

  const fetchShippingFee = async (selectedShipping: any) => {
    try {
      const orderData = {
        payment_type_id: 2,
        note: "ptquanh test",
        required_note: "KHONGCHOXEMHANG",
        from_name: "TinTest124",
        from_phone: "0987654321",
        from_address: "72 Thành Thái, Phường 14, Quận 10, Hồ Chí Minh, Vietnam",
        from_ward_name: "Phường 14",
        from_district_name: "Quận 10",
        from_province_name: "HCM",
        return_phone: "0332190444",
        return_address: "39 NTT",
        return_district_id: null,
        return_ward_code: "",
        client_order_code: "",
        to_name: selectedShipping.to_name,
        to_phone: selectedShipping.to_phone,
        to_address: selectedShipping.to_address,
        to_ward_name: selectedShipping.to_ward_name,
        to_district_name: selectedShipping.to_district_name,
        to_province_name: selectedShipping.to_province_name,
        cod_amount: item.price * quantity,
        content: "Theo New York Times",
        weight: item.weight || 200,
        length: item.length || 15,
        width: item.width || 15,
        height: item.height || 15,
        pick_station_id: 1444,
        deliver_station_id: null,
        insurance_value: item.price * quantity,
        service_id: 0,
        service_type_id: 2,
        coupon: null,
        pick_shift: [2],
        items: [
          {
            name: item.name,
            code: item.id.toString(),
            quantity: quantity,
            price: item.price,
            length: item.length || 12,
            width: item.width || 12,
            height: item.height || 12,
            weight: item.weight || 1200,
            category: {
              level1: item.category || "Áo",
            },
          },
        ],
      };

      const feeResponse = await previewOrderWithoutOrderCode(
        orderData,
        token,
        shop_id,
      );
      setShippingFee(feeResponse?.data?.data?.total_fee || 0);
    } catch (error) {
      console.error("Error fetching shipping fee:", error);
      setShippingFee(0);
    }
  };

  useEffect(() => {
    async function fetchDefaultShipping() {
      if (isOpen && user?.id) {
        try {
          setIsLoadingShipping(true);
          const response = await getReceiverInfoByUserId(user.id);
          if (response?.data?.length > 0) {
            const defaultShipping =
              response.data.find((info: any) => info.is_default) ||
              response.data[0];
            setShippingInfo(defaultShipping);
            await fetchShippingFee(defaultShipping);
          }
        } catch (error) {
          console.error("Error fetching shipping info:", error);
        } finally {
          setIsLoadingShipping(false);
        }
      }
    }
    fetchDefaultShipping();
  }, [isOpen, user?.id]);

  useEffect(() => {
    setCurrentStock(item.stock);
  }, [item.stock]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        (!isShippingModalOpen ||
          (shippingModalRef.current &&
            !shippingModalRef.current.contains(event.target as Node)))
      ) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose, isShippingModalOpen]);

  useEffect(() => {
    if (!isOpen) {
      setQuantity(1);
      setIsProcessing(false);
      setShippingInfo(null);
      setShippingFee(0);
      setIsShippingModalOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (shippingInfo && isOpen) {
      fetchShippingFee(shippingInfo);
    }
  }, [quantity, shippingInfo]);

  const totalCost = item.price * quantity;
  const canPurchase = userCoins >= totalCost && quantity <= currentStock;
  const maxQuantity = Math.min(
    Math.floor(userCoins / item.price),
    currentStock,
  );

  const handleQuantityChange = (e: any) => {
    const value = Math.max(
      1,
      Math.min(maxQuantity, parseInt(e.target.value) || 1),
    );
    setQuantity(value);
  };

  const handleConfirm = () => {
    if (!shippingInfo) {
      alert("Vui lòng chọn thông tin giao hàng!");
      return;
    }
    if (
      !shippingInfo.to_ward_name ||
      !shippingInfo.to_district_name ||
      !shippingInfo.id
    ) {
      alert("Thông tin giao hàng thiếu phường/xã, quận/huyện hoặc ID!");
      return;
    }
    setIsProcessing(true);
    onConfirm(quantity, {
      ...shippingInfo,
      receiver_information_id: shippingInfo.id,
      shippingFee,
    });
    onClose();
  };

  const handleChangeShipping = () => {
    setIsShippingModalOpen(true);
  };

  const handleSelectShipping = async (selectedInfo: any) => {
    try {
      setIsLoadingShipping(true);
      setShippingInfo(selectedInfo);
      await fetchShippingFee(selectedInfo);
      setIsShippingModalOpen(false);
    } catch (error) {
      console.error("Error fetching shipping fee:", error);
    } finally {
      setIsLoadingShipping(false);
    }
  };

  return {
    quantity,
    setQuantity,
    isProcessing,
    shippingInfo,
    shippingFee,
    isShippingModalOpen,
    isLoadingShipping,
    currentStock,
    modalRef,
    shippingModalRef,
    totalCost,
    canPurchase,
    maxQuantity,
    handleQuantityChange,
    handleConfirm,
    handleChangeShipping,
    handleSelectShipping,
    setIsShippingModalOpen,
  };
}
