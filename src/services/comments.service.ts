import type { Comment } from "../types/Comment";
import { api } from "./api";

export const commentsService = {
  getComments: async (postId: string): Promise<Comment[]> => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },
};
