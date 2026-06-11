/* eslint-disable max-lines */
import { forumService } from "@/src/services/forum.service";
import {
  CreateCommentPayload,
  CreatePostPayload,
  GetCommentsParams,
  GetPostsParams,
} from "@/src/types/forum/forum.payload";
const handleApiError = (
  error: any,
  defaultMessage: string = "Có lỗi xảy ra.",
) => {
  const msg =
    error?.response?.data?.message || error?.message || defaultMessage;
  toast.error(msg);
};
import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { toast, Toaster } from "sonner";

export function useForumPosts(params?: GetPostsParams) {
  return useInfiniteQuery({
    queryKey: ["forum-posts", params],
    queryFn: async ({ pageParam }) => {
      const res = await forumService.getPosts({ ...params, cursor: pageParam });
      return res;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => {
      return (lastPage.success ? lastPage.data?.nextCursor : null) || undefined;
    },
  });
}

export function useForumPostDetail(postId: string) {
  return useQuery({
    queryKey: ["forum-post", postId],
    queryFn: () => forumService.getPost(postId),
    enabled: !!postId,
  });
}

export function useCreatePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePostPayload | FormData) =>
      forumService.createPost(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
      let isDraft = false;
      if (variables instanceof FormData) {
        isDraft = variables.get("isDraft") === "true";
      } else {
        isDraft = !!variables.isDraft;
      }
      toast.success(
        isDraft ? "Lưu bản nháp thành công!" : "Đăng bài viết thành công!",
      );
    },
    onError: (error) => {
      handleApiError(error, "Không thể đăng bài viết.");
    },
  });
}

export function useVotePost() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      postId,
      type,
    }: {
      postId: string;
      type: "up" | "down" | "none";
    }) => forumService.votePost(postId, type),
    onMutate: async ({ postId, type }) => {
      // 1. Cancel outgoing queries
      await queryClient.cancelQueries({ queryKey: ["forum-posts"] });
      await queryClient.cancelQueries({ queryKey: ["forum-post", postId] });

      // 2. Snapshot current caches
      const previousInfinitePosts = queryClient.getQueryData(["forum-posts"]);
      const previousPostDetail = queryClient.getQueryData([
        "forum-post",
        postId,
      ]);

      const calculateVotes = (item: any, newVote: "up" | "down" | "none") => {
        const initialUserVote = item.userVote || null;
        let diffUp = 0;
        let diffDown = 0;

        if (initialUserVote === newVote) {
          return {
            upvotes: item.upvotes,
            downvotes: item.downvotes,
            userVote: newVote === "none" ? null : newVote,
          };
        }

        if (initialUserVote === "up") {
          diffUp = -1;
        } else if (initialUserVote === "down") {
          diffDown = -1;
        }

        if (newVote === "up") {
          diffUp += 1;
        } else if (newVote === "down") {
          diffDown += 1;
        }

        return {
          upvotes: Math.max(0, item.upvotes + diffUp),
          downvotes: Math.max(0, item.downvotes + diffDown),
          userVote: newVote === "none" ? null : newVote,
        };
      };

      // 3. Optimistically update infinite list
      queryClient.setQueriesData(
        { queryKey: ["forum-posts"] },
        (oldData: any) => {
          if (!oldData || !oldData.pages) return oldData;
          return {
            ...oldData,
            pages: oldData.pages.map((page: any) => {
              if (!page.data || !page.data.items) return page;
              return {
                ...page,
                data: {
                  ...page.data,
                  items: page.data.items.map((post: any) => {
                    if (post.id === postId) {
                      const updates = calculateVotes(post, type);
                      return { ...post, ...updates };
                    }
                    return post;
                  }),
                },
              };
            }),
          };
        },
      );

      // 4. Optimistically update single detail
      queryClient.setQueryData(["forum-post", postId], (oldPost: any) => {
        if (!oldPost || !oldPost.data) return oldPost;
        const updates = calculateVotes(oldPost.data, type);
        return {
          ...oldPost,
          data: {
            ...oldPost.data,
            ...updates,
          },
        };
      });

      return { previousInfinitePosts, previousPostDetail };
    },
    onError: (err, variables, context: any) => {
      // Rollback caches on fail
      if (context?.previousInfinitePosts) {
        queryClient.setQueriesData(
          { queryKey: ["forum-posts"] },
          context.previousInfinitePosts,
        );
      }
      if (context?.previousPostDetail) {
        queryClient.setQueryData(
          ["forum-post", variables.postId],
          context.previousPostDetail,
        );
      }
      handleApiError(err);
    },
    onSettled: (data, error, variables) => {
      // Final synchronization
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
      queryClient.invalidateQueries({
        queryKey: ["forum-post", variables.postId],
      });
    },
  });
}

