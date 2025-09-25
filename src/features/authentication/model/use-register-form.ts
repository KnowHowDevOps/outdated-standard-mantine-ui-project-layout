import { useForm } from "@mantine/form";
import { type RegisterAccountRequest, authApi } from "@/entities/auth";
import { useFormMutation, queryClient } from "@/shared/lib";
import { registerValidation } from "./validation";

export function useRegisterForm() {
  const form = useForm<RegisterAccountRequest>({
    initialValues: {
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      locale: "en",
    },
    validate: registerValidation,
  });

  const mutation = useFormMutation<any, RegisterAccountRequest>(
    form,
    async (values) => authApi.register(values),
    {
      notifySuccess: {
        title: "Success!",
        message: "Account created successfully",
      },
      notifyError: {
        title: "Registration Failed",
        fallback: "Failed to create account",
        includeFieldErrorsInMessage: true,
      },
      onSuccess: (user) => {
        // Reflect new user in auth session cache for immediate UI updates
        queryClient.setQueryData(["auth-session"], user);
      },
    }
  );

  const handleSubmit = async (values: RegisterAccountRequest) => {
    await mutation.mutateAsync(values);
  };

  return {
    form,
    handleSubmit,
    isPending: mutation.isPending,
  } as const;
}
