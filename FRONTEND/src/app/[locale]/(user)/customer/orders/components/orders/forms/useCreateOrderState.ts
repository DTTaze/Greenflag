import { useEffect, useState } from "react";

import { getShippingAccountsByUser } from "@/src/utils/api";

import useLocationSelector from "./useLocationSelector";

interface UseCreateOrderStateProps {
  newOrder: any;
  setNewOrder: React.Dispatch<React.SetStateAction<any>>;
  isViewMode: boolean;
}

export default function useCreateOrderState({
  newOrder,
  setNewOrder,
  isViewMode,
}: UseCreateOrderStateProps) {
  const [servicePackage] = useState<string>(newOrder.servicePackage || "light");
  const [pickupOption, setPickupOption] = useState<string>(
    newOrder.pickupOption || "pickup",
  );
  const [productListDialogOpen, setProductListDialogOpen] =
    useState<boolean>(false);
  const [formValid, setFormValid] = useState<boolean>(false);

  // Hook instances for sender & receiver locations
  const senderLocation = useLocationSelector(
    newOrder.from_province_id,
    newOrder.from_district_id,
    newOrder.from_ward_code,
  );

  const receiverLocation = useLocationSelector(
    newOrder.to_province_id,
    newOrder.to_district_id,
    newOrder.to_ward_code,
  );

  // Functional update helper to ensure merged state updates
  const updateOrder = (updatedValues: any) => {
    setNewOrder((prev: any) => ({
      ...prev,
      ...updatedValues,
    }));
  };

  // Form validation effect
  useEffect(() => {
    const requiredFields = {
      from_name: newOrder.from_name,
      from_phone: newOrder.from_phone,
      from_address: newOrder.from_address,
      from_province_name: newOrder.from_province_name,
      from_district_name: newOrder.from_district_name,
      from_ward_name: newOrder.from_ward_name,

      to_name: newOrder.to_name,
      to_phone: newOrder.to_phone,
      to_address: newOrder.to_address,
      to_province_name: newOrder.to_province_name,
      to_district_name: newOrder.to_district_name,
      to_ward_name: newOrder.to_ward_name,

      items:
        newOrder.items &&
        newOrder.items.length > 0 &&
        newOrder.items[0].name &&
        newOrder.items[0].weight,
    };

    const isValid = Object.values(requiredFields).every((field) => !!field);
    setFormValid(isValid);
  }, [newOrder]);

  // Initial data setup on mount
  useEffect(() => {
    if (!newOrder.items || newOrder.items.length === 0) {
      const defaultItem = {
        name: newOrder.productName || "",
        code: newOrder.productCode || "",
        quantity: parseInt(newOrder.productQuantity) || 1,
        price: parseInt(newOrder.codAmount) || 0,
        length: parseInt(newOrder.length) || 0,
        width: parseInt(newOrder.with) || 0,
        height: parseInt(newOrder.height) || 0,
        weight: parseInt(newOrder.weight) || 0,
        category: {
          level1: "Áo",
        },
      };

      if (newOrder.productName || newOrder.productCode || newOrder.from_phone) {
        updateOrder({ items: [defaultItem] });
      }
    }

    // Clean location IDs and codes from parent state to avoid sending in payload
    setNewOrder((prev: any) => {
      const cleaned = { ...prev };
      delete cleaned.from_province_id;
      delete cleaned.from_district_id;
      delete cleaned.from_ward_code;
      delete cleaned.to_province_id;
      delete cleaned.to_district_id;
      delete cleaned.to_ward_code;
      return cleaned;
    });
  }, []);

  const handlePickupOptionChange = (event: any) => {
    if (isViewMode) return;
    setPickupOption(event.target.value);
    updateOrder({ pickupOption: event.target.value });
  };

  const handleAddProduct = (product: any) => {
    if (isViewMode) return;

    const newItem = {
      name: product.name || "",
      code: product.code || "",
      quantity: product.quantity || 1,
      price: 0,
      length: 0,
      width: 0,
      height: 0,
      weight: product.weight || 0,
      category: {
        level1: "",
      },
    };

    updateOrder({
      items: [...(newOrder.items || []), newItem],
      weight: product.weight,
      height: product.height,
      width: product.width,
      length: product.length,
    });
  };

  const handleUseTokenForShipping = async () => {
    try {
      const accountsResponse = await getShippingAccountsByUser();
      if (
        !accountsResponse ||
        !accountsResponse.data ||
        accountsResponse.data.length === 0
      ) {
        alert(
          "No shipping accounts found. Please add a shipping account first.",
        );
        return;
      }

      const defaultAccount =
        accountsResponse.data.find((acc: any) => acc.is_default) ||
        accountsResponse.data[0];

      alert("Successfully retrieved sender information from GHN account");

      updateOrder({
        from_name: defaultAccount.account_name || "Shop Name",
        from_phone: defaultAccount.phone || "0987654321",
        from_address: defaultAccount.address || "123 Test Street",
      });
    } catch (error) {
      console.error("Error fetching token information:", error);
      alert("Failed to retrieve information from token. Please try again.");
    }
  };

  // Wrapped location setters to properly clear lower-level states
  const handleSetFromProvinceId = (id: any) => {
    senderLocation.setProvinceId(id);
    senderLocation.setDistrictId(null);
    senderLocation.setWardCode("");
    updateOrder({
      from_district_name: "",
      from_ward_name: "",
    });
  };

  const handleSetFromDistrictId = (id: any) => {
    senderLocation.setDistrictId(id);
    senderLocation.setWardCode("");
    updateOrder({
      from_ward_name: "",
    });
  };

  const handleSetToProvinceId = (id: any) => {
    receiverLocation.setProvinceId(id);
    receiverLocation.setDistrictId(null);
    receiverLocation.setWardCode("");
    updateOrder({
      to_district_name: "",
      to_ward_name: "",
    });
  };

  const handleSetToDistrictId = (id: any) => {
    receiverLocation.setDistrictId(id);
    receiverLocation.setWardCode("");
    updateOrder({
      to_ward_name: "",
    });
  };

  return {
    servicePackage,
    pickupOption,
    handlePickupOptionChange,
    productListDialogOpen,
    setProductListDialogOpen,
    formValid,
    senderLocation,
    receiverLocation,
    updateOrder,
    handleAddProduct,
    handleUseTokenForShipping,
    handleSetFromProvinceId,
    handleSetFromDistrictId,
    handleSetToProvinceId,
    handleSetToDistrictId,
  };
}
