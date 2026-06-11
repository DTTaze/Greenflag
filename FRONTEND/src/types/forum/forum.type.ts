import { EventType } from "../event/event.type";

export interface ForumUser {
  id: string;
  name: string;
  avatarUrl: string;
  role: "admin" | "partner" | "user";
  location?: string;
}

export interface ForumComment {
  id: string;
  postId: string;
  parentId: string | null;
  author: ForumUser;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  userVote: "up" | "down" | null;
  imageUrl?: string | null;
  replies?: ForumComment[];
}

export interface ForumPost {
  id: string;
  author: ForumUser;
  content: string;
  images: string[];
  createdAt: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  tags: string[];
  userVote: "up" | "down" | null;
  topComment?: ForumComment;
  status: string;
  category?: string;
  flaggedReason?: string;
  rejectedBy?: "AI" | "admin" | null;
  isAdminPost: boolean;
  event?: EventType | null;
  taggedUsers?: any[];
}
