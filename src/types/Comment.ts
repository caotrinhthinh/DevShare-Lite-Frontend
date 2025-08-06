export interface Comment {
  _id: string;
  content: string;
  author: {
    _id: string;
    name: string;
    email: string;
  };
  post: string;
  parentComment?: string;
  replies: Comment[];
  likeCount: number;
  likedBy: string[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateCommentData {
  content: string;
  parentComment?: string;
}
