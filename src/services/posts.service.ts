import type { CreatePostData, Post } from "../types/Post";
import { api } from "./api";

export const postsService = {
  getPosts: async (page: number = 1, limit: number = 10) => {
    try {
      const response = await api.get(`/posts?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
  },

  getPost: async (id: string): Promise<Post> => {
    const response = await api.get(`/posts/${id}`);
    return response.data;
  },

  createPost: async (data: CreatePostData): Promise<Post> => {
    const response = await api.post<Post>("/posts", data);
    return response.data;
  },

  updatePost: async (
    id: string,
    data: Partial<CreatePostData>
  ): Promise<Post> => {
    const response = await api.put<Post>(`/posts/${id}`, data);
    return response.data;
  },

  deletePost: async (id: string): Promise<void> => {
    const response = await api.delete(`/posts/${id}`);
    return response.data;
  },

  searchPosts: async (query: string, page: number = 1, limit: number = 10) => {
    const response = await api.get(
      `/posts/search?q=${query}&page=${page}&limit=${limit}`
    );
    return response.data;
  },

  getMyPosts: async () => {
    const response = await api.get("/posts/user/my-posts");
    return response.data;
  },
};
