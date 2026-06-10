import axiosClient from "@/src/services";

export const uploadUserAvatar = async (userId: string | number, file: File) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const res = await axiosClient.put<any>("users/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  // Map avatarUrl to avatar_url for compatibility with frontend code
  if (res?.data) {
    res.data.avatar_url = res.data.avatarUrl;
  }
  return res;
};

export const updateUserAvatar = uploadUserAvatar;

export const getUserAvatarById = async (_userId: string | number) => {
  try {
    // Attempt to get the latest profile info from NestJS auth/whoami
    const res = await axiosClient.get<any>("/auth/whoami");
    const avatarUrl =
      res?.data?.avatarUrl ||
      "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png";
    return {
      success: true,
      data: {
        avatar_url: avatarUrl,
      },
      avatar_url: avatarUrl,
    };
  } catch {
    return {
      success: true,
      data: {
        avatar_url:
          "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png",
      },
      avatar_url:
        "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png",
    };
  }
};
