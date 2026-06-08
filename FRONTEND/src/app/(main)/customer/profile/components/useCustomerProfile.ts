import { useEffect, useState } from "react";

import { useNotification } from "@/src/components/ui/NotificationProvider";
import { useAuthStore } from "@/src/store/auth/authStore";
import {
  getBuyerTransactionHistory,
  getQR,
  getUser,
  logoutUser,
  updateUser,
  uploadUserAvatar,
} from "@/src/utils/api";

export default function useCustomerProfile() {
  const { user } = useAuthStore();
  const userInfo = user as any;
  const { notify } = useNotification() as any;
  const [activeTab, setActiveTab] = useState<string>("profile");
  const [editMode, setEditMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [qrCode, setQrCode] = useState<any>(null);
  const [showQrDialog, setShowQrDialog] = useState<boolean>(false);
  const [avatarUploading, setAvatarUploading] = useState<boolean>(false);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState<boolean>(false);
  const [userData, setUserData] = useState<any>(null);
  const [loadingUserData, setLoadingUserData] = useState<boolean>(true);

  const [formData, setFormData] = useState<any>({
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
        const response: any = await getUser();
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
          const response: any = await getBuyerTransactionHistory();
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
      const response: any = await getQR(userInfo?.public_id || "");
      if (response?.data) {
        setQrCode(response.data);
        setShowQrDialog(true);
      }
    } catch (error) {
      console.error("Error generating QR code:", error);
      notify("error", "Could not generate QR code. Please try again later.");
    }
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: any) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      const response: any = await updateUser(userInfo?.id, formData);
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

  const handleAvatarChange = async (e: any) => {
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
      const response: any = await uploadUserAvatar(userInfo?.id, file);
      if (response?.data) {
        notify("success", "Profile picture updated successfully!");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error uploading avatar:", error);
      notify(
        "error",
        "Failed to upload profile picture. Please try again later.",
      );
    } finally {
      setAvatarUploading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    notify("success", "Copied to clipboard!");
  };

  const handleLogout = async () => {
    try {
      const response: any = await logoutUser();
      if (response?.success) {
        notify("success", "Đăng xuất thành công");
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error logging out:", error);
      notify("error", "Failed to log out. Please try again.");
    }
  };

  return {
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
  };
}
