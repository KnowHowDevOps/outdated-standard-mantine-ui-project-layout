import { api } from "../../../shared/lib/client";
import { User } from "../../user";
import {
  LoginData,
  LoginResponse,
  RegisterAccountRequest,
  ResetPasswordRequest,
} from "../model/types";

export const authApi = {
  refreshAccessToken: async (): Promise<LoginResponse> => {
    const response = await api.get<LoginResponse>("/auth/refresh");
    return response.data;
  },

  register: async (registerData: RegisterAccountRequest): Promise<User> => {
    const response = await api.post<{ data: User }>(
      "/auth/register",
      registerData
    );
    return response.data.data;
  },

  login: async (loginData: LoginData): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>("/auth/login", loginData);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post("/auth/logout");
  },

  forgotPassword: async (email: string): Promise<void> => {
    await api.post("/auth/forgot-password", { email });
  },

  verifyPasswordResetToken: async (token: string): Promise<boolean> => {
    const response = await api.get(`/auth/reset-password/${token}`);
    return response.status === 200;
  },

  resetPassword: async (
    token: string,
    resetData: ResetPasswordRequest
  ): Promise<void> => {
    await api.post(`/auth/reset-password/${token}`, resetData);
  },
};
