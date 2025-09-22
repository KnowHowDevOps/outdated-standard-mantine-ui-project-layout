import {
  Button,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { type RegisterAccountRequest } from "../../../entities/auth";
import { useAuthSessionContext } from "../../../processes/auth-session";
import { registerValidation } from "../model/validation";

export function RegisterForm() {
  const { register, isRegisterPending } = useAuthSessionContext();

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

  const handleSubmit = async (values: RegisterAccountRequest) => {
    try {
      await register(values);
      notifications.show({
        title: "Success!",
        message: "Account created successfully",
        icon: <IconCheck size="1rem" />,
        color: "green",
      });
    } catch (error: any) {
      notifications.show({
        title: "Registration Failed",
        message: error?.response?.data?.message || "Failed to create account",
        icon: <IconX size="1rem" />,
        color: "red",
      });
    }
  };

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <Title order={2} ta="center" mb="md">
        Create Account
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label="First Name"
            placeholder="John"
            required
            {...form.getInputProps("first_name")}
          />

          <TextInput
            label="Last Name"
            placeholder="Doe"
            required
            {...form.getInputProps("last_name")}
          />

          <TextInput
            label="Email"
            placeholder="your@email.com"
            required
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            {...form.getInputProps("password")}
          />

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            {...form.getInputProps("password_confirmation")}
          />

          <Button type="submit" fullWidth loading={isRegisterPending}>
            Create Account
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
