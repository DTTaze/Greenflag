import axiosClient from "@/src/services";
import { ApiResponse } from "@/src/types/api";

export interface SystemConfigDTO {
  id: string;
  key: string;
  value: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateSystemConfigPayload {
  value: string;
  description?: string;
  isActive?: boolean;
}

export const systemConfigService = {
  getAll: async (): Promise<ApiResponse<SystemConfigDTO[]>> => {
    return axiosClient.get("/admin/system-configs");
  },

  updateByKey: async (
    key: string,
    payload: UpdateSystemConfigPayload,
  ): Promise<ApiResponse<SystemConfigDTO>> => {
    return axiosClient.patch(`/admin/system-configs/${key}`, payload);
  },
};
