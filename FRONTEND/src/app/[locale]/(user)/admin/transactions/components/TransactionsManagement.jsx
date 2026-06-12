"use client";

import React, { useEffect, useState } from "react";

import { deleteTransaction, getAllTransactions } from "@/src/utils/api";

import DataTable from "../../components/DataTable";
import { transactionsColumns } from "../../components/HeaderColumn";

export default function TransactionsManagement() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllTransactions();
        if (res.success) {
          setTransactions(res.data);
        } else {
          console.log(res.error);
        }
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDeleteTransaction = async (transaction) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa không?")) {
      try {
        const res = await deleteTransaction(transaction.id);
        if (res.success) {
          alert("Xóa giao dịch thành công!");
          setTransactions((prev) =>
            prev.filter((u) => u.id !== transaction.id),
          );
        } else {
          alert("Xóa giao dịch thất bại!");
        }
      } catch (e) {
        console.log(e);
      }
    }
  };

  return (
    <div className="space-y-4 p-4">
      <h1 className="text-2xl font-bold text-gray-950">
        Transactions Management
      </h1>
      <DataTable
        title="Transactions"
        columns={transactionsColumns}
        rows={transactions}
        onAdd={false}
        onEdit={false}
        onDelete={handleDeleteTransaction}
        enableSelection={false}
        loading={loading}
      />
    </div>
  );
}
