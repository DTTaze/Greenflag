import axiosClient from "@/src/services";
import { ApiResponse as BaseResponse } from "@/src/types/api";
import {
  CreateCommentPayload,
  CreatePostPayload,
  GetCommentsParams,
  GetPostsParams,
  UpdateCommentPayload,
  UpdatePostPayload,
} from "@/src/types/forum/forum.payload";
import {
  ForumComment,
  ForumPost,
  ForumUser,
} from "@/src/types/forum/forum.type";

// Mapping helper for User structures from backend to frontend ForumUser
export const mapUserToForumUser = (user: any): ForumUser => {
  if (!user) {
    return {
      id: "anonymous",
      name: "Người dùng ẩn danh",
      avatarUrl:
        "https://res.cloudinary.com/ptquanh/image/upload/v1779947161/default-avatar.png",
      role: "user",
    };
  }

  const profile = user.profile || null;
  const fullName = profile?.fullName || user.username || "Thành viên Greenflag";

  return {
    id: user.id,
    name: fullName,
    avatarUrl: user.avatarUrl,
    role: user.role || "user",
    location: profile?.defaultProvince || user.metadata?.location || undefined,
  };
};

// Mapping helper for Post structures from backend to frontend ForumPost
export const mapBackendPostToForumPost = (post: any): ForumPost => {
  return {
    id: post.id,
    author: mapUserToForumUser(post.author),
    content: post.content,
    images: post.images || [],
    createdAt: post.createdAt,
    upvotes: post.upvotes || 0,
    downvotes: post.downvotes || 0,
    commentCount: post.commentCount || 0,
    tags: post.tags || [],
    userVote: post.userVote || null,
    topComment: post.topComment
      ? mapBackendCommentToForumComment(post.topComment)
      : undefined,
    status: post.status || "pending",
    category: post.category,
    flaggedReason: post.flaggedReason,
    rejectedBy: post.rejectedBy || null,
    isAdminPost: post.isAdminPost,
    event: post.event || null,
    taggedUsers: post.taggedUsers,
  };
};

// Mapping helper for Comment structures from backend to frontend ForumComment
export const mapBackendCommentToForumComment = (comment: any): ForumComment => {
  return {
    id: comment.id,
    postId: comment.postId,
    parentId: comment.parentId || null,
    author: mapUserToForumUser(comment.author),
    content: comment.content,
    createdAt: comment.createdAt,
    upvotes: comment.upvotes || 0,
    downvotes: comment.downvotes || 0,
    userVote: comment.userVote || null,
    imageUrl: comment.imageUrl || null,
    replies: comment.replies
      ? comment.replies.map((reply: any) =>
          mapBackendCommentToForumComment(reply),
        )
      : [],
  };
};

