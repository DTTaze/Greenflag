"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "react-toastify";

import { deleteTransaction, getAllTransactions } from "@/src/utils/api";

import DataTable from "../../components/DataTable";
import { transactionsColumns } from "../../components/HeaderColumn";

export default function TransactionsManagement() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  const tCommon = useTranslations("admin.common");
  const tSidebar = useTranslations("admin.sidebar");

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
    if (window.confirm(tCommon("confirmBulkDelete").replace("{count}", "1"))) {
      try {
        const res = await deleteTransaction(transaction.id);
        if (res.success) {
          toast.success(tCommon("deleteSuccess"));
          setTransactions((prev) =>
            prev.filter((u) => u.id !== transaction.id),
          );
        } else {
          toast.error(tCommon("deleteFailed"));
        }
      } catch (e) {
        console.log(e);
        toast.error(tCommon("deleteFailed"));
      }
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-950 dark:text-zinc-50">
        {tSidebar("transactionManage")}
      </h1>
      <DataTable
        title={tSidebar("transactions")}
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
