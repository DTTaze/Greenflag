import { Camera } from "lucide-react";
import React from "react";

export default function CustomerAvatar({
  userInfo,
  avatarUploading,
  handleAvatarChange,
}) {
  return (
    <div className="relative z-10 mt-[-48px] mb-4 flex flex-col items-center">
      {avatarUploading ? (
        <div className="flex h-[120px] w-[120px] items-center justify-center rounded-full border-4 border-white bg-white/80 shadow-md">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-emerald-600"></div>
        </div>
      ) : (
        <div className="group relative">
          <img
            src={userInfo?.avatar_url || "/images/default-avatar.jpg"}
            alt={userInfo?.full_name || "User"}
            className="h-[120px] w-[120px] rounded-full border-4 border-white object-cover shadow-md"
          />
          <label className="absolute right-0 bottom-0 cursor-pointer rounded-full border border-emerald-100 bg-white p-2 text-emerald-700 shadow-sm transition-colors duration-150 hover:bg-emerald-50 hover:text-emerald-800">
            <input
              hidden
              accept="image/*"
              type="file"
              onChange={handleAvatarChange}
            />
            <Camera className="h-4 w-4" />
          </label>
        </div>
      )}
    </div>
  );
}
