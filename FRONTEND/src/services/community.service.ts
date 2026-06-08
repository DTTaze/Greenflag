/**
 * Community Service (Mock API Service)
 *
 * This module handles fetching, creating, liking, and commenting on community posts.
 * It uses localStorage to simulate database queries.
 *
 * Clean Code: Single Responsibility, Descriptive Naming, Typescript Interface safety.
 * When a real backend API is ready (e.g. `/api/posts`), simply uncomment the Axios lines
 * and remove the localStorage fallback code.
 */

// import axios from "../utils/axios.customize";

export interface PostComment {
  id: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface CommunityPost {
  id: string;
  authorName: string;
  authorAvatar?: string;
  authorEmail: string;
  content: string;
  image?: string; // Base64 or URL
  likes: number;
  likedByUsers: string[]; // List of user emails who liked
  comments: PostComment[];
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

// Initial mock data if localStorage is empty
const INITIAL_POSTS: CommunityPost[] = [
  {
    id: "post-1",
    authorName: "Lê Trung Kiên",
    authorEmail: "kien.le@student.ptithcm.edu.vn",
    authorAvatar: "/src/assets/images/default-avatar.jpg",
    content:
      "Sáng nay nhóm mình đã hoàn thành việc nhặt rác nhựa tại công viên Tao Đàn. Thu gom được gần 5kg chai nhựa tái chế! Cố lên cả nhà ơi, vì một hành tinh xanh! 🌲💚",
    image:
      "https://images.unsplash.com/photo-1618477388954-7852f32655ec?q=80&w=600&auto=format&fit=crop",
    likes: 12,
    likedByUsers: ["user1@example.com"],
    comments: [
      {
        id: "c-1",
        authorName: "Đặng Thành Tài",
        authorAvatar: "/src/assets/images/default-avatar.jpg",
        content: "Quá tuyệt vời luôn nhóm mình ơi! Ngày mai tiếp tục nhé!",
        createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
      },
    ],
    status: "approved",
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: "post-2",
    authorName: "Hoàng Thiên Bảo",
    authorEmail: "bao.hoang@student.ptithcm.edu.vn",
    authorAvatar: "/src/assets/images/default-avatar.jpg",
    content:
      "Vừa trồng xong 3 chậu sen đá mới mua. Tích tiểu thành đại, phủ xanh ban công nhỏ nhà mình! 🪴🌸",
    image:
      "https://images.unsplash.com/photo-1545241047-6083a3684587?q=80&w=600&auto=format&fit=crop",
    likes: 8,
    likedByUsers: [],
    comments: [],
    status: "approved",
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
];

const getStoredPosts = (): CommunityPost[] => {
  if (typeof window === "undefined") return INITIAL_POSTS;
  const stored = localStorage.getItem("greenflag_community_posts");
  if (!stored) {
    localStorage.setItem(
      "greenflag_community_posts",
      JSON.stringify(INITIAL_POSTS),
    );
    return INITIAL_POSTS;
  }
  return JSON.parse(stored);
};

const savePosts = (posts: CommunityPost[]) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("greenflag_community_posts", JSON.stringify(posts));
  }
};

/**
 * Fetch all approved community posts
 */
export const getCommunityPosts = async (): Promise<CommunityPost[]> => {
  // Real Backend API Call (Uncomment when ready):
  // const res = await axios.get("api/posts");
  // return res.data;

  // Mock implementation:
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getStoredPosts();
      const approvedPosts = posts
        .filter((post) => post.status === "approved")
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        );
      resolve(approvedPosts);
    }, 400); // Simulate API latency
  });
};

/**
 * Create a new community post (pending moderation)
 */
export const createCommunityPost = async (
  content: string,
  authorName: string,
  authorEmail: string,
  image?: string, // Base64 string or image url
  authorAvatar?: string,
): Promise<CommunityPost> => {
  // Real Backend API Call (Uncomment when ready):
  // const res = await axios.post("api/posts/create", { content, image });
  // return res.data;

  // Mock implementation:
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getStoredPosts();
      const newPost: CommunityPost = {
        id: `post-${Date.now()}`,
        authorName,
        authorEmail,
        authorAvatar: authorAvatar || "/src/assets/images/default-avatar.jpg",
        content,
        image,
        likes: 0,
        likedByUsers: [],
        comments: [],
        status: "pending", // Newly created posts are pending admin moderation
        createdAt: new Date().toISOString(),
      };
      posts.push(newPost);
      savePosts(posts);
      resolve(newPost);
    }, 500);
  });
};

/**
 * Like / unlike a post
 */
export const likeCommunityPost = async (
  postId: string,
  userEmail: string,
): Promise<CommunityPost | null> => {
  // Real Backend API Call (Uncomment when ready):
  // const res = await axios.post(`api/posts/like/${postId}`);
  // return res.data;

  // Mock implementation:
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getStoredPosts();
      const postIndex = posts.findIndex((p) => p.id === postId);
      if (postIndex === -1) {
        resolve(null);
        return;
      }
      const post = posts[postIndex];
      const isLiked = post.likedByUsers.includes(userEmail);

      if (isLiked) {
        post.likedByUsers = post.likedByUsers.filter(
          (email) => email !== userEmail,
        );
        post.likes = Math.max(0, post.likes - 1);
      } else {
        post.likedByUsers.push(userEmail);
        post.likes += 1;
      }

      posts[postIndex] = post;
      savePosts(posts);
      resolve(post);
    }, 200);
  });
};

/**
 * Add a comment to a post
 */
export const addPostComment = async (
  postId: string,
  content: string,
  authorName: string,
  authorAvatar?: string,
): Promise<PostComment | null> => {
  // Real Backend API Call (Uncomment when ready):
  // const res = await axios.post(`api/posts/comment/${postId}`, { content });
  // return res.data;

  // Mock implementation:
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getStoredPosts();
      const postIndex = posts.findIndex((p) => p.id === postId);
      if (postIndex === -1) {
        resolve(null);
        return;
      }
      const post = posts[postIndex];
      const newComment: PostComment = {
        id: `comment-${Date.now()}`,
        authorName,
        authorAvatar: authorAvatar || "/src/assets/images/default-avatar.jpg",
        content,
        createdAt: new Date().toISOString(),
      };
      post.comments.push(newComment);
      posts[postIndex] = post;
      savePosts(posts);
      resolve(newComment);
    }, 300);
  });
};

/**
 * Admin: Get all posts (including pending/rejected)
 */
export const adminGetCommunityPosts = async (): Promise<CommunityPost[]> => {
  // Real Backend API Call (Uncomment when ready):
  // const res = await axios.get("api/admin/posts");
  // return res.data;

  // Mock implementation:
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getStoredPosts();
      const sortedPosts = [...posts].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      );
      resolve(sortedPosts);
    }, 400);
  });
};

/**
 * Admin: Approve or Reject/Hide post
 */
export const adminModerateCommunityPost = async (
  postId: string,
  decision: "approved" | "rejected",
): Promise<boolean> => {
  // Real Backend API Call (Uncomment when ready):
  // const res = await axios.put(`api/admin/posts/moderate/${postId}`, { decision });
  // return res.data.success;

  // Mock implementation:
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = getStoredPosts();
      const postIndex = posts.findIndex((p) => p.id === postId);
      if (postIndex === -1) {
        resolve(false);
        return;
      }
      posts[postIndex].status = decision;
      savePosts(posts);
      resolve(true);
    }, 300);
  });
};
