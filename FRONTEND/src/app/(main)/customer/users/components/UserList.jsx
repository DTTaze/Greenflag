import { useMediaQuery, useTheme } from "@mui/material";
import React from "react";

import UserDesktopTable from "./UserDesktopTable";
import UserMobileList from "./UserMobileList";

const UserList = ({
  users,
  onEvaluate,
  onAddToEvent,
  onRemoveUser,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!isMobile) {
    return (
      <UserDesktopTable
        users={users}
        onRemoveUser={onRemoveUser}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={onPageChange}
        onRowsPerPageChange={onRowsPerPageChange}
      />
    );
  }

  return (
    <UserMobileList
      users={users}
      onEvaluate={onEvaluate}
      onAddToEvent={onAddToEvent}
    />
  );
};

export default UserList;
