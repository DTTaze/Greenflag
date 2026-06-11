"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  useAdminDeleteUserMutation,
  useAdminUpdateUserMutation,
  useAdminUsersQuery,
} from "@/src/queries/user/useUserQueries";
import { AdminUpdateUserPayload, AdminUserDTO } from "@/src/types/admin";

import DataTable, { DataTableColumn } from "../components/DataTable";
import UserActionModal from "./components/UserActionModal";
import UserDetailDrawer from "./components/UserDetailDrawer";
import UserEditModal from "./components/UserEditModal";

export default function UserManagementPage() {
  const t = useTranslations("admin.users");
  const tCommon = useTranslations("admin.common");

  const [selectedUser, setSelectedUser] = useState<AdminUserDTO | null>(null);
  const [actionType, setActionType] = useState<
    "lock" | "unlock" | "delete" | null
  >(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isUpdatingUser, setIsUpdatingUser] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [requestError, setRequestError] = useState<string | null>(null);

  const { data, isLoading } = useAdminUsersQuery();
  const { mutate: deleteUser } = useAdminDeleteUserMutation();
  const { mutate: updateUser } = useAdminUpdateUserMutation();

  const users = (data || []) as AdminUserDTO[];

  const columns: DataTableColumn<AdminUserDTO>[] = [
    {
      field: "username",
      headerName: tCommon("username"),
      width: "150px",
    },
    {
      field: "email",
      headerName: tCommon("email"),
      width: "250px",
      render: (email) => (
        <a
          href={`mailto:${email}`}
          className="text-emerald-600 hover:underline dark:text-emerald-400"
        >
          {email}
        </a>
      ),
    },
    {
      field: "profile",
      headerName: t("fullName"),
      render: (profile) => profile?.fullName || "-",
    },
    {
      field: "role",
      headerName: tCommon("role"),
      width: "120px",
    },
    {
      field: "status",
      headerName: tCommon("status"),
      width: "120px",
    },
    {
      field: "coin",
      headerName: t("coins"),
      render: (coin) => `${coin?.amount || 0} EcoCoins`,
      width: "140px",
    },
    {
      field: "lastActivityDate",
      headerName: t("lastActivity"),
      render: (date) =>
        date ? new Date(date).toLocaleDateString("en-GB") : "-",
      width: "140px",
    },
  ];

  const handleViewUser = (user: AdminUserDTO) => {
    setSelectedUser(user);
    setIsDrawerOpen(true);
  };

  const handleEditUser = (user: AdminUserDTO) => {
    setSelectedUser(user);
    setIsEditOpen(true);
  };

  const handleDeleteUser = (user: AdminUserDTO) => {
    setSelectedUser(user);
    setActionType("delete");
  };

  const handleActionConfirm = async (
    type: "lock" | "unlock" | "delete",
    _reason?: string,
  ) => {
    if (!selectedUser) return;

    if (type === "delete") {
      deleteUser(selectedUser.id, {
        onSuccess: () => {
          setFlashMessage(t("deleteSuccess"));
          setRequestError(null);
          setSelectedUser(null);
          setActionType(null);
        },
        onError: () => {
          setFlashMessage(null);
          setRequestError(t("actionFailed"));
        },
      });
    } else {
      setFlashMessage(null);
      setRequestError(
        "This admin action requires backend support for locking and unlocking users.",
      );
      setActionType(null);
    }
  };

  const handleUpdateUser = (payload: AdminUpdateUserPayload) => {
    if (!selectedUser) return;

    setIsUpdatingUser(true);
    updateUser(
      { id: selectedUser.id, data: payload },
      {
        onSuccess: () => {
          setFlashMessage(t("saveSuccess"));
          setRequestError(null);
          setSelectedUser(null);
          setIsEditOpen(false);
        },
        onError: () => {
          setFlashMessage(null);
          setRequestError(t("updateFailed"));
        },
        onSettled: () => {
          setIsUpdatingUser(false);
        },
      },
    );
  };

  const handleActionCancel = () => {
    setSelectedUser(null);
    setActionType(null);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
          {t("title")}
        </h1>
        <p className="mt-2 text-gray-600 dark:text-slate-400">
          {t("subtitle")}
        </p>
      </div>

      {flashMessage && (
        <div className="mb-4 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 dark:border-emerald-700 dark:bg-emerald-900/10 dark:text-emerald-200">
          {flashMessage}
        </div>
      )}

      {requestError && (
        <div className="mb-4 rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800 dark:border-rose-700 dark:bg-rose-900/10 dark:text-rose-200">
          {requestError}
        </div>
      )}

      <DataTable
        title={t("title")}
        columns={columns}
        rows={users}
        onView={handleViewUser}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        loading={isLoading}
        enableSelection={true}
      />

      {/* User Detail Drawer */}
      {selectedUser && (
        <UserDetailDrawer
          user={selectedUser}
          isOpen={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
            setSelectedUser(null);
          }}
        />
      )}

      {/* Action Modals */}
      {selectedUser && isEditOpen && (
        <UserEditModal
          user={selectedUser}
          isOpen={isEditOpen}
          onClose={() => {
            setIsEditOpen(false);
            setSelectedUser(null);
          }}
          onSave={handleUpdateUser}
          isSaving={isUpdatingUser}
        />
      )}

      {selectedUser && actionType && (
        <UserActionModal
          user={selectedUser}
          actionType={actionType}
          onConfirm={handleActionConfirm}
          onCancel={handleActionCancel}
        />
      )}
    </div>
  );
}
