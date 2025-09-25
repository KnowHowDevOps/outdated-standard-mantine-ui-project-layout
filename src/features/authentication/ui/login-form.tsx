import { Button, Paper, Stack, Title } from "@mantine/core";
import { useForm } from "@mantine/form";
import { type LoginData } from "@/entities/auth";
import { useAuthSessionContext } from "@/processes/auth-session";
import { FormField } from "@/shared/ui";
import { notificationService } from "@/shared/lib";
import { loginValidation } from "../model/validation";

export function LoginForm() {
  const { login, isLoginPending } = useAuthSessionContext();

  const form = useForm<LoginData>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: loginValidation,
  });

  const handleSubmit = async (values: LoginData) => {
    try {
      await login(values);
      notificationService.success({
        message: "You have been logged in successfully",
      });
    } catch (error: any) {
      notificationService.error({
        title: "Login Failed",
        message: error?.response?.data?.message || "Invalid credentials",
      });
    }
  };

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <Title order={2} ta="center" mb="md">
        Sign In
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <FormField
            type="email"
            name="email"
            label="Email"
            placeholder="your@email.com"
            required
            form={form}
          />

          <FormField
            type="password"
            name="password"
            label="Password"
            placeholder="Your password"
            required
            form={form}
          />

          <Button type="submit" fullWidth loading={isLoginPending}>
            Sign In
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
