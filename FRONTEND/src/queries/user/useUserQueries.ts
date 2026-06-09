import { useQuery } from "@tanstack/react-query";

import { getUser } from "@/src/services/user.service";

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
