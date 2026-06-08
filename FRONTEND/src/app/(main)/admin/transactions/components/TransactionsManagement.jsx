import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

import { deleteTransactionsApi, getAllTransactionsApi } from "@/src/utils/api";

import DataTable from "../../components/DataTable";
import { transactionsColumns } from "../../components/HeaderColumn";

export default function TransactionsManagement() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await getAllTransactionsApi();
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
    const res = await deleteTransactionsApi(transaction.id);
    console.log(transaction, transaction.id);
    if (confirm("Bạn có chắc chắn muốn xóa không?")) {
      if (res.success) {
        alert("Xóa giao dịch thành công!");
        setTransactions((prev) => prev.filter((u) => u.id !== transaction.id));
      }
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" component="h1" sx={{ mb: 3 }}>
        Transactions Management
      </Typography>
      <DataTable
        title="Transactions"
        columns={transactionsColumns}
        rows={transactions}
        onAdd={false}
        onEdit={false}
        onDelete={handleDeleteTransaction}
        loading={loading}
      />
    </Box>
  );
}
