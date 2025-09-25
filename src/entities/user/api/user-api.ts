import { api } from "@/shared/lib/client";
import { User } from "../model/types";

export interface UserMeRequest {
  first_name: string;
  last_name: string;
  email: string;
  timezone: string;
  password: string;
  password_confirmation: string;
  password_current: string;
  locale: string;
}

export interface UpdateUserRequest {
  first_name: string;
  last_name: string;
  role: string;
  status: string;
}

export const userApi = {
  me: async (): Promise<User> => {
    const response = await api.get<{ data: User }>("/users/me");
    return response.data.data;
  },

  findById: async (userId: string): Promise<User> => {
    const response = await api.get<{ data: User }>(`/users/${userId}`);
    return response.data.data;
  },

  updateMe: async (updateParams: Partial<UserMeRequest>): Promise<User> => {
    const response = await api.put<{ data: User }>("/users/me", updateParams);
    return response.data.data;
  },

  updateUser: async (
    userId: string,
    updateParams: UpdateUserRequest
  ): Promise<User> => {
    const response = await api.put<{ data: User }>(
      `/users/${userId}`,
      updateParams
    );
    return response.data.data;
  },

  all: async (): Promise<User[]> => {
    const response = await api.get<{ data: User[] }>("/users");
    return response.data.data;
  },
};
