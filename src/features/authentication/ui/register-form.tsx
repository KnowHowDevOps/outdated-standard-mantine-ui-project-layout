import {
  Button,
  Paper,
  PasswordInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useRegisterForm } from "../model/use-register-form";
import { t } from "@lingui/core/macro";

export function RegisterForm() {
  const { form, handleSubmit, isPending } = useRegisterForm();

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <Title order={2} ta="center" mb="md">
        {t`Create Account`}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <TextInput
            label={t`First Name`}
            placeholder={t`John`}
            required
            {...form.getInputProps("first_name")}
          />

          <TextInput
            label={t`Last Name`}
            placeholder={t`Doe`}
            required
            {...form.getInputProps("last_name")}
          />

          <TextInput
            label={t`Email`}
            placeholder={t`your@email.com`}
            required
            {...form.getInputProps("email")}
          />

          <PasswordInput
            label={t`Password`}
            placeholder={t`Your password`}
            required
            {...form.getInputProps("password")}
          />

          <PasswordInput
            label={t`Confirm Password`}
            placeholder={t`Confirm your password`}
            required
            {...form.getInputProps("password_confirmation")}
          />

          <Button type="submit" fullWidth loading={isPending}>
            {t`Create Account`}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
