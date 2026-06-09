import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getUser } from "@/src/services/user.service";
import {
  adminDecreaseCoinHandler,
  adminDeleteUserHandler,
  adminIncreaseCoinHandler,
  adminRearrangeRanksHandler,
  adminUpdateCoinHandler,
  adminUpdateUserHandler,
  updateAvatarHandler,
  updateProfileHandler,
} from "@/src/services/user/userHandlers";
import { UpdateCoinPayload } from "@/src/types/user/user.payload";
import { UserType } from "@/src/types/user/user.type";

import {
  adminGetAllUsersQueryFn,
  adminGetUserByIdQueryFn,
  getCoinQueryFn,
  getRankQueryFn,
  getUserAllTasksQueryFn,
  getUserItemsQueryFn,
  getUserTasksCompletedQueryFn,
  fetchUserProfileQueryFn,
} from "./QueryFnsUser";
import { QueryKeysUser } from "./QueryKeysUser";

/** Legacy Current User Query Hook (Preserved for compatibility) */
export const useCurrentUserQuery = () => {
  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const res = await getUser();
      if (res.status !== 200) {
        throw new Error(res.error || "Failed to fetch user profile");
      }
      return res.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes stale time
  });
};

// --- New Query Hooks ---

export const useUserProfileQuery = () => {
  return useQuery({
    queryKey: [QueryKeysUser.PROFILE],
    queryFn: fetchUserProfileQueryFn,
  });
};

export const useUserTasksCompletedQuery = () => {
  return useQuery({
    queryKey: [QueryKeysUser.COMPLETED_TASKS],
    queryFn: getUserTasksCompletedQueryFn,
  });
};

export const useUserAllTasksQuery = (userId: string) => {
  return useQuery({
    queryKey: [QueryKeysUser.ALL_TASKS, userId],
    queryFn: () => getUserAllTasksQueryFn(userId),
    enabled: !!userId,
  });
};

export const useUserItemsQuery = (userId: string) => {
  return useQuery({
    queryKey: [QueryKeysUser.USER_ITEMS, userId],
    queryFn: () => getUserItemsQueryFn(userId),
    enabled: !!userId,
  });
};

export const useAdminUsersQuery = () => {
  return useQuery({
    queryKey: [QueryKeysUser.ADMIN_USERS],
    queryFn: adminGetAllUsersQueryFn,
  });
};

export const useAdminUserByIdQuery = (id: string) => {
  return useQuery({
    queryKey: [QueryKeysUser.ADMIN_USERS, id],
    queryFn: () => adminGetUserByIdQueryFn(id),
    enabled: !!id,
  });
};

export const useRankQuery = (id: string) => {
  return useQuery({
    queryKey: [QueryKeysUser.RANK, id],
    queryFn: () => getRankQueryFn(id),
    enabled: !!id,
  });
};

export const useCoinQuery = (id: string) => {
  return useQuery({
    queryKey: [QueryKeysUser.COIN, id],
    queryFn: () => getCoinQueryFn(id),
    enabled: !!id,
  });
};

// --- New Mutation Hooks ---

export const useUpdateProfileMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<UserType>) => updateProfileHandler(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysUser.PROFILE] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useUpdateAvatarMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file: File) => updateAvatarHandler(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysUser.PROFILE] });
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useAdminUpdateUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => adminUpdateUserHandler(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysUser.ADMIN_USERS] });
      queryClient.invalidateQueries({ queryKey: [QueryKeysUser.ADMIN_USERS, id] });
    },
  });
};

export const useAdminDeleteUserMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminDeleteUserHandler(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysUser.ADMIN_USERS] });
    },
  });
};

export const useAdminRearrangeRanksMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminRearrangeRanksHandler,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysUser.RANK] });
    },
  });
};

export const useAdminUpdateCoinMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCoinPayload }) =>
      adminUpdateCoinHandler(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysUser.COIN, id] });
    },
  });
};

export const useAdminIncreaseCoinMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCoinPayload }) =>
      adminIncreaseCoinHandler(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysUser.COIN, id] });
    },
  });
};

export const useAdminDecreaseCoinMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateCoinPayload }) =>
      adminDecreaseCoinHandler(id, payload),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QueryKeysUser.COIN, id] });
    },
  });
};