export const forumService = {
  getPosts: async (
    params?: GetPostsParams,
  ): Promise<
    BaseResponse<{ items: ForumPost[]; nextCursor: string | null }>
  > => {
    const response: any = await axiosClient.get("/forum/posts", {
      params,
    });

    const items = response.data?.items
      ? response.data.items.map(mapBackendPostToForumPost)
      : [];

    return {
      success: response.success,
      message: response.message,
      data: {
        items,
        nextCursor: response.data?.nextCursor || null,
      },
    };
  },

  getPost: async (id: string): Promise<BaseResponse<ForumPost>> => {
    const response: any = await axiosClient.get(`/forum/posts/${id}`);
    return {
      success: response.success,
      message: response.message,
      data: response.data
        ? mapBackendPostToForumPost(response.data)
        : undefined,
    };
  },

  createPost: async (
    payload: CreatePostPayload | FormData,
  ): Promise<BaseResponse<ForumPost>> => {
    const response: any = await axiosClient.post("/forum/posts", payload);
    return {
      success: response.success,
      message: response.message,
      data: response.data
        ? mapBackendPostToForumPost(response.data)
        : undefined,
    };
  },

  updatePost: async (
    id: string,
    payload: UpdatePostPayload,
  ): Promise<BaseResponse<ForumPost>> => {
    const response: any = await axiosClient.put(`/forum/posts/${id}`, payload);
    return {
      success: response.success,
      message: response.message,
      data: response.data
        ? mapBackendPostToForumPost(response.data)
        : undefined,
    };
  },

  deletePost: async (id: string): Promise<BaseResponse<void>> => {
    const response: any = await axiosClient.delete(`/forum/posts/${id}`);
    return response;
  },

  votePost: async (
    id: string,
    type: "up" | "down" | "none",
  ): Promise<BaseResponse<void>> => {
    const response: any = await axiosClient.post(`/forum/posts/${id}/vote`, {
      type,
    });
    return response;
  },

  getComments: async (
    postId: string,
    params?: GetCommentsParams,
  ): Promise<
    BaseResponse<{ items: ForumComment[]; nextCursor: string | null }>
  > => {
    const response: any = await axiosClient.get(
      `/forum/posts/${postId}/comments`,
      { params },
    );

    const items = response.data?.items
      ? response.data.items.map(mapBackendCommentToForumComment)
      : [];

    return {
      success: response.success,
      message: response.message,
      data: {
        items,
        nextCursor: response.data?.nextCursor || null,
      },
    };
  },

  createComment: async (
    postId: string,
    payload: CreateCommentPayload | FormData,
  ): Promise<BaseResponse<ForumComment>> => {
    const response: any = await axiosClient.post(
      `/forum/posts/${postId}/comments`,
      payload,
    );
    return {
      success: response.success,
      message: response.message,
      data: response.data
        ? mapBackendCommentToForumComment(response.data)
        : undefined,
    };
  },

  updateComment: async (
    commentId: string,
    payload: UpdateCommentPayload,
  ): Promise<BaseResponse<ForumComment>> => {
    const response: any = await axiosClient.put(
      `/forum/comments/${commentId}`,
      payload,
    );
    return {
      success: response.success,
      message: response.message,
      data: response.data
        ? mapBackendCommentToForumComment(response.data)
        : undefined,
    };
  },

  deleteComment: async (commentId: string): Promise<BaseResponse<void>> => {
    const response: any = await axiosClient.delete(
      `/forum/comments/${commentId}`,
    );
    return response;
  },

  voteComment: async (
    commentId: string,
    type: "up" | "down" | "none",
  ): Promise<BaseResponse<void>> => {
    const response: any = await axiosClient.post(
      `/forum/comments/${commentId}/vote`,
      { type },
    );
    return response;
  },

  aiEnhanceContent: async (
    content: string,
  ): Promise<
    BaseResponse<{
      enhancedContent: string;
      hashtags: string[];
      category: string;
    }>
  > => {
    const response: any = await axiosClient.post("/forum/posts/ai-enhance", {
      content,
    });
    return response;
  },

  getMyPosts: async (params?: {
    status?: string;
    search?: string;
  }): Promise<BaseResponse<ForumPost[]>> => {
    const response: any = await axiosClient.get("/forum/posts/my-posts", {
      params,
    });
    const items = response.data
      ? response.data.map(mapBackendPostToForumPost)
      : [];
    return {
      success: response.success,
      message: response.message,
      data: items,
    };
  },

  moderatePost: async (
    id: string,
    status: string,
    flaggedReason?: string,
  ): Promise<BaseResponse<any>> => {
    const response: any = await axiosClient.put(
      `/admin/forum/posts/${id}/moderate`,
      { status, flaggedReason },
    );
    return response;
  },

  adminGetPosts: async (
    status: string,
  ): Promise<
    BaseResponse<{ items: ForumPost[]; nextCursor: string | null }>
  > => {
    const response: any = await axiosClient.get("/admin/forum/posts", {
      params: { status },
    });
    const items = response.data?.items
      ? response.data.items.map(mapBackendPostToForumPost)
      : [];
    return {
      success: response.success,
      message: response.message,
      data: {
        items,
        nextCursor: response.data?.nextCursor || null,
      },
    };
  },

  approvePost: async (id: string): Promise<BaseResponse<any>> => {
    const response: any = await axiosClient.patch(
      `/admin/forum/posts/${id}/approve`,
    );
    return response;
  },

  rejectPost: async (
    id: string,
    flaggedReason?: string,
  ): Promise<BaseResponse<any>> => {
    const response: any = await axiosClient.patch(
      `/admin/forum/posts/${id}/reject`,
      {
        flaggedReason,
      },
    );
    return response;
  },
};
