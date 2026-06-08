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
  const userInfo = user;
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
        const response = await getUser();
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
      const response = await getQR(userInfo?.public_id || "");
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
      const response = await updateUser(userInfo?.id, formData);
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
      const response = await uploadUserAvatar(userInfo?.id, file);
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

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    notify("success", "Copied to clipboard!");
  };

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
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
