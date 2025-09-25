import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  authApi,
  type LoginData,
  type RegisterAccountRequest,
} from "@/entities/auth";
import { type User } from "@/entities/user";

const AUTH_SESSION_KEY = "auth-session";

export function useAuthSession() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: [AUTH_SESSION_KEY],
    queryFn: async () => {
      try {
        const response = await authApi.refreshAccessToken();
        return response.user;
      } catch {
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => authApi.login(data),
    onSuccess: (response) => {
      queryClient.setQueryData([AUTH_SESSION_KEY], response.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData([AUTH_SESSION_KEY], null);
      queryClient.clear();
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterAccountRequest) => authApi.register(data),
    onSuccess: (user) => {
      queryClient.setQueryData([AUTH_SESSION_KEY], user);
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login: loginMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    register: registerMutation.mutateAsync,
    isLoginPending: loginMutation.isPending,
    isLogoutPending: logoutMutation.isPending,
    isRegisterPending: registerMutation.isPending,
  };
}
