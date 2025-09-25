import { useForm } from "@mantine/form";
import { type LoginData, type LoginResponse, authApi } from "@/entities/auth";
import { useFormMutation, queryClient, setAuthToken } from "@/shared/lib";
import { loginValidation } from "./validation";

export function useLoginForm() {
  const form = useForm<LoginData>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: loginValidation,
  });

  const mutation = useFormMutation<LoginResponse, LoginData>(
    form,
    async (values) => authApi.login(values),
    {
      notifySuccess: { message: "You have been logged in successfully" },
      notifyError: {
        title: "Login Failed",
        fallback: "Invalid credentials",
        includeFieldErrorsInMessage: true,
      },
      onSuccess: (response) => {
        if (response?.token) {
          setAuthToken(response.token);
        }
        // Update auth session query data to reflect the new user
        queryClient.setQueryData(["auth-session"], response.user);
      },
    }
  );

  const handleSubmit = async (values: LoginData) => {
    await mutation.mutateAsync(values);
  };

  return {
    form,
    handleSubmit,
    isPending: mutation.isPending,
  } as const;
}