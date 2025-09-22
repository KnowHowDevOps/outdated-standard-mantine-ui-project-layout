import { User } from "../../user";

export interface LoginData {
  email: string;
  password: string;
}

export interface LoginResponse {
  token?: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export interface RegisterAccountRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  password_confirmation: string;
  locale: string;
}

export interface ResetPasswordRequest {
  password: string;
  password_confirmation: string;
}
