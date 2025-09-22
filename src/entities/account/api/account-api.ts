import { api } from "../../../shared/api/client";
import { User } from "../../user";
import { Account } from "../model/types";

interface CreateAccountRequest {
  first_name: string;
  last_name: string;
  email: string;
  password?: string;
}

export const accountApi = {
  create: async (accountData: CreateAccountRequest): Promise<User> => {
    const response = await api.post<{ data: User }>("/accounts", accountData);
    return response.data.data;
  },

  getAccount: async (): Promise<Account> => {
    const response = await api.get<{ data: Account }>("/accounts");
    return response.data.data;
  },

  updateAccount: async (account: Account): Promise<Account> => {
    const response = await api.put<{ data: Account }>("/accounts", account);
    return response.data.data;
  },
};
