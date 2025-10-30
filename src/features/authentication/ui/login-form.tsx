import { Button, Paper, Stack, Title } from "@mantine/core";
import { FormField } from "@/shared/ui";
import { useLoginForm } from "../model/use-login-form";
import { t } from "@lingui/core/macro";

export function LoginForm() {
  const { form, handleSubmit, isPending } = useLoginForm();

  return (
    <Paper withBorder shadow="md" p={30} mt={30} radius="md">
      <Title order={2} ta="center" mb="md">
        {t`Sign In`}
      </Title>

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          <FormField
            type="email"
            name="email"
            label={t`Email`}
            placeholder={t`your@email.com`}
            required
            form={form}
          />

          <FormField
            type="password"
            name="password"
            label={t`Password`}
            placeholder={t`Your password`}
            required
            form={form}
          />

          <Button type="submit" fullWidth loading={isPending}>
            {t`Sign In`}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
