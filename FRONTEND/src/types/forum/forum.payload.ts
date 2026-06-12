export interface CreatePostPayload {
  content: string;
  images?: string[];
  tags?: string[];
  category?: string;
  isDraft?: boolean;
  taggedUsernames?: string[];
  attachedEventId?: string;
}

export interface UpdatePostPayload {
  content?: string;
  images?: string[];
  tags?: string[];
  category?: string;
  attachedEventId?: string | null;
}

export interface CreateCommentPayload {
  content: string;
  parentId?: string;
}

export interface UpdateCommentPayload {
  content: string;
}

export interface GetPostsParams {
  cursor?: string;
  limit?: number;
  sort?: "new" | "hot";
  tag?: string;
  category?: string;
  status?: string;
}

export interface GetCommentsParams {
  cursor?: string;
  limit?: number;
}
