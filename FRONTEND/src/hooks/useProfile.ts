import { useAuthStore } from "@/src/store/auth/authStore";

export const useProfile = () => {
  const { user } = useAuthStore();

  const profile = user
    ? {
        id: user.id,
        username: user.username,
        role: user.role || "user",
        fullName:
          (user as any).full_name ||
          user.fullName ||
          (user as any).profile?.fullName ||
          user.username ||
          "Thành viên Greenflag",
        avatarUrl:
          user.avatarUrl ||
          "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png",
      }
    : null;

  return { profile };
};
