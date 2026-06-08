"use client";

import {
  Check,
  Edit2,
  History,
  LogOut,
  MoreVertical,
  User,
  X,
} from "lucide-react";
import React from "react";

import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import getAmount from "@/src/utils/getAmount";

// Import modular subcomponents & hook
import CustomerAvatar from "./CustomerAvatar";
import CustomerInfoForm from "./CustomerInfoForm";
import CustomerStatsCard from "./CustomerStatsCard";
import TransactionHistoryList from "./TransactionHistoryList";
import useCustomerProfile from "./useCustomerProfile";

export default function CustomerProfile() {
  const {
    userInfo,
    userData,
    formData,
    editMode,
    loading,
    qrCode,
    showQrDialog,
    avatarUploading,
    transactions,
    loadingTransactions,
    loadingUserData,
    activeTab,
    setFormData,
    setActiveTab,
    setEditMode,
    setShowQrDialog,
    generateQRCode,
    handleChange,
    handleSubmit,
    handleAvatarChange,
    copyToClipboard,
    handleLogout,
  } = useCustomerProfile();

  if (loadingUserData) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
        {/* Left Side: Avatar and Quick Info (Span 4) */}
        <div className="space-y-6 md:col-span-4">
          <div className="relative overflow-hidden rounded-2xl border border-slate-100 bg-white pb-6 shadow-sm">
            {/* Emerald Header Banner */}
            <div className="relative h-28 bg-gradient-to-r from-emerald-600 to-teal-600">
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 cursor-pointer rounded-full text-white hover:bg-white/20"
                    >
                      <MoreVertical className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex cursor-pointer items-center gap-2 text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Sub-component: Avatar Picker */}
            <CustomerAvatar
              userInfo={userInfo}
              avatarUploading={avatarUploading}
              handleAvatarChange={handleAvatarChange}
            />

            {/* Sub-component: Stats & Basic Fields */}
            <div className="px-6">
              <CustomerStatsCard
                userData={userData}
                generateQRCode={generateQRCode}
                qrCode={qrCode}
                showQrDialog={showQrDialog}
                setShowQrDialog={setShowQrDialog}
                copyToClipboard={copyToClipboard}
                userInfo={userInfo}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Detailed Profile Tabs (Span 8) */}
        <div className="md:col-span-8">
          <Card className="rounded-2xl border border-slate-100 bg-white shadow-sm">
            <CardContent className="p-6">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                {/* Header Section with Tab selectors and Action buttons */}
                <div className="mb-6 flex flex-col justify-between gap-4 border-b border-slate-100 pb-4 sm:flex-row sm:items-center">
                  <TabsList className="rounded-lg bg-slate-100/60 p-1">
                    <TabsTrigger
                      value="profile"
                      className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-xs"
                    >
                      <User className="h-4 w-4" />
                      Profile Details
                    </TabsTrigger>
                    <TabsTrigger
                      value="transactions"
                      className="flex cursor-pointer items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold text-slate-600 transition-all data-[state=active]:bg-white data-[state=active]:text-emerald-700 data-[state=active]:shadow-xs"
                    >
                      <History className="h-4 w-4" />
                      Transaction History
                    </TabsTrigger>
                  </TabsList>

                  {/* Actions (Only visible in Profile Tab) */}
                  {activeTab === "profile" &&
                    (editMode ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setEditMode(false);
                            setFormData({
                              full_name: userData?.full_name || "",
                              email: userData?.email || "",
                              phone_number: userData?.phone_number || "",
                              username: userData?.username || "",
                            });
                          }}
                          className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border-red-200 font-bold text-red-600 transition-colors hover:bg-red-50"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={loading}
                          className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-emerald-600 font-bold text-white transition-colors hover:bg-emerald-700"
                        >
                          {loading ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                          ) : (
                            <>
                              <Check className="h-4 w-4" />
                              Save
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setEditMode(true)}
                        className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border-emerald-600 font-bold text-emerald-700 transition-colors hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        <Edit2 className="h-4 w-4" />
                        Edit Profile
                      </Button>
                    ))}
                </div>

                {/* Tab: Profile Form */}
                <TabsContent value="profile" className="mt-0 outline-none">
                  <CustomerInfoForm
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    editMode={editMode}
                  />
                </TabsContent>

                {/* Tab: Transactions History list */}
                <TabsContent value="transactions" className="mt-0 outline-none">
                  <div className="space-y-4">
                    <h3 className="text-lg font-bold text-slate-800">
                      Transaction History
                    </h3>
                    <TransactionHistoryList
                      transactions={transactions}
                      loadingTransactions={loadingTransactions}
                      getAmount={getAmount}
                    />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
