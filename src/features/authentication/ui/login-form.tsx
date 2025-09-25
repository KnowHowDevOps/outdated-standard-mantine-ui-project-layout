import { Button, Paper, Stack, Title } from "@mantine/core";
import { FormField } from "@/shared/ui";
import { useLoginForm } from "../model/use-login-form";

export function LoginForm() {
  const { form, handleSubmit, isPending } = useLoginForm();

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

          <Button type="submit" fullWidth loading={isPending}>
            Sign In
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
