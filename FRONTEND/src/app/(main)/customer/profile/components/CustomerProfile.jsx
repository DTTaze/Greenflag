"use client";

import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { 
  User, 
  History, 
  Edit2, 
  X, 
  Check, 
  MoreVertical, 
  LogOut 
} from "lucide-react";

import { useNotification } from "@/src/components/ui/NotificationProvider";
import {
  getUserApi,
  updateUserApi,
  uploadUserAvatarApi,
  getBuyerTransactionHistory,
  getQRApi,
  logoutUserApi,
} from "@/src/utils/api";
import getAmount from "@/src/utils/getAmount";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent } from "@/src/components/ui/card";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/src/components/ui/dropdown-menu";

// Import modular subcomponents
import CustomerAvatar from "./CustomerAvatar";
import CustomerStatsCard from "./CustomerStatsCard";
import CustomerInfoForm from "./CustomerInfoForm";
import TransactionHistoryList from "./TransactionHistoryList";

export default function CustomerProfile() {
  const userInfo = useOutletContext();
  const { notify } = useNotification();
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState(null);
  const [showQrDialog, setShowQrDialog] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [loadingTransactions, setLoadingTransactions] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUserData, setLoadingUserData] = useState(true);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    username: "",
  });

  // Fetch the latest user data
  useEffect(() => {
    const fetchUserData = async () => {
      setLoadingUserData(true);
      try {
        const response = await getUserApi();
        if (response?.data) {
          setUserData(response.data);
          setFormData({
            full_name: response.data.full_name || "",
            email: response.data.email || "",
            phone_number: response.data.phone_number || "",
            username: response.data.username || "",
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        notify("error", "Could not fetch user data. Please try again later.");
      } finally {
        setLoadingUserData(false);
      }
    };

    fetchUserData();
  }, [notify]);

  // Fetch transactions if activeTab is "transactions"
  useEffect(() => {
    if (activeTab === "transactions" && userInfo?.id) {
      const fetchTransactions = async () => {
        setLoadingTransactions(true);
        try {
          const response = await getBuyerTransactionHistory(userInfo.id);
          if (response?.data) {
            setTransactions(response.data);
          }
        } catch (error) {
          console.error("Error fetching transactions:", error);
          notify("error", "Could not fetch transaction history.");
        } finally {
          setLoadingTransactions(false);
        }
      };

      fetchTransactions();
    }
  }, [activeTab, userInfo?.id, notify]);

  const generateQRCode = async () => {
    try {
      const response = await getQRApi(userInfo?.public_id || "");
      if (response?.data) {
        setQrCode(response.data);
        setShowQrDialog(true);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      notify("error", "Could not generate QR code. Please try again later.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const response = await updateUserApi(userInfo?.id, formData);
      if (response?.data) {
        notify("success", "Profile updated successfully!");
        setEditMode(false);
        // Update user data state
        setUserData({ ...userData, ...formData });
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      notify("error", "Failed to update profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      notify("error", "Image size should be less than 5MB");
      return;
    }

    if (!file.type.match("image.*")) {
      notify("error", "Please select an image file");
      return;
    }

    setAvatarUploading(true);
    try {
      const response = await uploadUserAvatarApi(userInfo?.id, file);
      if (response?.data) {
        notify("success", "Profile picture updated successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      notify(
        "error",
        "Failed to upload profile picture. Please try again later."
      );
    } finally {
      setAvatarUploading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    notify("success", "Copied to clipboard!");
  };

  const handleLogout = async () => {
    try {
      const response = await logoutUserApi();
      if (response?.success) {
        notify("success", "Đăng xuất thành công");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error logging out:", error);
      notify("error", "Failed to log out. Please try again.");
    }
  };

  if (loadingUserData) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left Side: Avatar and Quick Info (Span 4) */}
        <div className="md:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden relative pb-6">
            
            {/* Emerald Header Banner */}
            <div className="h-28 bg-gradient-to-r from-emerald-600 to-teal-600 relative">
              <div className="absolute top-4 right-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 rounded-full h-8 w-8 cursor-pointer">
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-white">
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 flex items-center gap-2 cursor-pointer">
                      <LogOut className="w-4 h-4" />
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
          <Card className="border border-slate-100 shadow-sm bg-white rounded-2xl">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                
                {/* Header Section with Tab selectors and Action buttons */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-100 pb-4 mb-6 gap-4">
                  <TabsList className="bg-slate-100/60 p-1 rounded-lg">
                    <TabsTrigger 
                      value="profile" 
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-xs data-[state=active]:text-emerald-700 text-slate-600 cursor-pointer"
                    >
                      <User className="w-4 h-4" />
                      Profile Details
                    </TabsTrigger>
                    <TabsTrigger 
                      value="transactions" 
                      className="flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-md transition-all data-[state=active]:bg-white data-[state=active]:shadow-xs data-[state=active]:text-emerald-700 text-slate-600 cursor-pointer"
                    >
                      <History className="w-4 h-4" />
                      Transaction History
                    </TabsTrigger>
                  </TabsList>

                  {/* Actions (Only visible in Profile Tab) */}
                  {activeTab === "profile" && (
                    editMode ? (
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
                          className="border-red-200 text-red-600 hover:bg-red-50 flex items-center gap-1.5 font-bold h-9 rounded-lg transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </Button>
                        <Button
                          onClick={handleSubmit}
                          disabled={loading}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-1.5 font-bold h-9 rounded-lg transition-colors cursor-pointer"
                        >
                          {loading ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          ) : (
                            <>
                              <Check className="w-4 h-4" />
                              Save
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => setEditMode(true)}
                        className="border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800 flex items-center gap-1.5 font-bold h-9 rounded-lg transition-colors cursor-pointer"
                      >
                        <Edit2 className="w-4 h-4" />
                        Edit Profile
                      </Button>
                    )
                  )}
                </div>

                {/* Tab: Profile Form */}
                <TabsContent value="profile" className="mt-0 outline-none">
                  <CustomerInfoForm 
                    formData={formData}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    editMode={editMode}
                    loading={loading}
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
