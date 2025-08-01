import type { AuthResponse, LoginData, RegisterData } from "../types";
import { api } from "./api";

export const authService = {
  register: async (data: RegisterData) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post("/auth/login", data);
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.get(`/auth/verify-email?token=${token}`);
    return response.data;
  },

  forgotPassword: async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  verifyResetCode: async (code: string) => {
    const response = await api.post("/auth/verify-reset-code", {
      code,
    });
    return response.data;
  },

  resetPassword: async (resetToken: string, newPassword: string) => {
    const response = await api.post("/auth/reset-password", {
      resetToken,
      newPassword,
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },
};
