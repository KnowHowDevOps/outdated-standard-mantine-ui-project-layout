import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/entities/auth";
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

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearAuthToken();
      queryClient.setQueryData([AUTH_SESSION_KEY], null);
      queryClient.clear();
    },
  });

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    logout: logoutMutation.mutateAsync,
    isLogoutPending: logoutMutation.isPending,
  };
}
