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
  return (
    <>
      <div className="hidden md:block">
        <UserDesktopTable
          users={users}
          onRemoveUser={onRemoveUser}
          page={page}
          rowsPerPage={rowsPerPage}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
        />
      </div>
      <div className="block md:hidden">
        <UserMobileList
          users={users}
          onEvaluate={onEvaluate}
          onAddToEvent={onAddToEvent}
        />
      </div>
    </>
  );
};

export default UserList;