export function useForumComments(
  postId: string,
  options?: { enabled?: boolean; params?: GetCommentsParams },
) {
  return useQuery({
    queryKey: ["forum-comments", postId, options?.params],
    queryFn: () => forumService.getComments(postId, options?.params),
    enabled: options?.enabled !== false && !!postId,
  });
}

export function useCreateComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateCommentPayload | FormData) =>
      forumService.createComment(postId, payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["forum-comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
      queryClient.invalidateQueries({ queryKey: ["forum-post", postId] });

      let isReply = false;
      if (variables instanceof FormData) {
        isReply = variables.has("parentId");
      } else {
        isReply = !!variables.parentId;
      }
      toast.success(isReply ? "Phản hồi thành công!" : "Bình luận thành công!");
    },
    onError: (error, variables) => {
      let isReply = false;
      if (variables instanceof FormData) {
        isReply = variables.has("parentId");
      } else {
        isReply = !!variables.parentId;
      }
      handleApiError(
        error,
        isReply ? "Phản hồi thất bại." : "Bình luận thất bại.",
      );
    },
  });
}

export function useVoteComment() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      commentId,
      type,
    }: {
      commentId: string;
      postId: string;
      type: "up" | "down" | "none";
    }) => forumService.voteComment(commentId, type),
    onMutate: async ({ commentId, postId, type }) => {
      await queryClient.cancelQueries({ queryKey: ["forum-comments", postId] });

      const previousComments = queryClient.getQueryData([
        "forum-comments",
        postId,
      ]);

      const calculateVotes = (item: any, newVote: "up" | "down" | "none") => {
        const initialUserVote = item.userVote || null;
        let diffUp = 0;
        let diffDown = 0;

        if (initialUserVote === newVote) {
          return {
            upvotes: item.upvotes,
            downvotes: item.downvotes,
            userVote: newVote === "none" ? null : newVote,
          };
        }

        if (initialUserVote === "up") {
          diffUp = -1;
        } else if (initialUserVote === "down") {
          diffDown = -1;
        }

        if (newVote === "up") {
          diffUp += 1;
        } else if (newVote === "down") {
          diffDown += 1;
        }

        return {
          upvotes: Math.max(0, item.upvotes + diffUp),
          downvotes: Math.max(0, item.downvotes + diffDown),
          userVote: newVote === "none" ? null : newVote,
        };
      };

      const updateCommentInTree = (comment: any): any => {
        if (comment.id === commentId) {
          const updates = calculateVotes(comment, type);
          return { ...comment, ...updates };
        }
        if (comment.replies && comment.replies.length > 0) {
          return {
            ...comment,
            replies: comment.replies.map(updateCommentInTree),
          };
        }
        return comment;
      };

      queryClient.setQueryData(["forum-comments", postId], (oldData: any) => {
        if (!oldData || !oldData.data || !oldData.data.items) return oldData;
        return {
          ...oldData,
          data: {
            ...oldData.data,
            items: oldData.data.items.map(updateCommentInTree),
          },
        };
      });

      return { previousComments };
    },
    onError: (err, variables, context: any) => {
      if (context?.previousComments) {
        queryClient.setQueryData(
          ["forum-comments", variables.postId],
          context.previousComments,
        );
      }
      handleApiError(err);
    },
    onSettled: (data, error, variables) => {
      // 1. Sync the comments list
      queryClient.invalidateQueries({
        queryKey: ["forum-comments", variables.postId],
      });

      // 2. CRITICAL FIX: Force the Feed and Post Detail to refetch silently in the background
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
      queryClient.invalidateQueries({
        queryKey: ["forum-post", variables.postId],
      });
    },
  });
}

export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => forumService.deletePost(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
      toast.success("Xóa bài viết thành công.");
    },
    onError: (error) => {
      handleApiError(error, "Xóa bài viết thất bại.");
    },
  });
}

export function useDeleteComment(postId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: string) => forumService.deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["forum-comments", postId] });
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
      queryClient.invalidateQueries({ queryKey: ["forum-post", postId] });
      toast.success("Xóa bình luận thành công.");
    },
    onError: (error) => {
      handleApiError(error, "Xóa bình luận thất bại.");
    },
  });
}

export function useModeratePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      status,
      flaggedReason,
    }: {
      id: string;
      status: string;
      flaggedReason?: string;
    }) => forumService.moderatePost(id, status, flaggedReason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["forum-posts"] });
      const actionText =
        variables.status === "approved" ? "Phê duyệt" : "Từ chối";
      toast.success(`${actionText} bài viết thành công.`);
    },
    onError: (error, variables) => {
      const actionText =
        variables.status === "approved" ? "phê duyệt" : "từ chối";
      handleApiError(error, `Có lỗi xảy ra khi ${actionText} bài viết.`);
    },
  });
}

export function useMyPosts(params?: { status?: string; search?: string }) {
  return useQuery({
    queryKey: ["my-posts", params],
    queryFn: () => forumService.getMyPosts(params),
  });
}
