import { useState } from "react";

import {
  createShippingAccountApi,
  deleteShippingAccountApi,
  getShippingAccountsByUserApi,
  setDefaultShippingAccountApi,
  updateShippingAccountApi,
} from "@/src/utils/api";

const emptyShippingAccountForm = {
  name: "",
  shop_id: "",
  token: "",
  carrier: "",
  is_default: false,
};

export default function useShippingAccounts(userId, showAlert) {
  const [shippingAccounts, setShippingAccounts] = useState([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(false);
  const [shippingAccountsDialogOpen, setShippingAccountsDialogOpen] =
    useState(false);
  const [addShippingAccountDialogOpen, setAddShippingAccountDialogOpen] =
    useState(false);
  const [isEditingShippingAccount, setIsEditingShippingAccount] =
    useState(false);
  const [selectedShippingAccount, setSelectedShippingAccount] = useState(null);
  const [newShippingAccount, setNewShippingAccount] = useState(
    emptyShippingAccountForm,
  );

  const fetchShippingAccounts = async () => {
    try {
      setIsLoadingAccounts(true);
      const response = await getShippingAccountsByUserApi();
      if (response.status === 200) {
        setShippingAccounts(response.data);
      }
    } catch (error) {
      console.error("Error fetching shipping accounts:", error);
      showAlert("Failed to load shipping accounts. Please try again.", "error");
    } finally {
      setIsLoadingAccounts(false);
    }
  };

  const resetShippingAccountForm = () => {
    setNewShippingAccount(emptyShippingAccountForm);
  };

  const handleAddShippingAccount = async () => {
    try {
      const accountData = {
        ...newShippingAccount,
        user_id: userId,
        is_default: shippingAccounts.length === 0,
      };

      const response = await createShippingAccountApi(accountData);
      if (response && response.data) {
        setShippingAccounts((prev) => [...prev, response.data]);
        setAddShippingAccountDialogOpen(false);
        showAlert("Shipping account added successfully!");
        resetShippingAccountForm();
      } else {
        await fetchShippingAccounts();
        setAddShippingAccountDialogOpen(false);
        showAlert("Shipping account added successfully!");
        resetShippingAccountForm();
      }
    } catch (error) {
      console.error("Error adding shipping account:", error);
      let errorMessage = "Failed to add shipping account. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showAlert(errorMessage, "error");
    }
  };

  const handleEditShippingAccount = (account) => {
    setSelectedShippingAccount(account);
    setNewShippingAccount({
      name: account.name,
      shop_id: account.shop_id,
      token: account.token,
      carrier: account.carrier,
    });
    setIsEditingShippingAccount(true);
    setShippingAccountsDialogOpen(false);
    setAddShippingAccountDialogOpen(true);
  };

  const handleUpdateShippingAccount = async () => {
    try {
      const response = await updateShippingAccountApi(
        selectedShippingAccount.id,
        newShippingAccount,
      );
      if (response && response.data) {
        setShippingAccounts((prev) =>
          prev.map((acc) =>
            acc.id === response.data.id ? response.data : acc,
          ),
        );
      }
      setAddShippingAccountDialogOpen(false);
      setIsEditingShippingAccount(false);
      showAlert("Shipping account updated successfully!");
      resetShippingAccountForm();
    } catch (error) {
      console.error("Error updating shipping account:", error);
      showAlert(
        "Failed to update shipping account. Please try again.",
        "error",
      );
    }
  };

  const handleDeleteShippingAccount = async (accountId) => {
    try {
      await deleteShippingAccountApi(accountId);
      const updatedAccounts = shippingAccounts.filter(
        (account) => account.id !== accountId,
      );

      if (
        shippingAccounts.find((acc) => acc.id === accountId)?.is_default &&
        updatedAccounts.length > 0
      ) {
        updatedAccounts[0].is_default = true;
        await setDefaultShippingAccountApi(updatedAccounts[0].id);
      }

      setShippingAccounts(updatedAccounts);
      showAlert("Shipping account removed successfully!");
    } catch (error) {
      console.error("Error deleting shipping account:", error);
      showAlert(
        "Failed to delete shipping account. Please try again.",
        "error",
      );
    }
  };

  const handleSetDefaultShippingAccount = async (accountId) => {
    try {
      const response = await setDefaultShippingAccountApi(accountId);
      if (response && response.data) {
        setShippingAccounts((prev) =>
          prev.map((account) =>
            account.id === response.data.id
              ? { ...response.data, is_default: true }
              : { ...account, is_default: false },
          ),
        );
      }
      showAlert("Default shipping account updated!");
    } catch (error) {
      console.error("Error setting default shipping account:", error);
      showAlert(
        "Failed to update default shipping account. Please try again.",
        "error",
      );
    }
  };

  return {
    shippingAccounts,
    isLoadingAccounts,
    shippingAccountsDialogOpen,
    setShippingAccountsDialogOpen,
    addShippingAccountDialogOpen,
    setAddShippingAccountDialogOpen,
    isEditingShippingAccount,
    newShippingAccount,
    setNewShippingAccount,
    fetchShippingAccounts,
    handleAddShippingAccount,
    handleEditShippingAccount,
    handleUpdateShippingAccount,
    handleDeleteShippingAccount,
    handleSetDefaultShippingAccount,
    resetShippingAccountForm,
  };
}
