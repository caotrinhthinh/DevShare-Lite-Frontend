import type { Comment, CreateCommentData } from "../types/Comment";
import { api } from "./api";

export const commentsService = {
  getComments: async (postId: string): Promise<Comment[]> => {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },

  createComment: async (
    postId: string,
    data: CreateCommentData
  ): Promise<Comment> => {
    const response = await api.post(`/posts/${postId}/comments`, data);
    return response.data;
  },

  updateComment: async (
    postId: string,
    commentId: string,
    content: string
  ): Promise<Comment> => {
    const response = await api.put(`/posts/${postId}/comments/${commentId}`, {
      content,
    });
    return response.data;
  },

  deleteComment: async (postId: string, commentId: string): Promise<void> => {
    const response = await api.delete(`/posts/${postId}/comments/${commentId}`);
    return response.data;
  },

  likeComment: async (postId: string, commentId: string): Promise<Comment> => {
    const response = await api.post(
      `/posts/${postId}/comments/${commentId}/like`
    );
    return response.data;
  },
};
