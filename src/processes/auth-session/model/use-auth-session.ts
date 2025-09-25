import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  authApi,
  type LoginData,
  type RegisterAccountRequest,
} from "@/entities/auth";
import { type User } from "@/entities/user";
import { clearAuthToken, setAuthToken } from "@/shared/lib/auth-token";

const AUTH_SESSION_KEY = "auth-session";

export function useAuthSession() {
  const queryClient = useQueryClient();

  const { data: user, isLoading } = useQuery({
    queryKey: [AUTH_SESSION_KEY],
    queryFn: async () => {
      try {
        const response = await authApi.refreshAccessToken();
        // If backend returns a token on refresh, store it for subsequent calls
        if (response?.token) {
          setAuthToken(response.token);
        }
        return response.user;
      } catch {
        clearAuthToken();
        return null;
      }
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: false,
  });

  const loginMutation = useMutation({
    mutationFn: (data: LoginData) => authApi.login(data),
    onSuccess: (response) => {
      // Persist access token for axios
      if (response?.token) {
        setAuthToken(response.token);
      }
      queryClient.setQueryData([AUTH_SESSION_KEY], response.user);
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuthToken();
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
