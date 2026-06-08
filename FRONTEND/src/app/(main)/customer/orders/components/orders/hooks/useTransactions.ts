import { useState } from "react";

import {
  getSellerTransactionHistory,
  getTransactionById,
  makeTransactionDecision,
  updateShippingOrder,
} from "@/src/utils/api";

interface UseTransactionsProps {
  shippingAccounts: any[];
  showAlert: (message: string, severity?: string) => void;
  selectedOrder: any;
  setSelectedOrder: React.Dispatch<React.SetStateAction<any>>;
  setDetailsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setNewOrder: React.Dispatch<React.SetStateAction<any>>;
  setIsCreatingBasedOn: React.Dispatch<React.SetStateAction<boolean>>;
  setCreateDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  fetchOrders: () => Promise<void>;
}

export default function useTransactions({
  shippingAccounts,
  showAlert,
  selectedOrder,
  setSelectedOrder,
  setDetailsDialogOpen,
  setNewOrder,
  setIsCreatingBasedOn,
  setCreateDialogOpen,
  fetchOrders,
}: UseTransactionsProps) {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [isLoadingTransactions, setIsLoadingTransactions] = useState<boolean>(false);
  const [buyerInfoDialogOpen, setBuyerInfoDialogOpen] = useState<boolean>(false);
  const [buyerInfo, setBuyerInfo] = useState<any>({
    name: "",
    phone: "",
    email: "",
    notes: "",
  });

  const fetchTransactions = async () => {
    try {
      setIsLoadingTransactions(true);
      const response: any = await getSellerTransactionHistory();
      if (response && response.data) {
        setTransactions(response.data);
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      showAlert("Failed to load purchase requests. Please try again.", "error");
    } finally {
      setIsLoadingTransactions(false);
    }
  };

  const handleCancelOrder = async (transactionId: any) => {
    try {
      const response: any = await makeTransactionDecision(transactionId, "rejected");
      if (response && response.data) {
        showAlert("Transaction has been rejected successfully!");
        fetchTransactions();
      }
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      showAlert("Failed to reject transaction. Please try again.", "error");
    }
  };

  const handleConfirmOrder = async (transactionId: any) => {
    try {
      const response: any = await makeTransactionDecision(transactionId, "accepted");
      if (response && response.data) {
        showAlert("Transaction has been accepted successfully!");
        fetchTransactions();
      }
    } catch (error) {
      console.error("Error accepting transaction:", error);
      showAlert("Failed to accept transaction. Please try again.", "error");
    }
  };

  const handleViewDetails = async (transaction: any) => {
    try {
      const response: any = await getTransactionById(transaction.id);
      if (response && response.data) {
        const transactionDetails = {
          ...response.data,
          timeline: [
            {
              time: new Date(response.data.created_at).toLocaleString(),
              status: "Transaction Created",
            },
            {
              time: new Date(response.data.updated_at).toLocaleString(),
              status: `Status: ${response.data.status}`,
            },
          ],
          locationHistory: [
            {
              time: new Date(response.data.created_at).toLocaleString(),
              location: "Transaction Created",
              status: response.data.status,
            },
          ],
        };
        setSelectedOrder(transactionDetails);
        setTimeout(() => {
          setDetailsDialogOpen(true);
        }, 10);
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      showAlert(
        "Failed to load transaction details. Please try again.",
        "error",
      );
    }
  };

  const handleOpenEditBuyerInfo = (order: any) => {
    setSelectedOrder(order);
    setBuyerInfo({
      name: order.buyerName || "",
      phone: order.buyerPhone || "",
      email: order.buyerEmail || "",
      notes: order.notes || "",
    });
    setBuyerInfoDialogOpen(true);
  };

  const handleUpdateBuyerInfo = async (ordersList: any[], setOrdersList: React.Dispatch<React.SetStateAction<any[]>>) => {
    try {
      if (!selectedOrder) {
        throw new Error("No order selected");
      }

      const shippingAccount =
        shippingAccounts.find((account) => account.is_default) ||
        shippingAccounts[0];

      if (!shippingAccount) {
        throw new Error("No shipping account found to update this order");
      }

      const updateData = {
        order_code: selectedOrder.orderCode,
        to_name: buyerInfo.name || selectedOrder.to_name,
        to_phone: buyerInfo.phone || selectedOrder.to_phone,
        note: buyerInfo.notes || selectedOrder.notes,
      };

      await updateShippingOrder({
        orderData: updateData,
        token: shippingAccount.token,
        shopId: shippingAccount.shop_id,
      });

      const updatedOrders = ordersList.map((order) => {
        if (order.id === selectedOrder.id) {
          return {
            ...order,
            to_name: buyerInfo.name || order.to_name,
            to_phone: buyerInfo.phone || order.to_phone,
            notes: buyerInfo.notes || order.notes,
            timeline: [
              ...order.timeline,
              {
                time: new Date().toLocaleString(),
                status: "Buyer Information Updated",
              },
            ],
          };
        }
        return order;
      });

      setOrdersList(updatedOrders);
      setBuyerInfoDialogOpen(false);
      showAlert("Buyer information updated successfully!");
      fetchOrders();
    } catch (error) {
      console.error("Error updating buyer information:", error);
      showAlert(
        "Failed to update buyer information. Please try again.",
        "error",
      );
    }
  };

  const handleCreateOrderFromTransaction = async (transaction: any) => {
    try {
      const response: any = await getTransactionById(transaction.id);

      if (response && response.data) {
        const transactionDetails = response.data;
        const orderData = {
          payment_type_id: 2,
          required_note: "KHONGCHOXEMHANG",
          weight: transactionDetails.item.weight || 200,
          transaction_id: transactionDetails.id,
          to_name: transactionDetails.receiver_information?.to_name,
          to_phone: transactionDetails.receiver_information?.to_phone,
          to_address: transactionDetails.receiver_information?.to_address,
          to_ward_name: transactionDetails.receiver_information?.to_ward_name,
          to_district_name:
            transactionDetails.receiver_information?.to_district_name,
          to_province_name:
            transactionDetails.receiver_information?.to_province_name,
          content: transactionDetails.item_snapshot?.name,
          cod_amount: transactionDetails.total_price,
          length: transactionDetails.item.length || 10,
          width: transactionDetails.item.width || 10,
          height: transactionDetails.item.height || 10,
          items: [
            {
              code: transactionDetails.public_id,
              name: transactionDetails.item.name,
              quantity: transactionDetails.quantity,
              price:
                transactionDetails.total_price / transactionDetails.quantity,
              length: transactionDetails.item.length || 10,
              width: transactionDetails.item.width || 10,
              height: transactionDetails.item.height || 10,
              weight: transactionDetails.item.weight || 200,
            },
          ],
        };

        setSelectedOrder(transactionDetails);
        setNewOrder(orderData);
        setIsCreatingBasedOn(true);
        setCreateDialogOpen(true);
      }
    } catch (error) {
      console.error("Error fetching transaction details:", error);
      showAlert(
        "Failed to load transaction details. Please try again.",
        "error",
      );
    }
  };

  return {
    transactions,
    isLoadingTransactions,
    buyerInfoDialogOpen,
    setBuyerInfoDialogOpen,
    buyerInfo,
    setBuyerInfo,
    fetchTransactions,
    handleConfirmOrder,
    handleCancelOrder,
    handleViewDetails,
    handleOpenEditBuyerInfo,
    handleUpdateBuyerInfo,
    handleCreateOrderFromTransaction,
  };
}
