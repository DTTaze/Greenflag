import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  acceptTaskFn,
  adminChangeTaskStatusFn,
  adminCreateTaskFn,
  adminDeleteTaskFn,
  adminGetAllTasksFn,
  adminGetTaskSubmissionsFn,
  adminHandleDecisionTaskSubmitFn,
  adminUpdateTaskFn,
  getTaskByIdFn,
  getTasksByDifficultyNameFn,
  getTasksByTypeNameFn,
  getTasksFn,
  getUserAllTasksFn,
  getUserCompletedTasksFn,
  increaseProgressCountFn,
  partnerChangeTaskStatusFn,
  partnerCreateTaskFn,
  partnerDeleteTaskFn,
  partnerGetMyTasksFn,
  partnerGetMyTaskSubmissionsFn,
  partnerHandleDecisionTaskSubmitFn,
  partnerUpdateTaskFn,
  submitTaskFn,
} from "./QueryFnsTask";
import { TASK_KEYS } from "./QueryKeysTask";

/** General Query & Mutation Hooks */

export const useTasksQuery = () => {
  return useQuery({
    queryKey: TASK_KEYS.LIST,
    queryFn: getTasksFn,
  });
};

export const useTaskDetailQuery = (id: string) => {
  return useQuery({
    queryKey: TASK_KEYS.DETAIL(id),
    queryFn: () => getTaskByIdFn(id),
    enabled: !!id,
  });
};

export const useTasksByTypeNameQuery = (typeName: string) => {
  return useQuery({
    queryKey: TASK_KEYS.TYPE_LIST(typeName),
    queryFn: () => getTasksByTypeNameFn(typeName),
    enabled: !!typeName,
  });
};

export const useTasksByDifficultyNameQuery = (difficulty: string) => {
  return useQuery({
    queryKey: TASK_KEYS.DIFFICULTY_LIST(difficulty),
    queryFn: () => getTasksByDifficultyNameFn(difficulty),
    enabled: !!difficulty,
  });
};

export const useUserTasksQuery = (userId: string) => {
  return useQuery({
    queryKey: TASK_KEYS.USER_TASKS(userId),
    queryFn: () => getUserAllTasksFn(userId),
    enabled: !!userId,
  });
};

export const useUserCompletedTasksQuery = () => {
  return useQuery({
    queryKey: TASK_KEYS.USER_COMPLETED,
    queryFn: getUserCompletedTasksFn,
  });
};

export const useAcceptTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: acceptTaskFn,
    onSuccess: (_, _variables) => {
      // Invalidate target query caches to trigger automatic UI refetches
      queryClient.invalidateQueries({ queryKey: ["userTasks"] });
    },
  });
};

export const useIncreaseProgressMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: increaseProgressCountFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTasks"] });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.USER_COMPLETED });
    },
  });
};

export const useSubmitTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: submitTaskFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userTasks"] });
    },
  });
};

/** Admin Query & Mutation Hooks */

export const useAdminTasksQuery = () => {
  return useQuery({
    queryKey: TASK_KEYS.ADMIN_LIST,
    queryFn: adminGetAllTasksFn,
  });
};

export const useAdminTaskSubmissionsQuery = (customerId: string) => {
  return useQuery({
    queryKey: TASK_KEYS.ADMIN_SUBMISSIONS(customerId),
    queryFn: () => adminGetTaskSubmissionsFn(customerId),
    enabled: !!customerId,
  });
};

export const useAdminCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminCreateTaskFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.ADMIN_LIST });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.LIST });
    },
  });
};

export const useAdminUpdateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminUpdateTaskFn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.ADMIN_LIST });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.LIST });
      queryClient.invalidateQueries({
        queryKey: TASK_KEYS.DETAIL(variables.id),
      });
    },
  });
};

export const useAdminDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminDeleteTaskFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.ADMIN_LIST });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.LIST });
    },
  });
};

export const useAdminChangeTaskStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminChangeTaskStatusFn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.ADMIN_LIST });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.LIST });
      queryClient.invalidateQueries({
        queryKey: TASK_KEYS.DETAIL(variables.id),
      });
    },
  });
};

export const useAdminHandleDecisionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: adminHandleDecisionTaskSubmitFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminSubmissions"] });
      queryClient.invalidateQueries({ queryKey: ["userTasks"] });
    },
  });
};

/** Partner Query & Mutation Hooks */

export const usePartnerTasksQuery = () => {
  return useQuery({
    queryKey: TASK_KEYS.PARTNER_LIST,
    queryFn: partnerGetMyTasksFn,
  });
};

export const usePartnerTaskSubmissionsQuery = () => {
  return useQuery({
    queryKey: TASK_KEYS.PARTNER_SUBMISSIONS,
    queryFn: partnerGetMyTaskSubmissionsFn,
  });
};

export const usePartnerCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: partnerCreateTaskFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.PARTNER_LIST });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.LIST });
    },
  });
};

export const usePartnerUpdateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: partnerUpdateTaskFn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.PARTNER_LIST });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.LIST });
      queryClient.invalidateQueries({
        queryKey: TASK_KEYS.DETAIL(variables.id),
      });
    },
  });
};

export const usePartnerDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: partnerDeleteTaskFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.PARTNER_LIST });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.LIST });
    },
  });
};

export const usePartnerChangeTaskStatusMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: partnerChangeTaskStatusFn,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.PARTNER_LIST });
      queryClient.invalidateQueries({ queryKey: TASK_KEYS.LIST });
      queryClient.invalidateQueries({
        queryKey: TASK_KEYS.DETAIL(variables.id),
      });
    },
  });
};

export const usePartnerHandleDecisionMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: partnerHandleDecisionTaskSubmitFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: TASK_KEYS.PARTNER_SUBMISSIONS,
      });
      queryClient.invalidateQueries({ queryKey: ["userTasks"] });
    },
  });
};
