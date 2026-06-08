import { useState } from "react";

import {
  createShippingAccount,
  deleteShippingAccount,
  getShippingAccountsByUser,
  setDefaultShippingAccount,
  updateShippingAccount,
} from "@/src/utils/api";

const emptyShippingAccountForm = {
  name: "",
  shop_id: "",
  token: "",
  carrier: "",
  is_default: false,
};

export default function useShippingAccounts(
  userId: any,
  showAlert: (message: string, severity?: string) => void,
) {
  const [shippingAccounts, setShippingAccounts] = useState<any[]>([]);
  const [isLoadingAccounts, setIsLoadingAccounts] = useState<boolean>(false);
  const [shippingAccountsDialogOpen, setShippingAccountsDialogOpen] =
    useState<boolean>(false);
  const [addShippingAccountDialogOpen, setAddShippingAccountDialogOpen] =
    useState<boolean>(false);
  const [isEditingShippingAccount, setIsEditingShippingAccount] =
    useState<boolean>(false);
  const [selectedShippingAccount, setSelectedShippingAccount] =
    useState<any>(null);
  const [newShippingAccount, setNewShippingAccount] = useState<any>(
    emptyShippingAccountForm,
  );

  const fetchShippingAccounts = async () => {
    try {
      setIsLoadingAccounts(true);
      const response: any = await getShippingAccountsByUser();
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

      const response: any = await createShippingAccount(accountData);
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
    } catch (error: any) {
      console.error("Error adding shipping account:", error);
      let errorMessage = "Failed to add shipping account. Please try again.";
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      showAlert(errorMessage, "error");
    }
  };

  const handleEditShippingAccount = (account: any) => {
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
      const response: any = await updateShippingAccount(
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

  const handleDeleteShippingAccount = async (accountId: any) => {
    try {
      await deleteShippingAccount(accountId);
      const updatedAccounts = shippingAccounts.filter(
        (account) => account.id !== accountId,
      );

      if (
        shippingAccounts.find((acc) => acc.id === accountId)?.is_default &&
        updatedAccounts.length > 0
      ) {
        updatedAccounts[0].is_default = true;
        await setDefaultShippingAccount(updatedAccounts[0].id);
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

  const handleSetDefaultShippingAccount = async (accountId: any) => {
    try {
      const response: any = await setDefaultShippingAccount(accountId);
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
